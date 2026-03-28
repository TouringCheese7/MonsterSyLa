import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { getRankImage } from "../../../utils/ranks";
import { useClan } from "../../../context/ClanContext";
import { useNavigate } from "react-router-dom"; // 🔥

export default function PlayerPodium() {

  const { clanId, clanSlug } = useClan(); // 🔥
  const navigate = useNavigate(); // 🔥

  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!clanId) return;

    async function fetchPodium() {

      try {

        const { data: eloPlayers, error } = await supabase
          .from("view_ranking_elo")
          .select("*")
          .eq("clan_id", clanId)
          .order("elo", { ascending: false });

        if (error) {
          console.error("❌ Error elo:", error);
          return;
        }

        if (!eloPlayers || eloPlayers.length === 0) {
          setTop([]);
          return;
        }

        const activos = eloPlayers.filter(p =>
          p.activo === true || p.es_activo === true
        );

        const source = activos.length > 0 ? activos : eloPlayers;
        const top3 = source.slice(0, 3);

        setTop(top3);

      } catch (err) {

        console.error("💥 Error cargando podio:", err);

      } finally {

        setLoading(false);

      }

    }

    fetchPodium();

  }, [clanId]);

  function goPlayer(tag){
    if(!clanSlug) return;
    navigate(`/${clanSlug}/players/${tag.replace("#","")}`);
  }

  if (loading) {
    return <div className="text-center text-gray-500">Cargando podio...</div>;
  }

  if (top.length === 0) {
    return <div className="text-center text-gray-500">No hay datos para el podio</div>;
  }

  const display = [top[1], top[0], top[2]].filter(Boolean);

  return (

    <section>

      <div className="flex flex-col md:flex-row justify-center items-end gap-6 max-w-5xl mx-auto">

        {display.map((p) => {

          const isFirst = p.player_tag === top[0]?.player_tag;
          const isSecond = p.player_tag === top[1]?.player_tag;

          const cardStyles = isFirst
            ? "border-yellow-500 bg-[#1a1400] md:scale-110 z-20 shadow-[0_0_40px_rgba(234,179,8,0.25)]"
            : isSecond
            ? "border-gray-500 bg-[#050505]"
            : "border-orange-700 bg-[#050505]";

          const medalColor =
            isFirst ? "bg-yellow-500"
            : isSecond ? "bg-gray-400"
            : "bg-orange-700";

          return (

            <div
              key={p.player_tag}
              onClick={() => goPlayer(p.player_tag)} // 🔥 AQUÍ
              className={`relative border rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 w-full md:w-1/3 flex flex-col items-center ${cardStyles}`}
            >

              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center font-black text-black ${medalColor}`}>
                {isFirst ? "1" : isSecond ? "2" : "3"}
              </div>

              <div className="flex flex-col items-center gap-3">

                <div className="relative mb-4">
                  <div className="absolute inset-0 blur-lg bg-white/10 rounded-full"></div>

                  <img
                    src={getRankImage(p.rango)}
                    alt={p.rango}
                    className="relative w-24 h-24 object-contain"
                  />
                </div>

                <span className="text-[9px] px-3 py-1 rounded border font-black tracking-widest uppercase bg-white/5 text-gray-400 border-white/10">
                  {p.rango}
                </span>

              </div>

              <div className="mt-4">
                <h3 className="text-xl font-black uppercase tracking-tight">
                  {p.player_name || p.name || "Sin nombre"}
                </h3>

                <p className="text-[10px] text-green-500/60 font-mono tracking-widest">
                  {p.player_tag}
                </p>
              </div>

              <div className="mt-3">
                <span className="text-green-400 font-black text-2xl font-mono">
                  {Math.round(p.elo || 0)}
                </span>
                <span className="text-xs text-gray-600 ml-1">ELO</span>
              </div>

            </div>

          );

        })}

      </div>

    </section>

  );

}