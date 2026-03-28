import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useClan } from "../context/ClanContext";

export default function ClanMedallero() {

  const { clanId } = useClan();

  const [data, setData] = useState([]);

  useEffect(() => {

    if (!clanId) return;

    async function fetchMedallero() {

      const { data, error } = await supabase
        .from("view_medallas_auto")
        .select("*")
        .eq("clan_id", clanId); // 🔥 CLAVE

      if (error) {
        console.error("Error medallero:", error);
        return;
      }

      setData(data || []);

    }

    fetchMedallero();

  }, [clanId]);

  /* -----------------------------
  🧠 AGRUPAR MEDALLAS POR JUGADOR
  ----------------------------- */

  const getTop = (tipo) => {

    const filtrado = data.filter(m => m.tipo === tipo);

    const jugadores = {};

    filtrado.forEach(m => {

      const tag = m.player_tag;

      if (!jugadores[tag]) {
        jugadores[tag] = {
          nombre: m.player_name || m.name || tag,
          oro: 0,
          plata: 0,
          bronce: 0
        };
      }

      const pos = Number(m.posicion);

      if (pos === 1) jugadores[tag].oro++;
      if (pos === 2) jugadores[tag].plata++;
      if (pos === 3) jugadores[tag].bronce++;

    });

    return Object.values(jugadores)
      .sort((a, b) =>
        b.oro - a.oro ||
        b.plata - a.plata ||
        b.bronce - a.bronce
      )
      .slice(0, 5);
  };

  const tipos = [
    { key: "guerra", label: "⚔️ Guerra" },
    { key: "donaciones", label: "🤝 Donaciones" },
    { key: "viaje", label: "🚢 Viaje" },
    { key: "general", label: "👑 General" }
  ];

  return (

    <div className="bg-[#050505] border border-green-500/20 rounded-3xl p-6 max-w-4xl mx-auto">

      <h2 className="text-green-400 font-black uppercase mb-6">
        🏆 Medallero del Clan
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {tipos.map(tipo => {

          const top = getTop(tipo.key);

          return (

            <div key={tipo.key}>

              <h3 className="text-sm font-bold text-gray-400 mb-3">
                {tipo.label}
              </h3>

              <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1">

                {top.length === 0 && (
                  <p className="text-xs text-gray-600">
                    Sin datos
                  </p>
                )}

                {top.map((p, i) => (

                  <div
                    key={i}
                    className="flex justify-between items-center bg-white/[0.03] px-4 py-2 rounded-lg border border-white/5"
                  >

                    <div className="text-xs font-bold text-white truncate">
                      #{i + 1} {p.nombre}
                    </div>

                    <div className="flex gap-3 text-xs font-mono">

                      <span className="text-yellow-400">🥇 {p.oro}</span>
                      <span className="text-gray-300">🥈 {p.plata}</span>
                      <span className="text-orange-500">🥉 {p.bronce}</span>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}