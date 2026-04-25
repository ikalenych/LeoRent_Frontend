export default function Footer() {
  return (
    <footer className="bg-surface border-t border-gray-200/60 font-display">
      <div className="px-8 py-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: Brand */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
            <span className="font-display font-bold text-text-title text-2xl">
              LeoRent
            </span>
          </div>
          <p className="text-text-description text-xs">
            © {new Date().getFullYear()} LeoRent. Всі права захищені.
          </p>
        </div>

        {/* Right: Social + Links */}
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:gap-6">
          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-white hover:bg-emerald-50 hover:text-emerald-500 text-text-description transition-all duration-300 border border-gray-200/70 hover:border-emerald-200 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            <a
              href="https://github.com/ikalenych/LeoRent_Frontend"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-white hover:bg-emerald-50 hover:text-emerald-500 text-text-description transition-all duration-300 border border-gray-200/70 hover:border-emerald-200 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S9 17.44 9 18v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
          </div>

          {/* Bottom links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-description">
            <span className="text-text-description/70 text-xs">
              Львів • Україна
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
