// src/components/LoginForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../utils/userUtils";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authenticateUser(email, password);

    if (user) {
      login({ ...user, id: user.id.toString(), password }); // usar la contraseña real ingresada
      alert("Inicio de sesión exitoso");
      navigate("/admin", { replace: true });
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
      {/* Logo */}
      <img
        src="/logo1.png"
        alt="Looma"
        className="w-24 h-24 object-contain mb-4"
      />

      {/* Subtítulo bienvenida */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido al panel</h1>
      <p className="text-gray-500 text-sm mb-8 text-center">
        Ingresá tus credenciales para acceder a la administración.
      </p>

      {/* Formulario */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white shadow-lg rounded-xl px-8 pt-8 pb-6"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-900 transition-all"
        >
          Iniciar sesión
        </button>
      </form>

      {/* Footer */}
      <p className="text-gray-400 text-xs mt-6">
        &copy; {new Date().getFullYear()} Looma. Todos los derechos reservados.
      </p>
    </div>
  );
}