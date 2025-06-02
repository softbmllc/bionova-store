// src/components/RelatedProducts.tsx
import { useEffect, useState } from "react";
import { fetchProducts } from "../firebaseUtils";
import ProductCard from "./ProductCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

interface Props {
  excludeSlugs?: string[];
  categoryName?: string;
  title?: string;
}

export default function RelatedProducts({ excludeSlugs = [], categoryName, title }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

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
        {filtered.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 snap-start scroll-ml-4 w-[270px] transition-transform hover:scale-[1.015]"
          >
            <div className="rounded-lg shadow-sm hover:shadow-md overflow-hidden bg-white">
              <div className="h-[320px] overflow-hidden">
                <img
                  src={product.image || product.images?.[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-2">
                <h3 className="font-semibold mb-1 line-clamp-2">{product.title}</h3>
                <p className="text-gray-500 mb-1">
                  ${product.priceUYU} UYU / ${product.priceUSD} USD
                </p>
                <a
                  href={`/producto/${product.slug}`}
                  className="inline-block text-blue-500 hover:underline text-sm"
                >
                  Ver más
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}