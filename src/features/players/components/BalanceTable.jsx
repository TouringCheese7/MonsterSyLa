import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useClan } from "../../../context/ClanContext";
import { useNavigate } from "react-router-dom"; // 🔥

export default function BalanceTable() {

  const { clanId, clanSlug } = useClan(); // 🔥
  const navigate = useNavigate(); // 🔥

  const [players, setPlayers] = useState([]);

  useEffect(() => {

    if (!clanId) return;

    async function fetchData() {

      const { data, error } = await supabase
        .from("view_balance_donaciones")
        .select("*")
        .eq("clan_id", clanId);

      if (error) {
        console.error("Error balance:", error);
        return;
      }

      if (!data) return;

      const sorted = data.sort(
        (a, b) => (b.balance || 0) - (a.balance || 0)
      );

      setPlayers(sorted);

    }

    fetchData();

  }, [clanId]);

  function goPlayer(tag){
    if(!clanSlug) return;
    navigate(`/${clanSlug}/players/${tag.replace("#","")}`);
  }

  if (!players || players.length === 0) return null;

  return (

    <section className="max-w-4xl mx-auto">

      <h2 className="text-xl font-black text-green-500 mb-4">
        💰 BALANCE DE DONACIONES
      </h2>

      <div className="max-h-[300px] overflow-y-auto space-y-2">

        {players.map(p => {

          const balance = p.balance || 0;

          return (

            <div
              key={p.player_tag}
              onClick={() => goPlayer(p.player_tag)} // 🔥 AQUÍ
              className="flex justify-between items-center bg-[#111] p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-green-500/10 transition"
            >

              <div>
                <p className="font-bold">
                  {p.player_name || p.name || "Sin nombre"}
                </p>

                <p className="text-xs text-gray-500">
                  {p.player_tag}
                </p>
              </div>

              <div
                className={`font-mono font-bold text-lg ${
                  balance >= 0 ? "text-green-400" : "text-red-500"
                }`}
              >
                {balance > 0 ? `+${balance}` : balance}
              </div>

            </div>

          );

        })}

      </div>

    </section>

  );

}