// src/components/admin/OrderAdmin.tsx
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase"; // asumimos que ya existe tu instancia db

interface Order {
  id: number | string;
  client: string;
  items: string | string[];
  total: number;
  status: "En Proceso" | "Cancelado" | "Confirmado" | "Entregado" | "Enviado";
  address: string;
  city: string;
  department: string;
  postalCode: string;
  phone: string;
  createdAt: Date;
}

export default function OrderAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // Estado para el filtro de estado de pedido
  const [filterStatus, setFilterStatus] = useState<"Todos" | Order["status"]>("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "orders"));
      const docs = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const cliente = data.cliente || {}; // asegurar compatibilidad con estructura previa

        return {
          id: docSnap.id,
          client: cliente.nombre || data.client || "-",
          phone: cliente.telefono || data.phone || "-",
          address: cliente.direccion || data.address || "-",
          city: cliente.ciudad || data.city || "-",
          department: cliente.departamento || data.department || "-",
          postalCode: cliente.codigoPostal || data.postalCode || "-",
          items: data.items,
          total: data.total,
          status: data.status,
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
        } as Order;
      });
      setOrders(docs);
    };

    fetchOrders();
  }, []);

  const cycleStatus = (status: Order["status"]): Order["status"] => {
    const order = ["En Proceso", "Cancelado", "Confirmado", "Entregado", "Enviado"];
    const index = order.indexOf(status);
    return order[(index + 1) % order.length] as Order["status"];
  };

  const updateStatus = async (id: number | string, newStatus: Order["status"]) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    // Actualizar en Firestore
    await updateDoc(doc(db, "orders", id.toString()), {
      status: newStatus,
    });
  };

  const generateLabel = async (order: Order) => {
    console.log("[Etiqueta] Generando para:", order);
    const doc = new jsPDF({ orientation: "landscape", unit: "in", format: [4, 6] });
  
    // Cargar imagen como base64
    const response = await fetch("/logo-etiqueta.png");
    const blob = await response.blob();
    const reader = new FileReader();
  
    reader.onloadend = async () => {
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

      // Generar imagen QR en base64 con el ID
      const qrDataUrl = await QRCode.toDataURL(`ID-${order.id}`);
      doc.addImage(qrDataUrl, "PNG", 5.0, 2.8, 0.8, 0.8); // Ubicación esquina inferior derecha
  
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

  // Filtrar pedidos según el filtro visual y el término de búsqueda
  const filteredOrders = orders.filter((order) => {
    const statusMatch = filterStatus === "Todos"
      ? true
      : filterStatus === "Entregado"
      ? order.status === "Entregado"
      : order.status === filterStatus;

    const searchMatch = `${order.client} ${order.status} ${Array.isArray(order.items) ? order.items.map((i: any) => i.nombre).join(" ") : order.items}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return statusMatch && searchMatch;
  });


  console.log("[PEDIDOS RENDERIZADOS]", orders);
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gestión de Pedidos</h2>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="bg-black text-white px-4 py-2 rounded hover:bg-black/80"
          >
            Exportar CSV
          </button>
        </div>
      </div>
      {/* Filtros visuales por estado de pedido */}
      <div className="flex gap-2 mb-4">
        {["Todos", "En Proceso", "Enviado", "Cancelado", "Completado"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`px-3 py-1 rounded text-sm border ${
              filterStatus === status
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Buscar por cliente, producto o estado..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Cliente</th>
            <th className="py-2">Productos</th>
            <th className="py-2">Total</th>
            <th className="py-2">Estado</th>
            <th className="py-2">Acciones</th>
            <th className="py-2">Imprimir</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr
              key={order.id}
              className={`border-b ${
                order.status === "Cancelado"
                  ? "bg-gray-200 text-gray-500"
                  : order.status === "Entregado"
                  ? "bg-green-100 text-green-800"
                  : ""
              }`}
            >
              <td className="py-2">{order.client}</td>
              <td className="py-2">
                {Array.isArray(order.items)
                  ? order.items.map((item: any) => `${item.nombre} (${item.talle}) x${item.cantidad}`).join(", ")
                  : order.items}
              </td>
              <td className="py-2">{order.total} USD</td>
              <td className="py-2">
                <div className="flex space-x-2">
                  {["En Proceso", "Enviado", "Confirmado"].map((s) => (
                    <label key={s} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={
                          order.status === s || order.status === "Entregado"
                        }
                        onChange={() => {
                          if (order.status !== s) {
                            updateStatus(order.id, s as Order["status"]);
                          }
                        }}
                        disabled={order.status === "Cancelado"}
                      />
                      <span className={`text-xs ${
                        s === "En Proceso" ? "text-yellow-600"
                        : s === "Enviado" ? "text-blue-600"
                        : s === "Confirmado" ? "text-green-600"
                        : ""
                      }`}>{s}</span>
                    </label>
                  ))}
                  <button
                    onClick={() => updateStatus(order.id, order.status === "Cancelado" ? "En Proceso" : "Cancelado")}
                    title={order.status === "Cancelado" ? "Reactivar orden" : "Cancelar orden"}
                    className={`text-red-600 font-bold text-sm ml-2 border rounded px-2 py-1 ${
                      order.status === "Cancelado" ? "bg-gray-300 text-black" : "hover:bg-red-100"
                    }`}
                  >
                    ✖
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, "Entregado")}
                    title="Marcar como entregado"
                    className={`text-green-600 font-bold text-sm border rounded px-2 py-1 ${
                      order.status === "Entregado" ? "bg-green-200" : "hover:bg-green-100"
                    }`}
                  >
                    ✔
                  </button>
                </div>
                {order.status === "Cancelado" && (
                  <span className="ml-3 text-xs font-semibold bg-gray-300 text-gray-800 px-2 py-1 rounded">
                    CANCELADO
                  </span>
                )}
                {order.status === "Entregado" && (
                  <span className="ml-3 text-xs font-semibold bg-green-200 text-green-800 px-2 py-1 rounded">
                    COMPLETADO
                  </span>
                )}
              </td>
              <td className="py-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver detalles
                </button>
              </td>
              <td className="py-2">
                <button
                  onClick={() => generateLabel(order)}
                  className="text-green-600 hover:underline text-sm"
                >
                  Imprimir etiqueta
                </button>
                <button
                  onClick={() => setOrderToDelete(order)}
                  className="text-red-500 hover:text-red-700 ml-3"
                  title="Eliminar orden"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            {/* Contenido imprimible profesional tipo packing list/invoice */}
            <div id="print-area" style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', padding: '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src="/logo-etiqueta.png" alt="Logo Looma" style={{ height: 80 }} />
                <h2 style={{ margin: '10px 0' }}>Factura / Packing List</h2>
                <p><strong>Orden ID:</strong> {selectedOrder.id}</p>
                <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
              </div>

              <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '10px' }}>Datos del Cliente</h3>
                <p><strong>Cliente:</strong> {selectedOrder.client}</p>
                <p><strong>Teléfono:</strong> {selectedOrder.phone}</p>
                <p><strong>Dirección:</strong> {selectedOrder.address}</p>
                <p><strong>Ciudad:</strong> {selectedOrder.city}</p>
                <p><strong>Departamento:</strong> {selectedOrder.department}</p>
                <p><strong>Código Postal:</strong> {selectedOrder.postalCode}</p>
              </div>

              <h3 style={{ marginBottom: '10px' }}>Detalle del Pedido</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }} border={1}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    <th style={{ padding: '10px' }}>Producto</th>
                    <th style={{ padding: '10px' }}>Talle</th>
                    <th style={{ padding: '10px' }}>Cantidad</th>
                    <th style={{ padding: '10px' }}>Precio Unitario</th>
                    <th style={{ padding: '10px' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray((selectedOrder as any).items)
                    ? (selectedOrder as any).items.map((item: any, idx: number) => {
                        const precio = selectedOrder.total / item.cantidad;
                        return (
                          <tr key={idx}>
                            <td style={{ padding: '10px' }}>{item.nombre}</td>
                            <td style={{ padding: '10px' }}>{item.talle}</td>
                            <td style={{ padding: '10px' }}>{item.cantidad}</td>
                            <td style={{ padding: '10px' }}>$ {precio.toFixed(2)}</td>
                            <td style={{ padding: '10px' }}>$ {(precio * item.cantidad).toFixed(2)}</td>
                          </tr>
                        );
                      })
                    : <tr><td colSpan={5} style={{ padding: '10px' }}>{selectedOrder.items}</td></tr>}
                </tbody>
              </table>

              <div style={{ textAlign: 'right' }}>
                <p><strong>Total:</strong> ${selectedOrder.total} USD</p>
                <p><strong>Estado:</strong> {selectedOrder.status}</p>
              </div>
            </div>
            <button
              onClick={() => {
                const printContents = document.getElementById("print-area")?.innerHTML;
                if (!printContents) return;
                const printWindow = window.open("", "_blank", "width=800,height=600");
                if (!printWindow) return;
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Factura - Looma</title>
                      <style>
                        @media print {
                          body { font-family: Arial, sans-serif; margin: 2rem; font-size: 14px; }
                          h2 { margin: 10px 0; }
                          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                          th, td { border: 1px solid #ccc; padding: 8px 10px; }
                          th { background: #f0f0f0; text-align: left; }
                          tr:nth-child(even) { background: #f9f9f9; }
                          img { height: 80px; display: block; margin: 0 auto 20px; }
                        }
                      </style>
                    </head>
                    <body>${printContents}</body>
                  </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                printWindow.close();
              }}
              className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-black/80"
            >
              Imprimir factura
            </button>
          </div>
        </div>
      )}
    {/* Modal de confirmación de eliminación */}
    {orderToDelete && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full text-center relative">
          <button
            onClick={() => setOrderToDelete(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-black"
          >
            ✕
          </button>
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-red-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">¿Eliminar pedido?</h2>
            <p className="text-gray-600 mb-4 text-sm">Esta acción no se puede deshacer. El pedido será eliminado permanentemente.</p>
            <p className="text-sm text-gray-800 mb-4"><span className="font-semibold">Cliente:</span> {orderToDelete.client}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  await deleteDoc(doc(db, "orders", orderToDelete.id.toString()));
                  setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
                  setOrderToDelete(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
              >
                Eliminar
              </button>
              <button
                onClick={() => setOrderToDelete(null)}
                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}