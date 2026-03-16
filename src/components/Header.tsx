import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [
    { title: "Inicio", path: "#" },
    { title: "Pedidos", path: "#" },
    { title: "Pizzas", path: "#" },
    { title: "Contato", path: "#" },
  ];

  return (
    <nav className="sticky top-0 w-full bg-white shadow-[inset_0_-1px_0_#dcdcdc] z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <a href="#" className="shrink-0">
          <img src="../icone-ifood.png" alt="Ifood" className="h-12 w-auto" />
        </a>

        {/* Busca centralizada */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex-1 max-w-md mx-6"
        >
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-0 bottom-0 left-3 my-auto w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full py-2 pl-10 pr-4 text-gray-600 bg-gray-100 rounded-md outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
            />
          </div>
        </form>

        {/* Menu */}
        <div className={`${menuOpen ? "block" : "hidden"} md:block`}>
          <ul className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
            {navigation.map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className="text-gray-600 hover:text-red-500 font-medium transition"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Botão mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-700 rounded-md focus:outline-none"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 
                8.586l4.293-4.293a1 1 0 
                111.414 1.414L11.414 
                10l4.293 4.293a1 1 0 
                01-1.414 1.414L10 
                11.414l-4.293 4.293a1 
                1 0 01-1.414-1.414L8.586 
                10 4.293 5.707a1 1 0 
                010-1.414z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
