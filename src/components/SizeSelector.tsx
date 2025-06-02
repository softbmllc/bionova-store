interface SizeSelectorProps {
  sizes: string[];
}

export default function SizeSelector({ sizes }: SizeSelectorProps) {
  return (
    <div className="mt-6">
      <h4 className="font-bold text-sm mb-2">Seleccioná tu talle</h4>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-black hover:text-white transition"
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}