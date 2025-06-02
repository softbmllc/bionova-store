///src/pages/PendingPage.tsx
export default function PendingPage() {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-yellow-600">Pago en proceso</h1>
        <p className="text-gray-700 mb-6">
          Estamos procesando tu pago. Te notificaremos por WhatsApp apenas esté confirmado.
        </p>
        <a
          href="/"
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-black/90 transition"
        >
          Volver al inicio
        </a>
      </section>
    );
  }