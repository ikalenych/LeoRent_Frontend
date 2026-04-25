import { useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { UserAvatar } from "../ui/UserAvatar";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";

type StoredUser = {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  user_type?: "OWNER" | "AGENT" | "DEFAULT";
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors font-medium text-sm ${
    isActive
      ? "text-emerald-500"
      : "text-text-description hover:text-text-title"
  }`;

function getUserDisplayName(user: StoredUser | null) {
  if (!user) return "";

  const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  if (fullName) return fullName;

  if (user.first_name?.trim()) return user.first_name.trim();

  if (user.email?.trim()) return user.email.trim().split("@")[0];

  return "Користувач";
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: storedUser, isAuthenticated, logout } = useAuth();

  const username = useMemo(() => getUserDisplayName(storedUser), [storedUser]);

  const isProfilePage = location.pathname === "/profile";

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      localStorage.removeItem("leorent-signup");
      setMenuOpen(false);
      navigate("/");
    }
  }

  function handleProfileClick() {
    navigate("/profile");
    setMenuOpen(false);
  }

  return (
    <>
      <div className="fixed top-3 left-0 right-0 z-3000 flex justify-center px-6">
        <header className="w-full max-w-400 bg-white/75 backdrop-blur-md border border-white/40 shadow-md rounded-full px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <NavLink
              to="/"
              className="font-display text-lg font-bold text-text-title whitespace-nowrap"
            >
              LeoRent
            </NavLink>

            <nav className="hidden md:flex items-center gap-7">
              <NavLink to="/" end className={navLinkClass}>
                Головна
              </NavLink>
              <NavLink to="/listings" className={navLinkClass}>
                Оренда
              </NavLink>
              <NavLink to="/about-us" className={navLinkClass}>
                Про нас
              </NavLink>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Увійти
                </NavLink>

                <NavLink
                  to="/signup"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors whitespace-nowrap"
                >
                  Зареєструватись
                </NavLink>
              </>
            ) : isProfilePage ? (
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer text-sm font-medium text-text-description transition-colors hover:text-text-title"
              >
                Вийти
              </button>
            ) : (
              <button
                type="button"
                onClick={handleProfileClick}
                className="flex cursor-pointer items-center gap-3 rounded-full px-2 py-1 transition hover:bg-white/70"
              >
                <UserAvatar username={username} size="sm" />
                <span className="text-sm font-medium text-text-title">
                  {username}
                </span>
              </button>
            )}
          </div>

          <button
            className="md:hidden flex flex-col gap-1.5"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Меню"
          >
            <span
              className={`block h-0.5 w-5 bg-text-title transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-text-title transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-text-title transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </header>

        <div
          className={`md:hidden absolute top-16 left-4 right-4 overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-3 bg-white/80 backdrop-blur-md border border-white/40 shadow-md rounded-3xl px-6 py-4">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Головна
            </NavLink>

            <NavLink
              to="/listings"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Оренда
            </NavLink>

            <NavLink
              to="/about-us"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Про нас
            </NavLink>

            <div className="flex gap-4 pt-2 border-t border-gray-100">
              {!isAuthenticated ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className={navLinkClass}
                  >
                    Увійти
                  </NavLink>

                  <NavLink
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className={navLinkClass}
                  >
                    Зареєструватись
                  </NavLink>
                </>
              ) : isProfilePage ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer text-sm font-medium text-text-description transition-colors hover:text-text-title"
                >
                  Вийти
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <UserAvatar username={username} size="sm" />
                  <span className="text-sm font-medium text-text-title">
                    {username}
                  </span>
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
