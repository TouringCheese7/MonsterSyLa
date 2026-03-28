import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { useClan } from "../../context/ClanContext";

import MainLayout from "../../layouts/MainLayout";

import ClanStats from "./components/ClanStats";
import PlayerPodium from "./components/PlayerPodium";
import SearchBar from "./components/SearchBar";
import ExpulsionList from "./components/ExpulsionList";
import BalanceTable from "./components/BalanceTable";

import ClanMedallero from "../../components/ClanMedallero";

export default function PlayersPage() {

  const { clanId } = useClan();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    if (!clanId) return;

    async function fetchPlayers() {

      const { data, error } = await supabase
        .from("view_ranking_elo")
        .select("*")
        .eq("clan_id", clanId)
        .order("elo", { ascending: false });

      if (error) {
        console.error("Error cargando jugadores:", error);
      } else {
        console.log("PLAYERS DATA:", data);
        setPlayers(data || []);
      }

      setLoading(false);
    }

    fetchPlayers();

  }, [clanId]);

  function goToPlayer(tag) {
    if (!tag) return;
    navigate(`/players/${tag.replace("#", "")}`);
  }

  if (loading) {
    return <div className="min-h-screen bg-black"></div>;
  }

  return (

    <MainLayout>

      {/* 🔍 BUSCADOR */}
      <div className="max-w-4xl mx-auto">
        <SearchBar
          placeholder="BUSCAR JUGADOR, TAG O RANGO..."
          value={search}
          onChange={setSearch}
          players={players}
          onSelect={goToPlayer}
        />
      </div>

      {/* 📊 ESTADÍSTICAS */}
      <ClanStats />

      {/* 🏆 PODIO */}
      <PlayerPodium onSelect={goToPlayer} />

      {/* 🥇 MEDALLERO */}
      <ClanMedallero />

      {/* ⚠️ EXPULSIÓN */}
      <ExpulsionList />

      {/* 📉 BALANCE */}
      <BalanceTable onSelect={goToPlayer} />

    </MainLayout>

  );
}