// src/components/CartIcon.tsx
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type Props = {
  variant?: "header" | "floating" | "hero";
  itemCount?: number;
  showCount?: boolean;
};

export default function CartIcon({ variant = "floating", itemCount, showCount = true }: Props) {
  const { items } = useCart();
  const calculatedItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const baseStyle = "rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-colors";
  const size =
    variant === "hero"
      ? "w-12 h-12"
      : variant === "header"
      ? "w-10 h-10"
      : "w-10 h-10";

      const position =
      variant === "floating"
        ? "fixed top-6 right-6 z-50"
        : "relative";

  const displayItemCount = itemCount !== undefined ? itemCount : calculatedItemCount;

  return (
    <Link to="/carrito" className="relative block">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`${baseStyle} ${size} ${position} flex items-center justify-center`}
      >
        <ShoppingCart className="w-5 h-5" />
        {showCount && displayItemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md"
          >
            {displayItemCount}
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
}