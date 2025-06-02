// src/components/admin/ClientAdmin.tsx
import { useState } from "react";

interface Client {
  id: number;
  name: string;
  address: string;
  phone: string;
  country: string;
}

const mockClients: Client[] = [
  {
    id: 1176,
    name: "Bazzino - Alfonso Fantoni",
    address: "Chalet AWA ruta 10 k163.500 casi calle San Carlos, Manantiales",
    phone: "093915296",
    country: "Uruguay",
  },
  {
    id: 1175,
    name: "JULIAN DELGADO",
    address: "-",
    phone: "-",
    country: "Uruguay",
  },
];

export default function ClientAdmin() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Explorador de Clientes</h2>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-black/80">
          Crear nuevo cliente
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Búsqueda por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
        <input
          type="text"
          placeholder="Búsqueda por código"
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
        <select className="border px-3 py-2 rounded w-full max-w-xs">
          <option value="">Todos los países</option>
          <option value="Uruguay">Uruguay</option>
          <option value="Argentina">Argentina</option>
        </select>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Código</th>
            <th className="py-2">Nombre</th>
            <th className="py-2">Dirección</th>
            <th className="py-2">Teléfono</th>
            <th className="py-2">País</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((client) => (
            <tr key={client.id} className="border-b">
              <td className="py-2">{client.id}</td>
              <td className="py-2">{client.name}</td>
              <td className="py-2">{client.address}</td>
              <td className="py-2">{client.phone}</td>
              <td className="py-2">{client.country}</td>
              <td className="py-2 text-red-500 space-x-2">
                <button className="hover:underline text-blue-600">Ver</button>
                <button className="hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
