import { useState, useEffect } from "react";
import { useClan } from "../../../context/ClanContext";
import { supabase } from "../../../services/supabaseClient";
import { getRankImage } from "../../../utils/ranks";
import RankMiniProgress from "./RankMiniProgress";

export default function PlayerComparison({ players }) {

  const { clanId } = useClan();
  const [data, setData] = useState([]);

  useEffect(() => {

    if (!clanId || players.length < 2) return;

    async function fetchData() {

      const { data, error } = await supabase
        .from("view_ranking_elo") // 🔥 IMPORTANTE
        .select("*")
        .eq("clan_id", clanId)
        .in("player_tag", players);

      if (error) {
        console.error("Error compare:", error);
        return;
      }

      setData(data || []);
    }

    fetchData();

  }, [players, clanId]);

  if (data.length < 2) return null;

  const a = data.find(p => p.player_tag === players[0]);
  const b = data.find(p => p.player_tag === players[1]);

  if (!a || !b) return null;

  /* 🧠 SCORE GLOBAL */
  const scoreA =
    a.total_donaciones * 0.3 +
    a.total_guerra * 0.5 +
    a.total_viaje * 0.2;

  const scoreB =
    b.total_donaciones * 0.3 +
    b.total_guerra * 0.5 +
    b.total_viaje * 0.2;

  const winner =
    scoreA > scoreB ? "A" :
    scoreB > scoreA ? "B" :
    "draw";

  /* 🧠 COMPARADOR VISUAL */
  const compareStat = (label, valA, valB) => {

    const max = Math.max(valA, valB, 1);

    const percentA = (valA / max) * 100;
    const percentB = (valB / max) * 100;

    const aWins = valA > valB;
    const bWins = valB > valA;

    return (
      <div className="mb-6">

        <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">
          {label}
        </p>

        <div className="flex items-center gap-4">

          {/* 🟢 PLAYER A */}
          <div className="w-1/2">

            <div
              className={`h-3 rounded transition-all duration-500 ${
                aWins ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-700"
              }`}
              style={{ width: `${percentA}%` }}
            />

            <p className={`text-xs mt-1 font-mono ${
              aWins ? "text-green-400" : "text-gray-400"
            }`}>
              {valA}
            </p>

          </div>

          {/* 🔴 PLAYER B */}
          <div className="w-1/2 text-right">

            <div
              className={`h-3 rounded ml-auto transition-all duration-500 ${
                bWins ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-gray-700"
              }`}
              style={{ width: `${percentB}%` }}
            />

            <p className={`text-xs mt-1 font-mono ${
              bWins ? "text-red-400" : "text-gray-400"
            }`}>
              {valB}
            </p>

          </div>

        </div>

      </div>
    );
  };

  return (

    <div className="bg-black/40 border border-green-500/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">

      {/* 🔥 HEADER VS */}
      <div className="grid grid-cols-3 items-center mb-10">

        {/* PLAYER A */}
        <div className="flex flex-col items-center text-center">

          <div className="relative">
            <div className="absolute w-20 h-20 bg-green-500/20 blur-xl"></div>

            <img
              src={getRankImage(a.rango)}
              className="relative w-20 h-20 object-contain"
              alt="rank"
            />
          </div>

          <p className="font-bold text-green-400 mt-2 text-lg">
            {a.player_name}
          </p>

          <p className="text-xs text-gray-500 font-mono">
            {a.player_tag}
          </p>

          <RankMiniProgress elo={a.elo} />

        </div>

        {/* VS */}
        <div className="text-center text-3xl font-black tracking-widest text-white">
          VS
        </div>

        {/* PLAYER B */}
        <div className="flex flex-col items-center text-center">

          <div className="relative">
            <div className="absolute w-20 h-20 bg-red-500/20 blur-xl"></div>

            <img
              src={getRankImage(b.rango)}
              className="relative w-20 h-20 object-contain"
              alt="rank"
            />
          </div>

          <p className="font-bold text-red-400 mt-2 text-lg">
            {b.player_name}
          </p>

          <p className="text-xs text-gray-500 font-mono">
            {b.player_tag}
          </p>

          <RankMiniProgress elo={b.elo} />

        </div>

      </div>

      {/* 🏆 RESULTADO */}
      <div className="text-center mb-8">

        {winner === "A" && (
          <span className="text-green-400 font-bold text-sm tracking-widest">
            🏆 {a.player_name} domina
          </span>
        )}

        {winner === "B" && (
          <span className="text-red-400 font-bold text-sm tracking-widest">
            🏆 {b.player_name} domina
          </span>
        )}

        {winner === "draw" && (
          <span className="text-gray-400 font-bold text-sm tracking-widest">
            Empate técnico
          </span>
        )}

      </div>

      {/* 📊 STATS */}
      {compareStat("Donaciones", a.total_donaciones, b.total_donaciones)}
      {compareStat("Guerra", a.total_guerra, b.total_guerra)}
      {compareStat("Viaje", a.total_viaje, b.total_viaje)}
      {compareStat("Actividad", a.actividad, b.actividad)}

    </div>
  );
}