// src/components/Footer.jsx
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {

  const navItems = [
    { name: "Juegos", path: "/" },
    { name: "Clanes", path: "/" },
    { name: "Jugadores", path: "/players" },
    { name: "Ranking", path: "/ranking" },
    { name: "Historial", path: "/historial" },
    { name: "Estadísticas", path: "/stats" }
  ];

  return (
    <footer className="mt-20 border-t border-green-500/20 bg-[#050505] py-12">

      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400">
        
        {/* Columna Izquierda */}
        <div className="space-y-4">

          <h4 className="text-green-500 font-bold uppercase tracking-widest text-sm">
            Navegación
          </h4>

          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="hover:text-green-400 transition-colors block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

        </div>

        {/* Columna Derecha */}
        <div className="flex flex-col items-start md:items-end space-y-4">

          <h4 className="text-green-500 font-bold uppercase tracking-widest text-sm">
            Social
          </h4>

          <div className="flex gap-4">
            
            {/* Discord */}
            <a
              href="https://t.co/Zc4VCqdUYD"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 border border-green-500/30 rounded flex items-center justify-center hover:bg-green-500/10 hover:border-green-400 transition-all text-xl text-green-500"
            >
              <FaDiscord />
            </a>

            {/* X (Twitter) */}
            <a
              href="https://x.com/MonsterSyLa"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 border border-green-500/30 rounded flex items-center justify-center hover:bg-green-500/10 hover:border-green-400 transition-all text-xl text-green-500"
            >
              <FaXTwitter />
            </a>

          </div>

        </div>

      </div>
      
      {/* Footer bottom */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-12 text-center text-xs text-green-900 border-t border-green-500/10 pt-6">
        © 2026 Monste SyLa - Todos los derechos reservados.
      </div>

    </footer>
  );
}