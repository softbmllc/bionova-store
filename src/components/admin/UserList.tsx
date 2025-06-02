// src/components/admin/UserList.tsx
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

interface User {
  id: number;
  name: string;
  email: string;
  password: string; // hashed
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

  // Cargar usuarios desde localStorage
  useEffect(() => {
    const data = localStorage.getItem("usuarios");
    if (data) {
      setUsers(JSON.parse(data));
    }
  }, []);

  const hashPassword = (password: string) =>
    CryptoJS.SHA256(password).toString();

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;

    const id = Date.now();
    const userToAdd: User = {
      id,
      name: newUser.name,
      email: newUser.email,
      password: hashPassword(newUser.password),
    };

    const updated = [...users, userToAdd];
    setUsers(updated);
    localStorage.setItem("usuarios", JSON.stringify(updated));
    setNewUser({ name: "", email: "", password: "" });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Administradores</h2>

      {/* Formulario de creación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border px-3 py-2 rounded text-sm"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border px-3 py-2 rounded text-sm"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border px-3 py-2 rounded text-sm"
        />
      </div>

      <button
        onClick={handleAddUser}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Crear Administrador
      </button>

      <hr className="my-6" />

      {/* Tabla de administradores */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Nombre</th>
            <th className="py-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="py-2">{u.name}</td>
              <td className="py-2">{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}