// src/components/admin/OrderAdmin.tsx
import { useState, useEffect } from "react";
import jsPDF from "jspdf";

interface Order {
  id: number;
  client: string;
  items: string;
  total: number;
  status: "En Proceso" | "Cancelado" | "Confirmado" | "Entregado";
  address: string;
  city: string;
  department: string;
  postalCode: string;
  phone: string;
}

export default function OrderAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const pedidosGuardados = JSON.parse(localStorage.getItem("pedidosAdmin") || "[]");
    const pedidosSimulados = JSON.parse(localStorage.getItem("pedidos") || "[]");

    const parsed: Order[] = pedidosSimulados.map((pedido: any, index: number) => {
      const id = pedido.id || Date.now() + index + Math.floor(Math.random() * 1000);
      const estadoAnterior = pedidosGuardados.find((p: any) => p.id === id)?.status;

      return {
        id,
        client: pedido.cliente.nombre,
        phone: pedido.cliente.telefono,
        address: pedido.cliente.direccion,
        city: pedido.cliente.ciudad,
        department: pedido.cliente.departamento,
        postalCode: pedido.cliente.codigoPostal,
        items: pedido.items
          .map((item: any) =>
            `${item.nombre} x${item.cantidad} (Talle: ${item.talle})` +
            (item.customName && item.customNumber
              ? ` - ${item.customName} #${item.customNumber}`
              : "")
          )
          .join(" / "),
        total: pedido.total,
        status: estadoAnterior || "En Proceso",
      };
    });

    setOrders(parsed);
  }, []);

  const cycleStatus = (status: Order["status"]): Order["status"] => {
    const order = ["En Proceso", "Cancelado", "Confirmado", "Entregado"];
    const index = order.indexOf(status);
    return order[(index + 1) % order.length] as Order["status"];
  };

  const updateStatus = (id: number) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: cycleStatus(order.status) } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("pedidosAdmin", JSON.stringify(updatedOrders));
  };

  const generateLabel = async (order: Order) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "in", format: [4, 6] });
  
    // Cargar imagen como base64
    const response = await fetch("/logo-etiqueta.png");
    const blob = await response.blob();
    const reader = new FileReader();
  
    reader.onloadend = () => {
      const base64data = reader.result as string;
  
      // Recuadro
      doc.setDrawColor(200);
      doc.rect(0.2, 0.2, 5.6, 3.6);
  
      // Título
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Etiqueta de Envío", 3, 0.6, { align: "center" });
  
      // Logo
      doc.addImage(base64data, "PNG", 0.4, 1.0, 1.6, 1.6);
  
      // Campos
      doc.setFontSize(12);
      let y = 1.0;
      const labelX = 2.4;
      const valueX = 3.8;
  
      const drawRow = (label: string, value: string) => {
        doc.setFont(undefined, "bold");
        doc.text(`${label}:`, labelX, y);
        doc.setFont(undefined, "normal");
        doc.text(value, valueX, y);
        y += 0.35;
      };
  
      drawRow("Orden", `${order.id ?? "-"}`);
      drawRow("Nombre", order.client);
      drawRow("Teléfono", order.phone);
      drawRow("Dirección", order.address);
      drawRow("Ciudad", order.city);
      drawRow("Departamento", order.department);
      drawRow("Código Postal", order.postalCode);
  
      doc.save(`Etiqueta-${order.client}.pdf`);
    };
  
    reader.readAsDataURL(blob);
  };

  const exportCSV = () => {
    const csv = [
      ["ID", "Cliente", "Productos", "Total", "Estado"],
      ...orders.map((o) => [
        o.id,
        `"${o.client}"`,
        `"${o.items}"`,
        `"${o.total} USD"`,
        `"${o.status}"`,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pedidos.csv";
    link.click();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gestión de Pedidos</h2>
        <button
          onClick={exportCSV}
          className="bg-black text-white px-4 py-2 rounded hover:bg-black/80"
        >
          Exportar CSV
        </button>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Cliente</th>
            <th className="py-2">Productos</th>
            <th className="py-2">Total</th>
            <th className="py-2">Estado</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="py-2">{order.client}</td>
              <td className="py-2">{order.items}</td>
              <td className="py-2">{order.total} USD</td>
              <td className="py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === "Entregado"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Confirmado"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Cancelado"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-2 flex flex-col gap-1">
                <button
                  onClick={() => updateStatus(order.id)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Cambiar estado
                </button>
                <button
                  onClick={() => generateLabel(order)}
                  className="text-green-600 hover:underline text-sm"
                >
                  Imprimir etiqueta
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}