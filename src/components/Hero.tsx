// src/components/Hero.tsx
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-white overflow-hidden pt-16 sm:pt-24 md:pt-20 xl:pt-24">
      {/* VIDEO DE FONDO */}
      {/* <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-bg.webm" type="video/webm" />
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video> */}

      {/* DEGRADADO + BLUR */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://res.cloudinary.com/ddkyumyw3/image/upload/v1748682144/12_picr3o.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>

      {/* CONTENIDO */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-screen-xl mx-auto px-4 text-center gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Contenedor de contenido */}
        <div className="flex flex-col items-center justify-center text-center text-white relative gap-6 mt-4 sm:mt-8 px-4 max-w-[90%] sm:max-w-full">
          <motion.img
            src="/logo.png"
            alt="Logo Looma"
            className="w-36 sm:w-44 md:w-56 xl:w-64 relative mb-4 sm:mb-6 mt-[-30px] sm:mt-[-50px] xl:mt-[-60px] drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <hr className="w-24 border-t-2 border-white/20 mb-6" />
          <span className="uppercase text-base sm:text-lg tracking-widest text-white font-semibold mt-2 mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            {t('hero.tagline')}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] text-white leading-tight max-w-screen-md xl:max-w-full xl:whitespace-nowrap">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-medium mb-4 text-white/90 drop-shadow-sm max-w-[90%] mx-auto">
            {t('hero.subtitle')}
          </p>
          <hr className="w-24 border-t-2 border-white/20 mt-6" />
          <a
            href="/futbol"
            className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-neutral-200 hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none appearance-none"
          >
            {t('hero.cta')}
          </a>
        </div>
      </motion.div>
    </section>
  );
}