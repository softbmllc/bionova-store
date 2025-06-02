// src/components/admin/layout/AdminLayout.tsx
import { ReactNode } from "react";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar izquierdo */}
      <Sidebar activeView="clients" onChangeView={(view) => navigate(`/admin/${view}`)} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold">Panel de Administración</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hola, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="p-6 overflow-y-auto flex-1">{children}</main>
      </div>
    </div>
  );
}