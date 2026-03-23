import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useClan } from "../../../context/ClanContext";

export default function ExpulsionList() {

  const { clanId } = useClan();
  const [players, setPlayers] = useState([]);

  useEffect(() => {

    if (!clanId) return;

    async function fetchData() {

      const { data, error } = await supabase
        .from("view_expulsion_pro")
        .select("*")
        .eq("clan_id", clanId);

      if (error) {
        console.error("Error patíbulo:", error);
        return;
      }

      const sorted = (data || []).sort(
        (a, b) => (a.score_final || 0) - (b.score_final || 0)
      );

      setPlayers(sorted);

    }

    fetchData();

  }, [clanId]);

  if (!players?.length) return null;

  return (
    <section className="max-w-4xl mx-auto">

      <h2 className="text-xl font-black text-red-500 mb-4">
        💀 EXPULSIÓN
      </h2>

      <div className="max-h-[250px] overflow-y-auto space-y-3">

        {players.map(p => {

          const score = Math.round(p.score_final || 0);

          let estado = "ESTABLE";
          let color = "text-green-400";

          if (score < 200) {
            estado = "EXPULSIÓN";
            color = "text-red-500";
          } else if (score < 400) {
            estado = "EN RIESGO";
            color = "text-yellow-400";
          }

          return (
            <div
              key={p.player_tag}
              className="flex justify-between bg-[#111] p-4 rounded-xl border border-white/5"
            >
              <div>
                <p className="font-bold">{p.player_name}</p>
                <p className="text-xs text-gray-500">{p.player_tag}</p>
              </div>

              <div className="text-right">
                <p className={`font-bold ${color}`}>
                  {estado}
                </p>
                <p className="text-xs text-gray-500">
                  {score}
                </p>
              </div>
            </div>
          );

        })}

      </div>

    </section>
  );
}