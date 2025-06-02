// src/components/AuthChoice.tsx
import { useState } from "react";

export default function AuthChoice({ onContinue }: { onContinue: () => void }) {
  const [mode, setMode] = useState<"none" | "register" | "login">("none");

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">¿Cómo querés continuar?</h2>

      {mode === "none" && (
        <div className="flex flex-col gap-4">
          <button
            onClick={onContinue}
            className="bg-black text-white font-semibold py-3 rounded-full hover:bg-black/90 transition"
          >
            Comprar como invitado
          </button>
          <button
            onClick={() => setMode("login")}
            className="text-blue-600 underline font-medium"
          >
            Ya tengo una cuenta
          </button>
          <button
            onClick={() => setMode("register")}
            className="text-blue-600 underline font-medium"
          >
            Registrarme para guardar mis datos
          </button>
        </div>
      )}

      {mode === "login" && (
        <form className="flex flex-col gap-4 mt-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="border px-4 py-2 rounded-md"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="border px-4 py-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-black text-white font-semibold py-3 rounded-full hover:bg-black/90 transition"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setMode("none")}
            type="button"
            className="text-sm underline text-gray-500"
          >
            Volver
          </button>
        </form>
      )}

      {mode === "register" && (
        <form className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            placeholder="Nombre completo"
            className="border px-4 py-2 rounded-md"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="border px-4 py-2 rounded-md"
          />
          <input
            type="password"
            placeholder="Crear contraseña"
            className="border px-4 py-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-black text-white font-semibold py-3 rounded-full hover:bg-black/90 transition"
          >
            Crear cuenta y continuar
          </button>
          <button
            onClick={() => setMode("none")}
            type="button"
            className="text-sm underline text-gray-500"
          >
            Volver
          </button>
        </form>
      )}
    </div>
  );
}
