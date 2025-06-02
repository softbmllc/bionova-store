//src/components/VideoShowcase.tsx
import React from "react";
import { useEffect } from "react";

const videoUrls = [
  "https://res.cloudinary.com/ddkyumyw3/video/upload/v1746401493/showcase2_pfqyma.mov",
  "https://res.cloudinary.com/ddkyumyw3/video/upload/v1746401497/showcase3_kk5jf7.mov",
  "https://res.cloudinary.com/ddkyumyw3/video/upload/v1746401499/showcase1_gvptxu.mov"
];

export default function VideoShowcase() {
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
          <h2 className="video-showcase-title text-4xl sm:text-6xl font-extrabold text-center mb-1 tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] transition-all duration-700">
            Momentos destacados en acción
          </h2>
          <p className="video-showcase-title text-center text-base sm:text-lg text-white/70 mt-2 mb-10 transition-opacity duration-700 delay-300">
            Moda deportiva con espíritu de barrio
          </p>
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