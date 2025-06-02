import React, { useState } from "react";

export default function CustomizationForm() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  // Generamos los números de 0 a 99 como opciones del select
  const numbers = Array.from({ length: 100 }, (_, i) =>
    i === 0 ? "00" : i.toString()
  );

  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-bold text-sm">Personalizá tu camiseta</h4>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="playerName">
          Nombre (opcional)
        </label>
        <input
          type="text"
          id="playerName"
          maxLength={20}
          placeholder="Ej: Suárez"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="playerNumber">
          Número (opcional)
        </label>
        <select
          id="playerNumber"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm"
        >
          <option value="">Sin número</option>
          {numbers.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}