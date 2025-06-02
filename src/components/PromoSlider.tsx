// src/components/PromoSlider.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Autoplay, Navigation, Mousewheel } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import './promo-slider.css';

const slides = [
  {
    imageDesktop: '/images/slider-retro.jpg',
    imageMobile: '/images/mobile/slider-retro-celu.jpg',
    title: 'ÍDOLOS ETERNOS. CAMISETAS INOLVIDABLES',
    subtitle: 'Volvé a vivir la gloria con camisetas retro',
    link: '/futbol',
  },
  {
    imageDesktop: '/images/slider-nba.jpg',
    imageMobile: '/images/mobile/slider-nba-celu.jpg',
    title: 'LO MEJOR DE LA NBA',
    subtitle: 'Conseguí todas las camisetas',
    link: '/futbol',
  },
  {
    imageDesktop: '/images/slider-rossi.jpg',
    imageMobile: '/images/mobile/slider-rossi-celu.jpg',
    title: '¡EDICIÓN LIMITADA YA DISPONIBLE!',
    subtitle: 'Fútbol y velocidad con la nueva edición Inter x Rossi.',
    link: '/futbol',
  },
];

export default function PromoSlider() {
  const swiperRef = useRef<any>(null);

  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };
  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  return (
    <section className="relative w-full bg-black">
      <Swiper
        modules={[Pagination, Autoplay, Navigation, Mousewheel]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation={false}
        loop
        touchRatio={1.5}
        resistanceRatio={0}
        speed={450}
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
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="h-[80vh] promo-slider"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <picture>
                <source media="(max-width: 768px)" srcSet={slide.imageMobile} />
                <img
                  src={slide.imageDesktop}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable="false"
                />
              </picture>
              <div className="absolute inset-0 bg-black/40" />
              <motion.div
                className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)] tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-lg sm:text-xl font-light text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mb-6">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.link}
                  className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-all"
                >
                  COMPRAR AHORA
                </Link>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}

        {/* Flechas custom (ocultas en mobile) */}
        <button
          onClick={handlePrev}
          className="custom-nav-btn custom-prev hidden sm:flex absolute top-1/2 left-4 z-20 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all duration-300 shadow-lg"
          aria-label="Anterior"
        >
          <ChevronLeft className="text-white" size={28} />
        </button>
        <button
          onClick={handleNext}
          className="custom-nav-btn custom-next hidden sm:flex absolute top-1/2 right-4 z-20 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all duration-300 shadow-lg"
          aria-label="Siguiente"
        >
          <ChevronRight className="text-white" size={28} />
        </button>
      </Swiper>
    </section>
  );
}