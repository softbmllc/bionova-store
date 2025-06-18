// src/components/RelatedProducts.tsx
import { useEffect, useState } from "react";
import i18n from "../i18n-config";
import { fetchProducts } from "../firebaseUtils";
import ProductCard from "./ProductCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  excludeSlugs?: string[];
  categoryName?: string;
  title?: string;
}

export default function RelatedProducts({ excludeSlugs = [], categoryName, title }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const language = i18n.language;

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => console.error("Error loading products in RelatedProducts:", err));
  }, []);

  console.log("🧩 RelatedProducts: slugs excluidos", excludeSlugs);

  console.log("[🧪 RelatedProducts] Productos cargados:", products);

  console.log("📦 Slugs excluidos:", excludeSlugs);
  console.log("📦 Todos los productos disponibles:", products.map(p => p.slug));

  // const filtered = products.filter(
  //   (p) =>
  //     p.slug &&
  //     !excludeSlugs.includes(p.slug) &&
  //     (!categoryName || p.category?.name?.toLowerCase() === categoryName.toLowerCase())
  // );
  const filtered = products;

  console.log("🧩 Productos después del filtro", filtered);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -340 : 340,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {title && (
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-extrabold tracking-wider uppercase leading-snug mb-6 text-left mt-16 border-t pt-10 text-black">
            {title}
          </h2>
        </div>
      )}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => scroll("left")}
          className="p-3 bg-white rounded-full shadow-md hover:bg-black hover:text-white transition border border-gray-300"
          aria-label="Anterior"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="p-3 bg-white rounded-full shadow-md hover:bg-black hover:text-white transition border border-gray-300"
          aria-label="Siguiente"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-2 scroll-smooth hide-scrollbar snap-x snap-mandatory"
      >
        {filtered.map((product) => {
          const translatedTitle = typeof product.title === 'object' && product.title !== null
            ? product.title[language] || product.title['en'] || "Sin título"
            : typeof product.title === 'string'
            ? product.title
            : "Sin título";
          const priceUSD = product.priceUSD || 0;
          const slug = product.slug;

          return (
            <div key={product.id} className="flex-shrink-0 snap-start scroll-ml-4 w-[270px]">
              <ProductCard
                product={{
                  ...product,
                  title: {
                    en: product.title?.en || "",
                    es: product.title?.es || ""
                  },
                  priceUSD,
                  slug
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}