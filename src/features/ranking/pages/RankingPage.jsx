import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useClan } from "../../../context/ClanContext";

import MainLayout from "../../../layouts/MainLayout";
import RankingTableRanking from "../components/RankingTableRanking";

export default function RankingPage() {

  const { clanId } = useClan();

  const [filter, setFilter] = useState("semanal");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const [rankings, setRankings] = useState({
    elo: [],
    don: [],
    gue: [],
    via: []
  });

  useEffect(() => {

    if (!clanId) return;

    async function fetchData() {

      /* 🏆 ELO (no cambia) */
      const { data: resElo } = await supabase
        .from("view_ranking_elo")
        .select("*")
        .eq("clan_id", clanId)
        .order("elo", { ascending: false });

      const { data: resCambio } = await supabase
        .from("view_ranking_change")
        .select("*")
        .eq("clan_id", clanId);

      const cambiosMap = {};
      resCambio?.forEach(c => {
        cambiosMap[c.player_tag] = c.cambio;
      });

      const eloMapped = resElo?.map(d => ({
        name: d.player_name,
        player_tag: d.player_tag,
        activo: d.activo,
        value: d.elo,
        rango: d.rango,
        cambio: cambiosMap[d.player_tag] ?? 0
      })) || [];

      /* 🔥 MODO 4 SEMANAS */
      if (filter === "4_semanas") {

        const [resDon, resGue, resVia] = await Promise.all([
          supabase.from("view_historial_donaciones").select("*").eq("clan_id", clanId),
          supabase.from("view_historial_guerra").select("*").eq("clan_id", clanId),
          supabase.from("view_historial_viaje").select("*").eq("clan_id", clanId)
        ]);

        const mapHistory = (res) =>
          res.data?.map(d => ({
            name: d.player_name,
            player_tag: d.player_tag,
            activo: d.activo,
            rango: d.rango,
            history: [
              Math.round(d.s1 || 0),
              Math.round(d.s2 || 0),
              Math.round(d.s3 || 0),
              Math.round(d.s4 || 0)
            ]
          }))
          .sort((a, b) => (b.history?.[3] || 0) - (a.history?.[3] || 0)) || [];

        setRankings({
          elo: eloMapped,
          don: mapHistory(resDon),
          gue: mapHistory(resGue),
          via: mapHistory(resVia)
        });

        return;
      }

      /* 📊 NORMAL */
      const [resDon, resGue, resVia] = await Promise.all([
        supabase
          .from("view_ranking_donaciones_full")
          .select("*")
          .eq("clan_id", clanId)
          .order(filter, { ascending: false }),

        supabase
          .from("view_ranking_guerra_full")
          .select("*")
          .eq("clan_id", clanId)
          .order(filter, { ascending: false }),

        supabase
          .from("view_ranking_viaje_full")
          .select("*")
          .eq("clan_id", clanId)
          .order(filter, { ascending: false })
      ]);

      const mapData = (res) =>
        res.data?.map(d => ({
          name: d.player_name,
          player_tag: d.player_tag,
          activo: d.activo,
          rango: d.rango,
          value: d[filter]
        })) || [];

      setRankings({
        elo: eloMapped,
        don: mapData(resDon),
        gue: mapData(resGue),
        via: mapData(resVia)
      });

    }

    fetchData();

  }, [clanId, filter]);

  return (

    <MainLayout>

      {/* HEADER */}
      <div className="text-center mb-12">

        <h1 className="text-5xl font-black text-green-500 uppercase mb-6 italic">
          Ranking
        </h1>

        {/* 🔥 FILTROS */}
        <div className="flex justify-center gap-2 flex-wrap">

          {["semanal", "temporada", "historico", "4_semanas"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 text-xs font-black border ${
                filter === f
                  ? "bg-green-600 border-green-500"
                  : "border-gray-700 text-gray-500"
              }`}
            >
              {f === "4_semanas" ? "4 SEMANAS" : f.toUpperCase()}
            </button>
          ))}

        </div>

        {/* ACTIVOS */}
        <div className="flex justify-center gap-2 mt-4">

          <button
            onClick={() => setShowActiveOnly(false)}
            className={`px-4 py-1 text-xs font-black border ${
              !showActiveOnly
                ? "bg-green-600 border-green-500"
                : "border-gray-700 text-gray-500"
            }`}
          >
            TODOS
          </button>

          <button
            onClick={() => setShowActiveOnly(true)}
            className={`px-4 py-1 text-xs font-black border ${
              showActiveOnly
                ? "bg-green-600 border-green-500"
                : "border-gray-700 text-gray-500"
            }`}
          >
            ACTIVOS
          </button>

        </div>

      </div>

      {/* TABLAS */}
      <div className="flex flex-col gap-6">

        <RankingTableRanking
          title="🏆 ELO"
          data={rankings.elo}
          typeLabel="ELO"
          showActiveOnly={showActiveOnly}
        />

        <RankingTableRanking
          title="Donaciones"
          data={rankings.don}
          typeLabel="DON."
          isHistoryView={filter === "4_semanas"}
          showActiveOnly={showActiveOnly}
        />

        <RankingTableRanking
          title="Guerra"
          data={rankings.gue}
          typeLabel="GUERRA"
          isHistoryView={filter === "4_semanas"}
          showActiveOnly={showActiveOnly}
        />

        <RankingTableRanking
          title="Viaje"
          data={rankings.via}
          typeLabel="VIAJE"
          isHistoryView={filter === "4_semanas"}
          showActiveOnly={showActiveOnly}
        />

      </div>

    </MainLayout>

  );

}