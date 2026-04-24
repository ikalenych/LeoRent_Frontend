// src/components/AiChatFab.tsx
import { useEffect, useRef, useState } from "react";
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    let retries = 0;
    const maxRetries = 1;

    const attemptSearch = async (): Promise<void> => {
      try {
        const data = await aiSearchApartments(userMessage, 1, 3);
        const apartments = data.apartments;

        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: `Знайшов ${data.total || apartments.length} варіантів:`,
            apartments,
          },
        ]);
        setIsLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Невідома помилка";

        if (
          errorMessage.includes("AI недоступний (ліміт)") &&
          retries < maxRetries
        ) {
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
          setIsLoading(false);
        }
      }
    };

    await attemptSearch();
  }

  function handleAuthRequired() {
    setIsOpen(false);
    openAuthModal?.();
  }

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

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[calc(100%-2rem)] sm:w-[400px] sm:max-w-[400px]">
      <div
        className={`flex flex-col bg-white rounded-2xl shadow-2xl ${
          isMinimized ? "h-[70px]" : "h-[500px] sm:h-[600px]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-blue-600 px-4 py-3 rounded-t-2xl">
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                        {/* AI повідомлення з квартирами - остаточна версія */}
{message.role === "ai" &&
  message.apartments &&
  message.apartments.length > 0 ? (
  <div>
    <p className="mb-3 text-sm">{message.content}</p>
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
      {message.apartments.map((apt) => {
        // Спробуємо всі можливі поля з фото
        let photoUrl: string | null | undefined = null;

        if (apt.pictures && apt.pictures.length > 0) {
          photoUrl = apt.pictures[0].url;
        } else if (apt.picture) {
          photoUrl = apt.picture;
        }

        // Якщо це дефолтне фото — вважаємо, що фото немає
        if (photoUrl && photoUrl.includes("default.jpg")) {
          photoUrl = null;
        }

        return (
          <button
            key={apt.id_}
            onClick={() => navigate(`/listings/${apt.id_}`)}
            className="w-full rounded-xl p-3 text-left hover:bg-emerald-50 active:bg-emerald-100 transition-all border border-gray-100 flex gap-3 group"
          >
            {/* Фото блок */}
            <div className="h-14 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={apt.title || "Квартира"}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    console.error("Фото не завантажилось:", photoUrl); // для дебагу
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-2xl">
                  📷
                </div>
              )}
            </div>

            {/* Інформація */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                {apt.title || "Без назви"}
              </h4>
              <p className="text-emerald-600 font-semibold mt-1 text-base">
                {apt.cost.toLocaleString("uk-UA")} ₴
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {apt.rooms} кімн. • {apt.district || "—"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
) : (
  <p className="text-sm break-words">{message.content}</p>
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

            {/* Input */}
            <div className="border-t border-gray-200 bg-white p-3 rounded-b-2xl">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Опиши, що шукаєш..."
                  className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white transition hover:scale-105 active:scale-95 disabled:opacity-40"
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