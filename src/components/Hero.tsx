// src/components/Hero.tsx
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { useRef, useState } from 'react';

export default function HeroSection() {
  const { t } = useTranslation();
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const backgrounds = [
    // Removed URLs that were used as logos
  ];

  const logos = [
    "https://res.cloudinary.com/ddkyumyw3/image/upload/v1750276335/logo-fuxion_irts0s.png", // Fuxion
    "https://res.cloudinary.com/ddkyumyw3/image/upload/v1750276337/logo-pure_tr4git.png", // Pure
    "https://res.cloudinary.com/ddkyumyw3/image/upload/v1750276341/Double_Wood-logo_hkja36.png", // Double Wood
  ];

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden pt-0 sm:pt-0 md:pt-0 xl:pt-0">

      {/* Removed backgroundImage div as no video or background is used */}
      <div className="absolute inset-0 z-0 bg-neutral-50"></div>

      {/* CONTENIDO */}
      <Swiper
        modules={[Pagination, Autoplay, Navigation, Mousewheel]}
        pagination={{
          clickable: true,
        }}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        touchRatio={1.5}
        resistanceRatio={0}
        speed={500}
        threshold={5}
        followFinger={true}
        grabCursor={true}
        shortSwipes={true}
        longSwipesRatio={0.2}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1.5,
          releaseOnEdges: true,
        }}
        className="relative z-10 w-full max-w-[1920px] mx-auto px-0 text-center"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          setTimeout(() => {
            setActiveIndex(swiper.realIndex);
          }, 50);
        }}
      >
        {[
          {
            key: "fuxion",
            logo: logos[0],
            tagline: t("hero.tagline"),
            headline1: t("hero.headline1"),
            headline2: t("hero.headline2"),
            description: t("hero.description"),
            button: t("hero.button"),
            textColor: "text-[#0088D5]",
            buttonColor: "bg-[#0088D5] hover:bg-blue-600",
          },
          {
            key: "pure",
            logo: logos[1],
            tagline: t("pure.tagline"),
            headline1: t("pure.headline1"),
            headline2: t("pure.headline2"),
            description: t("pure.description"),
            button: t("pure.button"),
            textColor: "text-[#1A3DA7]",
            buttonColor: "bg-[#1A3DA7] hover:bg-blue-800",
          },
          {
            key: "dw",
            logo: logos[2],
            tagline: t("dw.tagline"),
            headline1: t("dw.headline1"),
            headline2: t("dw.headline2"),
            description: t("dw.description"),
            button: t("dw.button"),
            textColor: "text-[#4B3621]",
            buttonColor: "bg-[#3C7A3F] hover:bg-green-700",
          },
        ].map((slide, index) => (
          <SwiperSlide key={slide.key}>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-start sm:justify-between gap-4 w-full px-4 pt-0 sm:pt-0 sm:items-center mt-[-60px] sm:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="w-full sm:w-[60%] flex justify-center items-center h-[300px] sm:h-[520px] md:h-[600px] pl-0">
                <img
                  src={slide.logo}
                  alt={`Logo ${slide.key}`}
                  className="max-h-full w-auto object-contain scale-[1.0]"
                />
              </div>
              <div className={`flex flex-col justify-center items-center text-center sm:items-start sm:text-left ${slide.textColor} gap-4 sm:w-[40%] pt-0 md:pt-6 -mt-4`}>
                <span className="uppercase text-base sm:text-lg tracking-widest font-semibold mt-2 mb-4">
                  {slide.tagline}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-2 leading-tight">
                  <span>{slide.headline1}</span><br />
                  <span>{slide.headline2}</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl font-medium mb-6 max-w-full">
                  {slide.description}
                </p>
                <div className="w-full flex justify-center sm:justify-start mt-0 mb-2">
                  <div
                    onClick={() => window.location.href = "/shop"}
                    className={`inline-block ${slide.buttonColor} text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none appearance-none cursor-pointer`}
                  >
                    {slide.button}
                  </div>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>
        {`
          .swiper-pagination-bullet {
            background: #0C2E63;
            opacity: 0.4;
          }
          .swiper-pagination-bullet-active {
            background: #0C2E63;
            opacity: 1;
          }
          .swiper-pagination {
            position: relative;
            z-index: 999 !important;
            pointer-events: auto;
          }
        `}
      </style>
      <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 z-[999]" />
    </section>
  );
}