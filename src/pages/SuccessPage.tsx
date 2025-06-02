// src/pages/SuccessPage.tsx
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const location = useLocation();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    console.log("✅ SuccessPage montado");
    console.log("📍 URL completa:", location.search);

    try {
      const searchParams = new URLSearchParams(location.search);
      const pid = searchParams.get("payment_id");
      const stat = searchParams.get("status");
      console.log("🔎 payment_id:", pid);
      console.log("🔎 status:", stat);
      setPaymentId(pid);
      setStatus(stat);
    } catch (error) {
      console.error("❌ Error leyendo los parámetros:", error);
    }
  }, [location.search]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">¡Pago exitoso!</h1>
      <p className="text-gray-700 mb-2">
        Gracias por tu compra. Te enviaremos un WhatsApp para coordinar el envío.
      </p>

      {paymentId && (
        <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg mt-4 text-sm">
          <p><strong>ID de pago:</strong> {paymentId}</p>
          <p><strong>Estado:</strong> {status}</p>
        </div>
      )}

      <a
        href="/"
        className="mt-6 bg-black text-white px-6 py-3 rounded-full hover:bg-black/90 transition"
      >
        Volver al inicio
      </a>
    </section>
  );
}