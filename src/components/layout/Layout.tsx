import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AuthRequiredModal from "../AuthRequiredModal";
import AiFilterButton from "../AiFilterButton";

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-page font-serif">
      <Header />
      <main className={`flex-1 ${isHome ? "" : "pt-20"}`}>
        <Outlet />
      </main>
      <AiFilterButton />
      <AuthRequiredModal />
      <Footer />
    </div>
  );
}
