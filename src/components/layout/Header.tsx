import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface shadow-sm sticky top-0 z-50">
      <div className="px-8 py-9 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <NavLink
            to="/"
            className="font-display text-xl font-bold text-text-title"
          >
            LeoRent
          </NavLink>

          {/* Desktop nav — ховається на мобільних */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className="text-text-description hover:text-text-title transition-colors"
            >
              Оренда
            </NavLink>
            <NavLink
              to="/services"
              className="text-text-description hover:text-text-title transition-colors"
            >
              Послуги
            </NavLink>
            <NavLink
              to="/about"
              className="text-text-description hover:text-text-title transition-colors"
            >
              Про нас
            </NavLink>
          </nav>
        </div>

        {/* Desktop auth — ховається на мобільних */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to="/login"
            className="text-text-description hover:text-text-title transition-colors"
          >
            Увійти
          </NavLink>
          <NavLink
            to="/signup"
            className="text-text-description hover:text-text-title transition-colors"
          >
            Зареєструватись
          </NavLink>
        </div>

        {/* Burger — тільки на мобільних */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Меню"
        >
          <span
            className={`block h-0.5 w-6 bg-text-title transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-text-title transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-text-title transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <nav className="flex flex-col px-8 pb-4 gap-4 bg-surface border-t border-border">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-text-description hover:text-text-title transition-colors pt-4"
          >
            Оренда
          </NavLink>
          <NavLink
            to="/services"
            onClick={() => setMenuOpen(false)}
            className="text-text-description hover:text-text-title transition-colors"
          >
            Послуги
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="text-text-description hover:text-text-title transition-colors"
          >
            Про нас
          </NavLink>
          <div className="flex gap-6 pt-2 border-t border-border">
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-text-description hover:text-text-title transition-colors py-2"
            >
              Увійти
            </NavLink>
            <NavLink
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="text-text-description hover:text-text-title transition-colors py-2"
            >
              Зареєструватись
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
