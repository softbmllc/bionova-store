//src/components/VideoShowcase.tsx
import React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const videoUrls = [
  "https://res.cloudinary.com/ddkyumyw3/video/upload/v1750003770/FUXION2_f6kk4g.mp4",
  "https://res.cloudinary.com/ddkyumyw3/video/upload/v1750000500/PURE2_detyqs.mp4",
  "https://res.cloudinary.com/ddkyumyw3/video/upload/v1750119796/PURE7_l5zvrs.mov"
];

export default function VideoShowcase() {
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
          }
        });
      },
      { threshold: 0.1 }
    );

    const targets = document.querySelectorAll(".video-showcase-title");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white pb-0 mb-0 pt-16 px-4 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="animate-fadeIn">
          <h2 className="video-showcase-title text-4xl sm:text-6xl font-extrabold text-center mb-1 tracking-tight text-[#365486] drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-700">
            {t('highlights.title')}
          </h2>
          <div className="video-showcase-title text-center mt-2 mb-10 transition-opacity duration-700 delay-300">
            <p className="text-base sm:text-lg text-gray-700">
              {t('highlights.subtitle')}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
          {videoUrls.map((url, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border border-neutral-200 shadow-lg bg-white aspect-[9/16] transform transition-transform duration-300 hover:scale-105 opacity-0 animate-fadeIn`}
              style={{ animationDelay: `${i * 0.3}s`, animationFillMode: "forwards" }}
            >
              <video
                src={url}
                autoPlay
                muted
                loop
                playsInline
                poster="https://res.cloudinary.com/ddkyumyw3/image/upload/v1/tucasaca/poster-placeholder.jpg"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}