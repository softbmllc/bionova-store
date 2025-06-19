// src/components/CategorySection.tsx
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFutbol, FaBasketballBall } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function CategorySection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (  
    <section
  id="catalogo"
  className="py-10 sm:py-24 text-center scroll-mt-16 bg-white"
>
      <Helmet>
        <title>Categorías | Looma</title>
        <meta
          name="keywords"
          content="ropa para mascotas, hogar, fitness, gadgets, electrónicos, productos dropshipping USA, Looma"
        />
        <meta
          name="description"
          content="Explorá productos de hogar, fitness, electrónica y más. Elegí tu categoría favorita y descubrí lo último en estilo y funcionalidad."
        />
      </Helmet>

      <motion.p
        className="text-sm uppercase text-[#003366] tracking-widest mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {t('categories.eyebrow')}
      </motion.p>
      <h2 className="block sm:hidden text-3xl font-bold text-center mb-10 tracking-tight text-[#365486] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] leading-tight">
        {t('categories.shortTitle')}
      </h2>
      <h2 className="hidden sm:block text-6xl font-extrabold text-center mb-10 tracking-tight text-[#365486] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] leading-tight transition-all duration-700">
        {t('categories.title')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
        {/* Fútbol */}
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={() => navigate("/shop?brand=FUXION")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/shop?brand=FUXION")}
          className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg ring-1 ring-white/10 transition-transform duration-500 hover:scale-105 active:scale-95 cursor-pointer h-72 bg-white"
        >
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="flex items-center justify-center w-full h-full">
              <motion.img
                src="/images/logo-fuxion.png"
                alt="Fuxion"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-[90%] max-h-[90%] h-[150px] mx-auto object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        </motion.div>

        {/* NBA */}
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={() => navigate("/shop?brand=PURE")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/shop?brand=PURE")}
          className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg ring-1 ring-white/10 transition-transform duration-500 hover:scale-105 active:scale-95 cursor-pointer h-72 bg-white"
        >
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="flex items-center justify-center w-full h-full">
              <motion.img
                src="/images/logo-pure.png"
                alt="Pure"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-[90%] max-h-[90%] h-[150px] mx-auto object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        </motion.div>

        {/* Double Wood */}
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={() => navigate("/shop?brand=DOUBLEWOOD")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/shop?brand=DOUBLEWOOD")}
          className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg ring-1 ring-white/10 transition-transform duration-500 hover:scale-105 active:scale-95 cursor-pointer h-72 bg-white"
        >
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="flex items-center justify-center w-full h-full">
              <motion.img
                src="/images/Double Wood-logo.png"
                alt="Double Wood"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-[90%] max-h-[90%] h-[150px] mx-auto object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}