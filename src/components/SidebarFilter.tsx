// src/components/SidebarFilter.tsx

export default function SidebarFilter() {
  return (
    <aside className="mb-10 md:mb-0 md:mr-8">
      <div className="sticky top-24">
        <h3 className="text-lg font-bold mb-4">Categorías</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-green-500">Premier League</a></li>
          <li><a href="#" className="hover:text-green-500">La Liga</a></li>
          <li><a href="#" className="hover:text-green-500">Serie A</a></li>
          <li><a href="#" className="hover:text-green-500">Bundesliga</a></li>
          <li><a href="#" className="hover:text-green-500">Nacionales</a></li>
          <li><a href="#" className="hover:text-green-500">Retro</a></li>
        </ul>
      </div>
    </aside>
  );
}