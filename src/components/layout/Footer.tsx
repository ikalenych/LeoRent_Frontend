import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-gray-100 font-display">
      <div className="px-8 py-16 h-16 flex items-center justify-between">
        <div>
          <span className="font-display font-bold text-text-title text-2xl">
            LeoRent
          </span>
          <p className="text-text-description text-sm mt-1">
            © 2026 LeoRent. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-text-description">
          <NavLink
            to="/terms"
            className="hover:text-text-title transition-colors"
          >
            Terms of Service
          </NavLink>
          <NavLink
            to="/privacy"
            className="hover:text-text-title transition-colors"
          >
            Privacy Policy
          </NavLink>
          <NavLink
            to="/contact"
            className="hover:text-text-title transition-colors"
          >
            Contact Us
          </NavLink>
          <NavLink
            to="/about"
            className="hover:text-text-title transition-colors"
          >
            About Lviv
          </NavLink>
        </div>
      </div>
    </footer>
  );
}
