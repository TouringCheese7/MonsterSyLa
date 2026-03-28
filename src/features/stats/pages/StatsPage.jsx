import { useState, useEffect } from "react";

import MainLayout from "../../../layouts/MainLayout";
import GlowLine from "../../../components/GlowLine";

import TopRecords from "../components/TopRecords";
import PlayerComparison from "../components/PlayerComparison";
import PlayerSelect from "../components/PlayerSelect";

import { supabase } from "../../../services/supabaseClient";

export default function StatsPage() {

  const [players, setPlayers] = useState([]);

  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");

  const [selected, setSelected] = useState([null, null]);

  useEffect(() => {
    async function fetchPlayers() {
      const { data } = await supabase
        .from("view_players_full")
        .select("*");

      setPlayers(data || []);
    }

    fetchPlayers();
  }, []);

  return (

    <MainLayout>

      <section className="py-12 px-4 space-y-12">

        <h1 className="text-4xl md:text-5xl font-black text-green-500 uppercase">
          Estadísticas del Clan
        </h1>

        <TopRecords />

        <GlowLine />

        {/* ⚔️ COMPARADOR */}
        <section>

          <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 border-l-4 border-green-500 pl-4 italic">
            Comparador de Jugadores
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">

            <PlayerSelect
              value={queryA}
              onChange={setQueryA}
              players={players}
              placeholder="Jugador 1..."
              onSelect={(player) => {
                setQueryA(player.player_name);
                setSelected(prev => [player.player_tag, prev[1]]);
              }}
            />

            <PlayerSelect
              value={queryB}
              onChange={setQueryB}
              players={players}
              placeholder="Jugador 2..."
              onSelect={(player) => {
                setQueryB(player.player_name);
                setSelected(prev => [prev[0], player.player_tag]);
              }}
            />

          </div>

          {selected[0] && selected[1] && (
            <PlayerComparison players={selected} />
          )}

        </section>

      </section>

      <GlowLine />

    </MainLayout>
  );
}