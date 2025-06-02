// src/components/admin/OrderList.tsx
import { useEffect, useState } from "react";

interface Pedido {
  id: number;
  total: number;
  fecha: string;
  estado: string;
  cliente: {
    nombre: string;
    email: string;
  };
}

interface Props {
  onSelectOrder: (id: number) => void;
}

export default function OrderList({ onSelectOrder }: Props) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("pedidos");
    if (data) {
      setPedidos(JSON.parse(data));
    }
  }, []);

  const updateEstado = (id: number, nuevoEstado: string) => {
    const actualizados = pedidos.map((p) =>
      p.id === id ? { ...p, estado: nuevoEstado } : p
    );
    setPedidos(actualizados);
    localStorage.setItem("pedidos", JSON.stringify(actualizados));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Historial de Pedidos</h2>
      {pedidos.length === 0 ? (
        <p className="text-gray-500 italic">No hay pedidos registrados.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">ID</th>
              <th className="py-2 text-left">Cliente</th>
              <th className="py-2 text-left">Total</th>
              <th className="py-2 text-left">Estado</th>
              <th className="py-2 text-left">Fecha</th>
              <th className="py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="border-b">
                <td className="py-2">{pedido.id}</td>
                <td className="py-2">{pedido.cliente.nombre}</td>
                <td className="py-2">{pedido.total} USD</td>
                <td className="py-2">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={pedido.estado}
                    onChange={(e) => updateEstado(pedido.id, e.target.value)}
                  >
                    <option>Pendiente</option>
                    <option>Confirmado</option>
                    <option>Enviado</option>
                    <option>Cancelado</option>
                  </select>
                </td>
                <td className="py-2">{new Date(pedido.fecha).toLocaleDateString()}</td>
                <td className="py-2">
                  <button
                    onClick={() => onSelectOrder(pedido.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Ver pedido
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}