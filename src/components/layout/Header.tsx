import { NavLink } from "react-router-dom";

export default function Header() {
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
          <nav className="flex items-center gap-8">
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
        <NavLink
          to="/login"
          className="text-text-description hover:text-text-title transition-colors"
        >
          Увійти
        </NavLink>
      </div>
    </header>
  );
}
