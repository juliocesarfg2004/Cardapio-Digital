import { useState } from "react";
import { menu } from "../data/menu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const term = searchTerm.toLowerCase();
    
    for (const category of menu) {
      const foundItem = category.items.find(item => 
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
      
      if (foundItem) {
        const element = document.getElementById(`item-${foundItem.id}`);
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          element.classList.add('bg-yellow-50');
          setTimeout(() => element.classList.remove('bg-yellow-50'), 2000);
          break;
        }
      }
      
      if (category.name.toLowerCase().includes(term)) {
        scrollToSection(category.id);
        break;
      }
    }
    
    setSearchTerm("");
  };

  const navItems = [
    { id: 'hamburgers', label: 'Hambúrgueres' },
    { id: 'pizzas', label: 'Pizzas' },
    { id: 'esfihas', label: 'Esfihas' },
    { id: 'drinks', label: 'Bebidas' },
    { id: 'contato', label: 'Contato' },
  ];

  return (
    <>
      <nav className="sticky top-0 w-full bg-white shadow-[inset_0_-1px_0_#dcdcdc] z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-20">
          <a href="#" className="shrink-0">
            <img src="../icone-ifood.png" alt="Ifood" className="h-12 w-auto" />
          </a>

          {/* Busca */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-6 hidden md:block">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-0 bottom-0 left-3 my-auto w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-gray-600 bg-gray-100 rounded-md outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                aria-label="Buscar produtos no cardápio"
              />
            </div>
          </form>

          {/* Botões de navegação - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-3 py-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg font-medium transition text-sm"
                aria-label={`Navegar para ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Botão mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-700 rounded-md focus:outline-none"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden fixed top-20 left-0 right-0 bg-white shadow-lg z-40">
          <ul className="flex flex-col py-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left px-6 py-3 text-gray-600 hover:text-red-500 hover:bg-gray-50 font-medium transition"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
