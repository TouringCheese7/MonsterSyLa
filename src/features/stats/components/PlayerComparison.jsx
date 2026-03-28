import { useState, useEffect } from "react";
import { useClan } from "../../../context/ClanContext";
import { supabase } from "../../../services/supabaseClient";
import { getRankImage } from "../../../utils/ranks";

export default function PlayerComparison({ players }) {

  const { clanId } = useClan();
  const [data, setData] = useState([]);

  useEffect(() => {

    if (!clanId || players.length < 2) return;

    async function fetchData() {

      const { data, error } = await supabase
        .from("view_ranking_elo")
        .select("*")
        .eq("clan_id", clanId)
        .in("player_tag", players);

      if (error) {
        console.error(error);
        return;
      }

      console.log("COMPARE DATA:", data); // 🔥 DEBUG


      setData(data || []);
    }

    fetchData();

  }, [players, clanId]);

  if (data.length < 2) return null;

  const a = data.find(p => p.player_tag === players[0]);
  const b = data.find(p => p.player_tag === players[1]);

  if (!a || !b) return null;

  // 🔥 FALLBACKS IMPORTANTES
  const nameA = a.player_name || a.name || "Jugador A";
  const nameB = b.player_name || b.name || "Jugador B";

  const rankRawA = a.rango || a.rank || "";
  const rankRawB = b.rango || b.rank || "";

  const normalizeRank = (rank) => {
    if (!rank) return "";

    return rank
      .trim()
      .toUpperCase()
      .replace(/\s+/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const rankA = normalizeRank(rankRawA);
  const rankB = normalizeRank(rankRawB);

  // 🧠 SCORE
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

  const compareStat = (label, valA, valB) => {

    const max = Math.max(valA, valB, 1);

    const percentA = (valA / max) * 100;
    const percentB = (valB / max) * 100;

    const aWins = valA > valB;
    const bWins = valB > valA;

    return (
      <div className="mb-5">

        <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest">
          {label}
        </p>

        <div className="flex items-center gap-3">

          <div className="w-1/2">
            <div
              className={`h-3 rounded transition-all ${
                aWins ? "bg-green-500" : "bg-gray-600"
              }`}
              style={{ width: `${percentA}%` }}
            />
            <p className="text-xs mt-1">{valA}</p>
          </div>

          <div className="w-1/2 text-right">
            <div
              className={`h-3 rounded ml-auto transition-all ${
                bWins ? "bg-red-500" : "bg-gray-600"
              }`}
              style={{ width: `${percentB}%` }}
            />
            <p className="text-xs mt-1">{valB}</p>
          </div>

        </div>

      </div>
    );
  };

  return (

    <div className="bg-black/40 border border-green-500/20 rounded-xl p-6">

      {/* 🔥 HEADER */}
      <div className="grid grid-cols-3 items-center mb-10">

        {/* PLAYER A */}
        <div className="flex flex-col items-center">

          <img
            src={getRankImage(rankA)}
            className="w-16 h-16 object-contain"
            onError={(e) => {
              e.currentTarget.src = "/ranks/default.png";
            }}
          />

          <p className={`font-bold mt-2 ${winner === "A" ? "text-green-400" : ""}`}>
            {nameA}
          </p>

          <p className="text-xs text-gray-500">
            {a.player_tag}
          </p>

        </div>

        {/* VS */}
        <div className="text-center text-2xl font-black">
          VS
        </div>

        {/* PLAYER B */}
        <div className="flex flex-col items-center">

          <img
            src={getRankImage(rankB)}
            className="w-16 h-16 object-contain"
            onError={(e) => {
              e.currentTarget.src = "/ranks/default.png";
            }}
          />

          <p className={`font-bold mt-2 ${winner === "B" ? "text-red-400" : ""}`}>
            {nameB}
          </p>

          <p className="text-xs text-gray-500">
            {b.player_tag}
          </p>

        </div>

      </div>

      {/* RESULTADO */}
      <div className="text-center mb-6">

        {winner === "A" && (
          <span className="text-green-400 font-bold">
            🏆 {nameA} domina
          </span>
        )}

        {winner === "B" && (
          <span className="text-red-400 font-bold">
            🏆 {nameB} domina
          </span>
        )}

        {winner === "draw" && (
          <span className="text-gray-400 font-bold">
            Empate técnico
          </span>
        )}

      </div>

      {/* STATS */}
      {compareStat("Donaciones", a.total_donaciones, b.total_donaciones)}
      {compareStat("Guerra", a.total_guerra, b.total_guerra)}
      {compareStat("Viaje", a.total_viaje, b.total_viaje)}
      {compareStat("Actividad", a.actividad, b.actividad)}

    </div>
  );
}