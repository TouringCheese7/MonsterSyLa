import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useClan } from "../context/ClanContext";
import { supabase } from "../services/supabaseClient";
import { Home } from "lucide-react";

export default function Header() {

  // 🔥 CONTEXTO GLOBAL
  const { clanId, setClanId, clanName, setClanName, clanSlug, setClanSlug } = useClan();

  // 🔥 NAVIGATION
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 ESTADOS
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clans, setClans] = useState([]);

  // 🔥 FETCH CLANES
  useEffect(() => {

    async function fetchClans() {

      const { data, error } = await supabase
        .from("clans")
        .select("*");

      if (error) {
        console.error("Error cargando clanes:", error);
        return;
      }

      setClans(data || []);

      /* 🔥 AUTO SELECCIÓN */
      if ((!clanId || !clanName) && data?.length > 0) {
        setClanId(data[0].id);
        setClanName(data[0].clan_name);
        setClanSlug(data[0].slug);
      }

    }

    fetchClans();

  }, []);

  return (
    <div className="w-full relative">

      <header className="w-full flex items-center justify-between px-4 md:px-8 py-4 backdrop-blur-md bg-black/20 relative z-50">

        {/* IZQUIERDA */}
        <div className="flex items-center gap-3 md:gap-6">

          {/* 🏠 HOME */}
          <Link to={clanSlug ? `/${clanSlug}` : "#"} className="text-white hover:text-green-400 transition">
            <Home size={22} strokeWidth={2} />
          </Link>

          <div className="flex items-center gap-2 md:gap-4">

            <img 
              src="/LOGO-COMPLETO-PNG-BIEN.png" 
              alt="Clan Logo" 
              className="w-8 h-8 md:w-10 md:h-10 object-contain" 
            />

            {/* 🔥 DROPDOWN CLAN */}
            <div className="relative">

              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-lg md:text-4xl font-bold italic tracking-wider text-green-400 flex items-center gap-2"
              >
                {clanName || "Seleccionar clan"}
                <span className="text-xs">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-[#0a0a0a] border border-green-500/30 rounded-xl shadow-lg z-50">

                  {clans.map(clan => (

                    <button
                      key={clan.id}
                      onClick={() => {

                        setClanId(clan.id);
                        setClanName(clan.clan_name);
                        setClanSlug(clan.slug);

                        // 🔥🔥🔥 CAMBIAR URL SIN PERDER LA VISTA
                        const restOfPath = location.pathname.replace(/^\/[^/]+/, "");
                        navigate(`/${clan.slug}${restOfPath}`);

                        setDropdownOpen(false);

                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition ${
                        clan.id === clanId
                          ? "bg-green-500/20 text-green-400"
                          : "hover:bg-green-500/10"
                      }`}
                    >

                      <div className="flex justify-between items-center">
                        <span>{clan.clan_name}</span>
                        <span className="text-green-400 text-[10px]">
                          {clan.clan_tag}
                        </span>
                      </div>

                    </button>

                  ))}

                </div>
              )}
            </div>

            <span className="hidden md:inline px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] border border-green-500/50 text-green-400 bg-green-500/10 rounded-sm">
              Clash Royale
            </span>

          </div>
        </div>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-10 text-lg font-semibold text-gray-100">

          <Link 
            to={clanSlug ? `/${clanSlug}/players` : "#"} 
            className="hover:text-green-400 transition"
          >
            Jugadores
          </Link>

          <Link 
            to={clanSlug ? `/${clanSlug}/ranking` : "#"} 
            className="hover:text-green-400 transition"
          >
            Ranking
          </Link>

          <Link to="#">Historial</Link>
          <Link to="#">Estadísticas</Link>

        </nav>

        {/* DERECHA */}
        <div className="flex items-center gap-3">

          <div className="hidden md:flex items-center gap-3 bg-gradient-to-br from-green-950 to-green-800 border border-green-500 px-4 py-2 rounded-xl cursor-pointer hover:brightness-125 transition">
            <span className="text-green-300 text-sm">▼</span>
            <span className="font-semibold text-sm text-white">USERNAME</span>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

        </div>

      </header>

      {/* MOBILE */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-black/90 text-white text-lg">

          <Link 
            to={clanSlug ? `/${clanSlug}/players` : "#"} 
            onClick={() => setMenuOpen(false)}
          >
            Jugadores
          </Link>

          <Link 
            to={clanSlug ? `/${clanSlug}/ranking` : "#"} 
            onClick={() => setMenuOpen(false)}
          >
            Ranking
          </Link>

        </div>
      )}

      {/* GLOW */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] flex items-center justify-center pointer-events-none">
        <div 
          className="absolute w-[95%] h-[30px] opacity-40"
          style={{
            background: 'radial-gradient(ellipse at center, #22c55e 0%, transparent 70%)',
            filter: 'blur(15px)',
          }}
        ></div>
        <div 
          className="w-[95%] h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent"
          style={{ boxShadow: '0 0 10px #22c55e' }}
        ></div>
      </div>

    </div>
  );
}