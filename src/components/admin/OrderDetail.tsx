// src/components/admin/OrderDetail.tsx
import { useEffect, useState } from "react";

interface Pedido {
  id: number;
  total: number;
  fecha: string;
  estado: string;
  cliente: {
    name: string;
    address: string;
    phone: string;
  };
  productos: {
    titulo: string;
    talle: string;
    cantidad: number;
  }[];
}

interface Props {
  orderId: number;
  onBack: () => void;
}

export default function OrderDetail({ orderId, onBack }: Props) {
  const [order, setOrder] = useState<Pedido | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("pedidos");
    if (data) {
      const pedidos = JSON.parse(data) as Pedido[];
      const match = pedidos.find((p) => p.id === orderId);
      if (match) setOrder(match);
    }
  }, [orderId]);

  if (!order) return <p className="p-6 text-red-500 font-semibold">Pedido no encontrado.</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Volver al historial
      </button>

      <h2 className="text-xl font-bold mb-2">Detalle del Pedido #{order.id}</h2>
      <p className="text-sm text-gray-600 mb-4">
        Fecha: {new Date(order.fecha).toLocaleDateString()} | Estado: {order.estado}
      </p>

      <h3 className="font-semibold mb-1">Datos del Cliente</h3>
      <p className="text-sm mb-2">
        <strong>Nombre:</strong> {order.cliente.name} <br />
        <strong>Dirección:</strong> {order.cliente.address} <br />
        <strong>Teléfono:</strong> {order.cliente.phone}
      </p>

      <h3 className="font-semibold mb-1 mt-4">Productos</h3>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2 text-left">Producto</th>
            <th className="p-2 text-left">Talle</th>
            <th className="p-2 text-left">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {order.productos.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{item.titulo}</td>
              <td className="p-2">{item.talle}</td>
              <td className="p-2">{item.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <strong>Total:</strong> {order.total} USD
      </div>

      <div className="mt-4">
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Imprimir etiqueta
        </button>
      </div>
    </div>
  );
}
