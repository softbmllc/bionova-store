import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    priceUSD: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = () => {
    setIsAdding(true);

    // Simular acción de agregar al carrito
    setTimeout(() => {
      alert(`Agregado: ${product.name}`);
      setIsAdding(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAdding}
      className="mt-6 w-full bg-black text-white font-semibold py-3 rounded-full flex justify-center items-center gap-2 hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isAdding ? (
        <span className="animate-pulse">Agregando...</span>
      ) : (
        <>
          <FiShoppingCart className="text-lg" />
          Agregar al carrito
        </>
      )}
    </button>
  );
}