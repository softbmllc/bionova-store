// src/components/Layout.tsx
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Rocket } from "lucide-react";
import Footer from "./Footer";
import VideoShowcase from "./VideoShowcase";
import logo from "/logo.png";
import { FaInstagram, FaGlobe } from "react-icons/fa";
import i18n from "..";
import { useTranslation } from "react-i18next";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { items } = useCart();
  const location = useLocation();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const { t } = useTranslation();

  const isProductPage = location.pathname.startsWith("/producto/");
  const isShopPage = location.pathname.startsWith("/shop");

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-transparent text-black">
      {/* Solo ocultamos el HEADER si es página de producto o de shop */}
      {!isProductPage && !isShopPage && (
        <header className="bg-white/50 backdrop-blur-md text-black fixed top-0 w-full z-50 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 py-1 sm:py-0.5 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Bionova"
                className="w-16 h-16 object-contain"
              />
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base">
              <Link
                to="/shop"
                onClick={() => {
                  if (location.pathname === "/shop") {
                    window.location.href = "/shop";
                  }
                }}
                className="text-[#004AAD] hover:text-[#003B85] font-semibold transition-colors"
              >
                {t("nav.shop", "Shop")}
              </Link>
              <Link to="/about" className="text-[#004AAD] hover:text-[#003B85] font-semibold transition-colors">
                {t("nav.about", "About")}
              </Link>
              <Link to="/contact" className="text-[#004AAD] hover:text-[#003B85] font-semibold transition-colors">
                {t("nav.contact", "Contact")}
              </Link>
              <div className="flex items-center gap-1">
                <FaGlobe className="text-[#004AAD] w-4 h-4" />
                <button
                  onClick={() => i18n.changeLanguage("es")}
                  className={`text-xs sm:text-sm px-2 py-0.5 rounded-md transition-colors ${
                    i18n.language === "es"
                      ? "text-[#004AAD] hover:text-[#003B85] font-semibold"
                      : "text-[#004AAD] hover:text-[#003B85] font-semibold"
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => i18n.changeLanguage("en")}
                  className={`text-xs sm:text-sm px-2 py-0.5 rounded-md transition-colors ${
                    i18n.language === "en"
                      ? "text-[#004AAD] hover:text-[#003B85] font-semibold"
                      : "text-[#004AAD] hover:text-[#003B85] font-semibold"
                  }`}
                >
                  EN
                </button>
              </div>
            </nav>
            <div className="flex items-center gap-4">
              <Link to="/carrito" className="relative text-[#004AAD] hover:text-[#003B85] transition-colors">
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

      <main className="pt-0 flex-grow w-full bg-transparent text-black">
        {children}
        {location.pathname === "/" && <VideoShowcase />}
      </main>

      <Footer />
    </div>
  );
}