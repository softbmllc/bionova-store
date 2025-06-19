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
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { items } = useCart();
  const location = useLocation();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isProductPage = location.pathname.startsWith("/producto/");
  const isShopPage = location.pathname.startsWith("/shop");

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-transparent text-black">
      {/* Solo ocultamos el HEADER si es página de producto o de shop */}
      {!isProductPage && !isShopPage && (
        <header className="bg-white/50 backdrop-blur-md text-black fixed top-0 w-full z-50 shadow-sm py-0.5">
          {/* Versión Mobile */}
          <div className="flex sm:hidden items-center justify-between px-4 py-0.5">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Bionova"
                className="max-h-[2.25rem] w-auto object-contain"
              />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <FaGlobe className="text-[#004AAD] w-4 h-4" />
                <button onClick={() => i18n.changeLanguage('es')} className={`text-xs px-1 py-0.5 ${i18n.language === 'es' ? 'font-semibold text-[#004AAD]' : 'text-[#004AAD]'}`}>ES</button>
                <button onClick={() => i18n.changeLanguage('en')} className={`text-xs px-1 py-0.5 ${i18n.language === 'en' ? 'font-semibold text-[#004AAD]' : 'text-[#004AAD]'}`}>EN</button>
              </div>
              <Link to="/carrito" className="relative text-[#004AAD]">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                className="text-[#004AAD]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="sm:hidden px-4 pb-2">
              <nav className="flex flex-col gap-2 text-sm">
                <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-[#004AAD] font-semibold">
                  {t("nav.shop", "Tienda")}
                </Link>
                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-[#004AAD] font-semibold">
                  {t("nav.about", "Nosotros")}
                </Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-[#004AAD] font-semibold">
                  {t("nav.contact", "Contacto")}
                </Link>
              </nav>
            </div>
          )}

          {/* Versión Desktop */}
          <div className="hidden sm:flex max-w-7xl mx-auto px-4 py-1 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Bionova"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <nav className="flex items-center gap-6 text-base">
              <Link to="/shop" className="text-[#004AAD] hover:text-[#003B85] font-semibold">{t("nav.shop", "Shop")}</Link>
              <Link to="/about" className="text-[#004AAD] hover:text-[#003B85] font-semibold">{t("nav.about", "About")}</Link>
              <Link to="/contact" className="text-[#004AAD] hover:text-[#003B85] font-semibold">{t("nav.contact", "Contact")}</Link>
            </nav>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FaGlobe className="text-[#004AAD] w-4 h-4" />
                <button onClick={() => i18n.changeLanguage('es')} className={`text-sm px-2 py-0.5 ${i18n.language === 'es' ? 'font-semibold text-[#004AAD]' : 'text-[#004AAD]'}`}>ES</button>
                <button onClick={() => i18n.changeLanguage('en')} className={`text-sm px-2 py-0.5 ${i18n.language === 'en' ? 'font-semibold text-[#004AAD]' : 'text-[#004AAD]'}`}>EN</button>
              </div>
              <Link to="/carrito" className="relative text-[#004AAD]">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
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