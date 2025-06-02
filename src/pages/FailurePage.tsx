// src/pages/FailurePage.tsx
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function FailurePage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-white text-center">
      <Helmet>
        <title>Pago rechazado | Looma</title>
        <meta
          name="description"
          content="Tu pago fue rechazado. Podés intentarlo nuevamente desde el carrito o contactarnos por WhatsApp."
        />
      </Helmet>

      <div className="max-w-md w-full">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">
          Pago rechazado
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Algo salió mal con tu pago. Podés intentarlo nuevamente o
          contactarnos por WhatsApp para ayudarte.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/carrito"
            className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition w-full sm:w-auto"
          >
            Volver al carrito
          </Link>
          <a
            href="https://wa.me/59899123456"
            className="text-sm text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}