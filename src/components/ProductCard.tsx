// src/components/ProductCard.tsx
import { Link } from "react-router-dom";
import { Product } from "../data/types";

type LocalizedTitle = {
  en: string;
  es: string;
};
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  // Asegurarnos de que tenemos un slug limpio y válido
  const safeSlug = product.slug ? encodeURIComponent(product.slug) : `product-${product.id}`;

  // Construir la ruta al detalle del producto con el ID para evitar problemas de coincidencia de slug
  const productDetailUrl = `/producto/${safeSlug}`;

  // Obtener la imagen principal, asegurando que existe
  const productImage = (product.images && product.images.length > 0 ? product.images[0] : "");

  const { i18n } = useTranslation();
  const language = i18n.language as "en" | "es";

  const productName = product.title?.[language] || "Sin título";

  // Asegurar que tenemos precios
  const productPriceUSD = product.priceUSD || 0;

  console.log("🧩 DEBUG CARD —", product.slug, product.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={`product-card-${product.id}-${safeSlug}`} // Key único para evitar problemas de renderizado
      className={`relative border-t-4 ${
        product.category?.name === "NBA" ? "border-blue-600" : "border-transparent"
      }`}
    >
      <Link
        to={productDetailUrl}
        className="block group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition relative"
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Fallback para imágenes que no cargan
              e.currentTarget.src = "/images/placeholder.jpg";
            }}
          />
        </div>
        <div className="p-4">
          {product.subtitle && (
            <div className="text-sm text-gray-600 mb-1">{product.subtitle}</div>
          )}
          <h3 className="text-lg font-bold text-black leading-tight line-clamp-2 group-hover:text-black/80 transition">
            {productName}
          </h3>
          <div className="mt-1.5 text-base font-semibold">
            US$ {productPriceUSD.toFixed(2)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}