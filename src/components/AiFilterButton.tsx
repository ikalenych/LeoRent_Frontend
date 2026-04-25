// src/components/AiChatFab.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  MessageCircle,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLiked } from "../context/LikedContext";
import {
  aiSearchApartments,
  type BackendApartmentPreview,
} from "../api/apartments";
import { useNavigate } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────

const CACHE_KEY_PREFIX = "ai_chat_cache_";
const COOLDOWN_SECONDS = 20;
const CACHE_TTL_MS = 30 * 60 * 1000;

const MIN_W = 300;
const MIN_H = 400;
const MAX_W = 700;
const MAX_H = 800;

// ─── Cache types ──────────────────────────────────────────────────────────────

interface CacheEntry {
  apartments: BackendApartmentPreview[];
  cachedAt: number;
}

// ─── Stop-words ───────────────────────────────────────────────────────────────

const STOP_WORDS = [
  "добрий день",
  "добрий вечір",
  "доброго ранку",
  "доброго дня",
  "будь ласка",
  "будь-ласка",
  "будьте ласкаві",
  "знайди мені",
  "покажи мені",
  "хотів би",
  "хотіла б",
  "good morning",
  "good evening",
  "thank you",
  "привіт",
  "здрастуйте",
  "вітаю",
  "пожалуйста",
  "дякую",
  "спасибі",
  "hello",
  "hi",
  "hey",
  "please",
  "thanks",
  "хочу",
  "шукаю",
  "знайди",
  "покажи",
  "можна",
  "можеш",
  "підкажи",
  "допоможи",
];

const GREETING_ONLY_WORDS = new Set([
  "привіт",
  "вітаю",
  "здрастуйте",
  "hello",
  "hi",
  "hey",
  "добрий",
  "доброго",
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cleanPrompt(raw: string): string {
  let text = raw.toLowerCase().trim();
  const sorted = [...STOP_WORDS].sort((a, b) => b.length - a.length);
  for (const word of sorted) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `(?<![а-яіїєґёa-z])${escaped}(?![а-яіїєґёa-z])`,
      "gi",
    );
    text = text.replace(pattern, " ");
  }
  return text.replace(/\s+/g, " ").trim();
}

function isGreetingOnly(raw: string): boolean {
  const cleaned = cleanPrompt(raw.toLowerCase().trim());
  if (!cleaned) return true;
  const words = cleaned.split(/\s+/);
  return words.every((w) => GREETING_ONLY_WORDS.has(w));
}

function readCache(key: string): BackendApartmentPreview[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY_PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY_PREFIX + key);
      return null;
    }
    return entry.apartments;
  } catch {
    return null;
  }
}

function writeCache(key: string, apartments: BackendApartmentPreview[]): void {
  try {
    const entry: CacheEntry = { apartments, cachedAt: Date.now() };
    sessionStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(entry));
  } catch {}
}

/** Чи маємо touch-пристрій (мобілка/планшет) */
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AiChatFab() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useLiked();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<
    {
      role: "user" | "ai";
      content: string;
      apartments?: BackendApartmentPreview[];
    }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // ── Drag & Resize state ─────────────────────────────────────────────────────
  // position: відстань від правого/нижнього краю (щоб не конфліктувало з FAB)
  const [pos, setPos] = useState<{ right: number; bottom: number }>({
    right: 24,
    bottom: 96,
  });
  const [size, setSize] = useState<{ w: number; h: number }>({
    w: 400,
    h: 560,
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // drag refs
  const dragStart = useRef<{
    mx: number;
    my: number;
    right: number;
    bottom: number;
  } | null>(null);

  // resize refs
  const resizeStart = useRef<{
    mx: number;
    my: number;
    w: number;
    h: number;
    right: number;
    bottom: number;
    edge: "n" | "nw" | "w";
  } | null>(null);

  // ── Адаптація під ширину екрану ─────────────────────────────────────────────
  useEffect(() => {
    function clampToViewport() {
      if (isTouchDevice()) return; // на мобілці не чіпаємо
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setSize((s) => ({
        w: Math.min(s.w, vw - 32),
        h: Math.min(s.h, vh - 32),
      }));
      setPos((p) => ({
        right: Math.min(p.right, vw - MIN_W - 8),
        bottom: Math.min(p.bottom, vh - MIN_H - 8),
      }));
    }
    window.addEventListener("resize", clampToViewport);
    return () => window.removeEventListener("resize", clampToViewport);
  }, []);

  // ── Drag (тільки desktop) ───────────────────────────────────────────────────
  const onHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice() || isMinimized) return;
      e.preventDefault();
      dragStart.current = {
        mx: e.clientX,
        my: e.clientY,
        right: pos.right,
        bottom: pos.bottom,
      };
    },
    [pos, isMinimized],
  );

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.mx;
      const dy = e.clientY - dragStart.current.my;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const newRight = Math.max(
        8,
        Math.min(vw - size.w - 8, dragStart.current.right - dx),
      );
      const newBottom = Math.max(
        8,
        Math.min(vh - size.h - 8, dragStart.current.bottom - dy),
      );
      setPos({ right: newRight, bottom: newBottom });
    }
    function onMouseUp() {
      dragStart.current = null;
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [size]);

  // ── Resize (тільки desktop) ─────────────────────────────────────────────────
  const onResizeMouseDown = useCallback(
    (e: React.MouseEvent, edge: "n" | "nw" | "w") => {
      if (isTouchDevice()) return;
      e.preventDefault();
      e.stopPropagation();
      resizeStart.current = {
        mx: e.clientX,
        my: e.clientY,
        w: size.w,
        h: size.h,
        right: pos.right,
        bottom: pos.bottom,
        edge,
      };
    },
    [size, pos],
  );

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!resizeStart.current) return;
      const { mx, my, w, h, right, bottom, edge } = resizeStart.current;
      const dx = e.clientX - mx; // positive = moved right
      const dy = e.clientY - my; // positive = moved down

      let newW = w;
      let newH = h;
      let newRight = right;
      let newBottom = bottom;

      // North edge → drag up = taller (dy negative → bigger height)
      if (edge === "n" || edge === "nw") {
        newH = Math.max(MIN_H, Math.min(MAX_H, h - dy));
        // anchor bottom: when height grows, bottom stays, panel grows up
      }
      // West edge → drag left = wider (dx negative → bigger width)
      if (edge === "w" || edge === "nw") {
        newW = Math.max(MIN_W, Math.min(MAX_W, w - dx));
        // anchor right: when width grows, right stays, panel grows left
        newRight = right; // unchanged
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // clamp so panel stays on screen
      newRight = Math.max(8, Math.min(vw - newW - 8, newRight));
      newBottom = Math.max(8, Math.min(vh - newH - 8, newBottom));

      setSize({ w: newW, h: newH });
      setPos({ right: newRight, bottom: newBottom });
    }
    function onMouseUp() {
      resizeStart.current = null;
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // ── Cooldown ────────────────────────────────────────────────────────────────

  function startCooldown(seconds = COOLDOWN_SECONDS) {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldown(seconds);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  // ── Scroll / focus ──────────────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // ── Send message ────────────────────────────────────────────────────────────

  async function sendMessage() {
    if (!input.trim() || isLoading || cooldown > 0) return;

    const userMessage = input.trim();
    setInput("");

    if (isGreetingOnly(userMessage)) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        {
          role: "ai",
          content:
            "Привіт! 👋 Чим можу допомогти? Розкажи яку квартиру шукаєш — район, кількість кімнат, бюджет.",
        },
      ]);
      return;
    }

    const cleaned = cleanPrompt(userMessage);

    const cached = readCache(cleaned);
    if (cached) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        {
          role: "ai",
          content: `Знайшов ${cached.length} варіантів:`,
          apartments: cached,
        },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    let retries = 0;
    const maxRetries = 1;

    const attemptSearch = async (): Promise<void> => {
      try {
        const data = await aiSearchApartments(cleaned, 1, 3);
        const apartments = data.apartments;

        writeCache(cleaned, apartments);

        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: `Знайшов ${data.total || apartments.length} варіантів:`,
            apartments,
          },
        ]);

        startCooldown(COOLDOWN_SECONDS);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Невідома помилка";

        const isRateLimit =
          errorMessage.includes("AI недоступний (ліміт)") ||
          errorMessage.includes("429");

        if (isRateLimit && retries < maxRetries) {
          retries++;
          const match = errorMessage.match(/(\d+)с/);
          const delay = match ? parseInt(match[1]) * 1000 : 2000;

          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              content: `⏳ Ліміт запитів. Чекаю ${Math.ceil(delay / 1000)} сек...`,
            },
          ]);

          await new Promise((resolve) => setTimeout(resolve, delay));
          await attemptSearch();
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              content: errorMessage || "Щось пішло не так 😔 Спробуй ще раз",
            },
          ]);
          if (isRateLimit) startCooldown(COOLDOWN_SECONDS);
        }
      } finally {
        setIsLoading(false);
      }
    };

    await attemptSearch();
  }

  function handleAuthRequired() {
    setIsOpen(false);
    openAuthModal?.();
  }

  const isSendDisabled = !input.trim() || isLoading || cooldown > 0;
  const mobile = isTouchDevice();

  // ── Closed FAB ──────────────────────────────────────────────────────────────

  if (!isOpen) {
    return (
      <button
        onClick={() =>
          isAuthenticated ? setIsOpen(true) : handleAuthRequired()
        }
        className="fixed bottom-22 z-[2000] right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group"
        aria-label="AI чат"
      >
        <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
      </button>
    );
  }

  // ── Open chat panel ─────────────────────────────────────────────────────────

  // На мобілці — фіксована позиція як раніше, без drag/resize
  const panelStyle: React.CSSProperties = mobile
    ? {
        position: "fixed",
        bottom: 96,
        right: 24,
        left: 8,
        zIndex: 2000,
      }
    : {
        position: "fixed",
        bottom: pos.bottom,
        right: pos.right,
        width: size.w,
        zIndex: 2000,
      };

  const panelHeight = isMinimized ? 70 : mobile ? undefined : size.h;

  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className={mobile ? "" : "select-none"}
    >
      {/* ── Resize handle: top edge (north) ─────────────────────────────── */}
      {!mobile && !isMinimized && (
        <div
          onMouseDown={(e) => onResizeMouseDown(e, "n")}
          className="absolute -top-1.5 left-4 right-4 h-3 cursor-n-resize z-10 rounded-full"
          title="Змінити висоту"
        />
      )}

      {/* ── Resize handle: left edge (west) ─────────────────────────────── */}
      {!mobile && !isMinimized && (
        <div
          onMouseDown={(e) => onResizeMouseDown(e, "w")}
          className="absolute top-4 bottom-4 -left-1.5 w-3 cursor-w-resize z-10 rounded-full"
          title="Змінити ширину"
        />
      )}

      {/* ── Resize handle: top-left corner (nw) ─────────────────────────── */}
      {!mobile && !isMinimized && (
        <div
          onMouseDown={(e) => onResizeMouseDown(e, "nw")}
          className="absolute -top-1.5 -left-1.5 w-5 h-5 cursor-nw-resize z-20"
          title="Змінити розмір"
        />
      )}

      <div
        className="flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ height: panelHeight }}
      >
        {/* Header — drag handle на desktop */}
        <div
          onMouseDown={onHeaderMouseDown}
          className={`flex items-center justify-between bg-gradient-to-r from-emerald-500 to-blue-600 px-4 py-3 rounded-t-2xl flex-shrink-0 ${
            !mobile && !isMinimized ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">AI LeoRent</h3>
              <p className="text-xs text-white/80 hidden sm:block">
                Шукай квартири природною мовою
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/80 hover:bg-white/20 active:bg-white/30"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/80 hover:bg-white/20 active:bg-white/30"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center mb-3">
                    <MessageCircle className="h-7 w-7 text-emerald-600" />
                  </div>
                  <p className="text-base font-semibold text-gray-800 mb-1">
                    Привіт! 👋
                  </p>
                  <p className="text-sm text-gray-600 max-w-[250px]">
                    Запитай що завгодно про квартири
                  </p>
                  <div className="mt-6 space-y-2 w-full">
                    <button
                      onClick={() => {
                        setInput("2кім у Сихові до 15к");
                        inputRef.current?.focus();
                      }}
                      className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 active:bg-emerald-200 w-full"
                    >
                      💡 2кім у Сихові до 15к
                    </button>
                    <button
                      onClick={() => {
                        setInput("центр 1к");
                        inputRef.current?.focus();
                      }}
                      className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 active:bg-emerald-200 w-full"
                    >
                      💡 Центр 1 кімната
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white"
                            : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                        }`}
                      >
                        {message.role === "ai" &&
                        message.apartments &&
                        message.apartments.length > 0 ? (
                          <div>
                            <p className="mb-3 text-sm">{message.content}</p>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              {message.apartments.map((apt) => {
                                let photoUrl: string | null | undefined = null;
                                if (apt.pictures && apt.pictures.length > 0) {
                                  photoUrl = apt.pictures[0].url;
                                } else if (apt.picture) {
                                  photoUrl = apt.picture;
                                }
                                if (
                                  photoUrl &&
                                  photoUrl.includes("default.jpg")
                                ) {
                                  photoUrl = null;
                                }
                                return (
                                  <button
                                    key={apt.id_}
                                    onClick={() =>
                                      navigate(`/listings/${apt.id_}`)
                                    }
                                    className="w-full rounded-xl p-3 text-left hover:bg-emerald-50 active:bg-emerald-100 transition-all border border-gray-100 flex gap-3 group"
                                  >
                                    <div className="h-14 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                      {photoUrl ? (
                                        <img
                                          src={photoUrl}
                                          alt={apt.title || "Квартира"}
                                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                          onError={(e) => {
                                            (
                                              e.target as HTMLImageElement
                                            ).style.display = "none";
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-2xl">
                                          📷
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                      <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                                        {apt.title || "Без назви"}
                                      </h4>
                                      <p className="text-emerald-600 font-semibold mt-1 text-base">
                                        {apt.cost.toLocaleString("uk-UA")} ₴
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {apt.rooms} кімн. •{" "}
                                        {apt.district || "—"}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm break-words">
                            {message.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-2xl px-3.5 py-2">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                          <span className="text-sm text-gray-600">
                            AI думає...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-gray-200 bg-white p-3 rounded-b-2xl flex-shrink-0">
              {cooldown > 0 && (
                <div className="mb-2 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5">
                  <Loader2 className="h-3.5 w-3.5 text-amber-500 animate-spin flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    ⏳ Обмеження запитів, повторно можна надіслати через{" "}
                    <span className="font-semibold">{cooldown}с</span>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Опиши, що шукаєш..."
                  className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 disabled:opacity-60"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={isLoading || cooldown > 0}
                />
                <button
                  onClick={sendMessage}
                  disabled={isSendDisabled}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white transition hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex justify-between mt-1 px-1">
                <p className="text-xs text-gray-400">Enter - відправити</p>
                <p className="text-xs text-gray-400">{input.length}/300</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
