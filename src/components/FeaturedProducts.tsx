// src/components/FeaturedProducts.tsx
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import products from "../data/products";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  return (
    <section id="catalogo" className="bg-white text-black py-16 px-6">
      <Helmet>
        <title>Productos destacados | Looma</title>
        <meta
          name="description"
          content="Explorá nuestros productos más destacados en hogar, fitness, mascotas y tecnología. Estilo, funcionalidad y envíos rápidos desde Looma."
        />
        <meta
          name="keywords"
          content="productos destacados, hogar, fitness, mascotas, tecnología, looma, tienda online, dropshipping USA"
        />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-gray-900">
          Destacados de la semana
        </h2>

        <motion.div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}