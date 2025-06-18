// src/components/admin/ProductEditForm.tsx
import { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  category: string;
  priceUSD: number;
  stock: Record<string, number>;
  images: string[];
  extraDescription: string;
  descriptionPosition: "top" | "bottom";
  active?: boolean;
}

interface Props {
  productId: number;
  onBack: () => void;
}

export default function ProductEditForm({ productId, onBack }: Props) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("productos");
    if (stored) {
      const list: Product[] = JSON.parse(stored);
      const match = list.find((p) => p.id === productId);
      if (match) setProduct(match);
    }
  }, [productId]);

  const handleChange = (field: keyof Product, value: any) => {
    if (!product) return;
    setProduct({ ...product, [field]: value });
  };

  const handleStockChange = (size: string, value: number) => {
    if (!product) return;
    setProduct({ ...product, stock: { ...product.stock, [size]: value } });
  };

  const handleSave = () => {
    if (!product) return;
    const stored = localStorage.getItem("productos");
    if (stored) {
      const list: Product[] = JSON.parse(stored);
      const updated = list.map((p) => (p.id === product.id ? product : p));
      localStorage.setItem("productos", JSON.stringify(updated));
      alert("Producto actualizado correctamente");
      onBack();
    }
  };

  if (!product) return <p className="text-red-600">Producto no encontrado.</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Editar Publicación</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={product.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={product.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option>Premier League</option>
          <option>La Liga</option>
          <option>Serie A</option>
          <option>Bundesliga</option>
          <option>Selecciones Nacionales</option>
          <option>NBA</option>
          <option>Retro</option>
        </select>

        <input
          type="number"
          value={product.priceUSD}
          onChange={(e) => handleChange("priceUSD", Number(e.target.value))}
          className="border px-3 py-2 rounded"
        />

        <div className="md:col-span-2">
          <label className="font-semibold">Stock por talle</label>
          <div className="flex gap-4 mt-2">
            {Object.entries(product.stock).map(([size, qty]) => (
              <div key={size} className="flex flex-col items-center">
                <label>{size}</label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => handleStockChange(size, Number(e.target.value))}
                  className="border px-2 py-1 rounded text-center w-20"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="text-sm text-gray-600 hover:underline">
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
