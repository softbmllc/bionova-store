// src/context/CartContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "../data/types";

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  updateItem: (id: string | number, size: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existing = prevItems.find(
        (item) =>
          item.id.toString() === newItem.id.toString() &&
          item.size === newItem.size &&
          item.customName === newItem.customName &&
          item.customNumber === newItem.customNumber &&
          item.options === newItem.options
      );

      if (existing) {
        return prevItems.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        return [...prevItems, newItem];
      }
    });
  };

  const updateItem = (id: string | number, size: string, updates: Partial<CartItem>) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id.toString() === id.toString() && item.size === size
            ? { ...item, ...updates }
            : item
        )
        .filter((item) => item.quantity > 0) // 🔥 Esto elimina del carrito los de cantidad 0
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider value={{ items, addToCart, updateItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return context;
}