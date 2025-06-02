// src/components/Layout.tsx
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Rocket } from "lucide-react";
import Footer from "./Footer";
import VideoShowcase from "./VideoShowcase";
import logo from "/logo.png";
import { FaInstagram } from "react-icons/fa";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { items } = useCart();
  const location = useLocation();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const { t } = useTranslation();

  const isProductPage = location.pathname.startsWith("/producto/");

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-transparent text-black">
      {/* Solo ocultamos el HEADER si es página de producto */}
      {!isProductPage && (
        <header className="bg-white/50 backdrop-blur-md text-black fixed top-0 w-full z-50 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 py-4 sm:py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Looma"
                className="w-14 h-14 object-contain"
              />
              <span className="font-bold text-lg tracking-tight hidden sm:inline">Looma</span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base">
              <Link to="/shop" className="hover:text-gray-600 font-semibold transition-colors">
                {t("nav.shop", "Shop")}
              </Link>
              <Link to="/about" className="hover:text-gray-600 font-semibold transition-colors">
                {t("nav.about", "About")}
              </Link>
              <Link to="/contact" className="hover:text-gray-600 font-semibold transition-colors">
                {t("nav.contact", "Contact")}
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => i18n.changeLanguage("es")}
                  className={`text-sm font-semibold transition-colors ${
                    i18n.language === "es" ? "text-black underline" : "text-gray-400"
                  }`}
                >
                  ES
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={() => i18n.changeLanguage("en")}
                  className={`text-sm font-semibold transition-colors ${
                    i18n.language === "en" ? "text-black underline" : "text-gray-400"
                  }`}
                >
                  EN
                </button>
              </div>
            </nav>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/looma.store"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <Link to="/carrito" className="relative hover:text-gray-300 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </header>
      )}

      <main
        className="flex-grow w-full bg-transparent text-black"
      >
        {children}
        {location.pathname === "/" && <VideoShowcase />}
      </main>

      {/* El Footer siempre se muestra */}
      <div className="bg-transparent text-black">
        <Footer />
      </div>
    </div>
  );
}