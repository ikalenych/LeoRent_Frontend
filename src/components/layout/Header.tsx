import { useState } from "react";
import { NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors font-medium text-sm ${
    isActive
      ? "text-emerald-500"
      : "text-text-description hover:text-text-title"
  }`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed top-3 left-0 right-0 z-50 flex justify-center px-6">
        <header className="w-full max-w-6xl bg-white/75 backdrop-blur-md border border-white/40 shadow-md rounded-full px-6 h-14 flex items-center justify-between">
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
              <NavLink to="/rent" className={navLinkClass}>
                Оренда
              </NavLink>
              <NavLink to="/services" className={navLinkClass}>
                Про нас
              </NavLink>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/login" className={navLinkClass}>
              Увійти
            </NavLink>
            <NavLink
              to="/signup"
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors whitespace-nowrap"
            >
              Зареєструватись
            </NavLink>
          </div>

          <button
            className="md:hidden flex flex-col gap-1.5"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Меню"
          >
            <span
              className={`block h-0.5 w-5 bg-text-title transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-text-title transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-text-title transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </header>

        {/* Mobile menu */}
        <div
          className={`md:hidden absolute top-16 left-4 right-4 overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}
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
              to="/rent"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Оренда
            </NavLink>
            <NavLink
              to="/services"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Про нас
            </NavLink>
            <div className="flex gap-4 pt-2 border-t border-gray-100">
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
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
