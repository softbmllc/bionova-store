// src/components/CategorySection.tsx
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFutbol, FaBasketballBall } from "react-icons/fa";

export default function CategorySection() {
  const navigate = useNavigate();

  return (
    <section
  id="catalogo"
  className="py-24 text-center scroll-mt-16 bg-white"
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
        className="text-sm uppercase text-black/50 tracking-widest mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        ESTILO Y PASIÓN
      </motion.p>
      <h2 className="text-4xl sm:text-5xl font-extrabold mb-12 text-black tracking-tight uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
        CATEGORÍAS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-6xl mx-auto px-6">
        {/* Fútbol */}
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={() => navigate("/futbol?filter=FUTBOL")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/futbol?filter=FUTBOL")}
          className="group relative rounded-xl overflow-hidden shadow-xl ring-1 ring-white/10 transition-transform duration-500 hover:scale-105 cursor-pointer"
        >
          <img
            src="/images/categoria-futbol.jpg"
            alt="Fútbol"
            className="w-full h-72 object-cover group-hover:scale-110 transition-all duration-500"
          />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="flex items-center gap-2">
              <FaFutbol className="text-black text-2xl group-hover:text-[#00ffc8] transition-colors duration-300" />
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-black text-3xl sm:text-4xl font-extrabold tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,1)]"
              >
                FÚTBOL
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* NBA */}
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={() => navigate("/futbol?filter=NBA")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/futbol?filter=NBA")}
          className="group relative rounded-xl overflow-hidden shadow-xl ring-1 ring-white/10 transition-transform duration-500 hover:scale-105 cursor-pointer"
        >
          <img
            src="/images/categoria-nba.jpg"
            alt="NBA"
            className="w-full h-72 object-cover group-hover:scale-110 transition-all duration-500"
          />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="flex items-center gap-2">
              <FaBasketballBall className="text-black text-2xl group-hover:text-[#ffb347] transition-colors duration-300" />
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-black text-3xl sm:text-4xl font-extrabold tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,1)]"
              >
                NBA
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}