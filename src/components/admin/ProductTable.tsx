// src/components/admin/ProductTable.tsx
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  team: string;
  usdPrice: string;
  uyuPrice: string;
  stock: Record<string, number>;
  finalDescription: string;
  isStockExpress: boolean;
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  const handleDelete = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  return (
    <div className="bg-white mt-10 p-6 rounded shadow max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Productos Creados</h2>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left py-2">Nombre</th>
            <th className="text-left py-2">Equipo</th>
            <th className="text-left py-2">USD</th>
            <th className="text-left py-2">UYU</th>
            <th className="text-left py-2">Stock</th>
            <th className="text-left py-2">Express</th>
            <th className="text-left py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-2 font-semibold">{p.name}</td>
              <td className="py-2">{p.team}</td>
              <td className="py-2">{p.usdPrice}</td>
              <td className="py-2">{p.uyuPrice}</td>
              <td className="py-2">
                {Object.entries(p.stock)
                  .filter(([_, qty]) => qty > 0)
                  .map(([s, q]) => `${s}: ${q}`)
                  .join(", ")}
              </td>
              <td className="py-2 font-bold text-red-600">
                {p.isStockExpress ? "Sí" : "No"}
              </td>
              <td className="py-2">
                <button className="text-blue-600 hover:underline mr-4">Editar</button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
