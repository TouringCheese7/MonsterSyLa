import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useClan } from "../context/ClanContext";

export default function RecentActivity() {

  const { clanId } = useClan();

  const [players, setPlayers] = useState([]);

  useEffect(() => {

    if (!clanId) return;

    async function fetchActivity() {

      const { data, error } = await supabase
        .from("view_ranking_semanal")
        .select("*")
        .eq("clan_id", clanId) // 🔥 CLAVE
        .order("score_total", { ascending: false });

      if (error) {
        console.error("Error activity:", error);
        return;
      }

      if (!data) return;

      /* 🔥 SOLO ACTIVOS */
      const activos = data.filter(p => p.es_activo);

      const top5 = activos.slice(0, 5);

      setPlayers(top5);

    }

    fetchActivity();

  }, [clanId]);

  return (

    <div className="bg-[#111] border border-green-500/20 rounded-xl p-6">

      <h3 className="text-green-500 font-bold uppercase tracking-wider mb-6">
        Actividad Reciente
      </h3>

      <div className="space-y-4">

        {players.map((p, i) => (

          <div
            key={i}
            className="flex justify-between items-center border-b border-green-500/10 pb-2"
          >

            <div>

              <p className="font-bold text-white">
                {p.player_name || p.name || "Sin nombre"}
              </p>

              <p className="text-xs text-green-400 font-mono">
                {p.player_tag}
              </p>

            </div>

            <div className="text-right">

              <p className="text-green-400 font-mono">
                Guerra: {(p.total_guerra || 0).toLocaleString()}
              </p>

              <p className="text-gray-400 text-xs">
                Don: {(p.total_donaciones || 0).toLocaleString()}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}