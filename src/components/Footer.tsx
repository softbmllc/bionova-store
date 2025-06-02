// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-4 mt-12 text-center text-xs text-gray-400">
      <p className="leading-tight">
        © 2025 Looma · Made with 💻 by{" "}
        <a
          href="https://www.devrodri.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white/80 hover:text-white transition"
        >
          Rodrigo Opalo
        </a>
      </p>
    </footer>
  );
}