import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { useClan } from "../../context/ClanContext";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import PlayerHeader from "./detail/PlayerHeader";
import PlayerActivity from "./detail/PlayerActivity";
import PlayerChart from "./detail/PlayerChart";
import PlayerTopWeeks from "./detail/PlayerTopWeeks";
import PlayerAchievements from "./detail/PlayerAchievements";
import PlayerMedals from "./detail/PlayerMedals";

export default function PlayerDetail() {

  const { tag } = useParams();
  const { clanId } = useClan();

  const [player, setPlayer] = useState(null);
  const [records, setRecords] = useState({
    donaciones: [],
    guerra: [],
    viaje: []
  });

  const [activity, setActivity] = useState(0);
  const [history, setHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [medals, setMedals] = useState([]);

  const [fechasJugador, setFechasJugador] = useState({
    ingreso: null,
    salida: null
  });

  const [loading, setLoading] = useState(true);

  /* 📅 FORMATO */
  function formatDate(dateString) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  /* ⏳ TIEMPO EN CLAN */
  function getTiempoEnClan(ingreso, salida) {
    if (!ingreso) return "—";

    const inicio = new Date(ingreso);
    const fin = salida ? new Date(salida) : new Date();

    const diffMs = fin - inicio;

    const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const meses = Math.floor(dias / 30);
    const años = Math.floor(meses / 12);

    if (años > 0) return `${años} año${años > 1 ? "s" : ""}`;
    if (meses > 0) return `${meses} mes${meses > 1 ? "es" : ""}`;
    return `${dias} día${dias !== 1 ? "s" : ""}`;
  }

  useEffect(() => {

    async function fetchData() {

      if (!clanId) return;

      setLoading(true);

      const cleanTag =
        tag?.startsWith("%23")
          ? tag.replace("%23", "#")
          : tag?.startsWith("#")
          ? tag
          : `#${tag}`;

      /* 🔥 PLAYER BASE (MULTICLAN) */
      const { data: pData } = await supabase
        .from("view_players_full")
        .select("*")
        .eq("player_tag", cleanTag)
        .eq("clan_id", clanId)
        .single();

      if (!pData) {
        setLoading(false);
        return;
      }

      setPlayer(pData);

      /* 🏆 MEDALLAS */
      const { data: medalsData } = await supabase
        .from("view_medallas_auto")
        .select("*")
        .eq("player_id", pData.id)
        .eq("clan_id", clanId);

      setMedals(medalsData || []);

      /* 🏆 LOGROS */
      const { data: logrosRaw } = await supabase
        .from("logros_jugadores")
        .select("logro_id")
        .eq("player_id", pData.id);

      if (logrosRaw?.length > 0) {
        const ids = logrosRaw.map(l => l.logro_id);

        const { data: logrosInfo } = await supabase
          .from("logros")
          .select("*")
          .in("id", ids);

        setAchievements(logrosInfo || []);
      }

      /* 🔥 TOP SEMANAS */
      const { data: topWeeks } = await supabase
        .from("view_player_top_weeks")
        .select("*")
        .eq("player_id", pData.id)
        .eq("clan_id", clanId);

      if (topWeeks) {
        setRecords({
          donaciones: topWeeks
            .filter(r => r.tipo === "donaciones")
            .sort((a,b)=>b.puntos-a.puntos)
            .slice(0,5),

          guerra: topWeeks
            .filter(r => r.tipo === "guerra")
            .sort((a,b)=>b.puntos-a.puntos)
            .slice(0,5),

          viaje: topWeeks
            .filter(r => r.tipo === "viaje")
            .sort((a,b)=>b.puntos-a.puntos)
            .slice(0,5)
        });
      }

      /* 📊 ACTIVIDAD */
      const { data: last } = await supabase
        .from("snapshots")
        .select("donations, war_points")
        .eq("player_id", pData.id)
        .eq("clan_id", clanId)
        .order("date", { ascending: false })
        .limit(4);

      if (last?.length > 0) {
        const total = last.reduce((sum, s) =>
          sum + (s.donations || 0) + (s.war_points || 0), 0
        );

        const avg = total / last.length;
        setActivity(Math.min(Math.round(avg / 40), 100));
      }

      /* 📈 HISTORIAL */
      const { data: hist } = await supabase
        .from("snapshots")
        .select("date, donations, war_points")
        .eq("player_id", pData.id)
        .eq("clan_id", clanId)
        .order("date", { ascending: true })
        .limit(8);

      if (hist) {
        setHistory(hist.map(r => ({
          date: new Date(r.date).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short"
          }),
          don: r.donations || 0,
          war: r.war_points || 0
        })));
      }

      /* 📅 FECHAS */
      const { data: fechas } = await supabase
        .from("snapshots")
        .select("date")
        .eq("player_id", pData.id)
        .eq("clan_id", clanId)
        .order("date", { ascending: true });

      if (fechas?.length > 0) {
        setFechasJugador({
          ingreso: fechas[0].date,
          salida: fechas[fechas.length - 1].date
        });
      }

      setLoading(false);
    }

    fetchData();

  }, [tag, clanId]);

  if (loading) return <div className="min-h-screen bg-black" />;
  if (!player) return <div className="text-white">No encontrado</div>;

  return (
    <div className="min-h-screen bg-main text-white flex flex-col">

      <Header />

      <main className="max-w-6xl mx-auto py-12 px-6 w-full space-y-10">

        <PlayerHeader player={player} />

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-2 items-start mb-16">

          <div className="flex justify-center lg:justify-start">
            <PlayerActivity 
              activity={activity}
              fechasJugador={fechasJugador}
              formatDate={formatDate}
              getTiempoEnClan={getTiempoEnClan}
            />
          </div>

          <div className="w-full">
            <PlayerChart history={history} />
          </div>

        </div>

        <div className="w-full flex justify-center">

          <div className="w-full space-y-6">

            {medals && <PlayerMedals medals={medals} />}

            <div className="grid md:grid-cols-3 gap-6">
              <PlayerTopWeeks title="Donaciones" data={records.donaciones} color="text-green-400" />
              <PlayerTopWeeks title="Guerra" data={records.guerra} color="text-red-400" />
              <PlayerTopWeeks title="Viaje" data={records.viaje} color="text-blue-400" />
            </div>

            <PlayerAchievements achievements={achievements} />

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}