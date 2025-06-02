// src/components/StockExpressButton.tsx
import { Rocket } from "lucide-react";

interface Props {
  isSelected: boolean;
  onClick: () => void;
}

export default function StockExpressButton({ isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-full border text-sm transition ${
        isSelected ? "bg-black text-white ring-1 ring-black" : "bg-white text-gray-800 hover:bg-gray-100"
      }`}
    >
      <Rocket className="h-4 w-4 mr-2 text-red-600" />
      <span className="font-semibold text-[15px]">Stock</span>
      <span className="bg-red-600 text-white text-[13px] px-2 py-0.5 rounded-full shadow font-semibold ml-1">
        Express
      </span>
    </button>
  );
}