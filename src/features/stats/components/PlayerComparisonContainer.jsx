import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useClan } from "../../../context/ClanContext";

import PlayerSelect from "./PlayerSelect";
import PlayerComparison from "./PlayerComparison";

export default function PlayerComparisonContainer() {

  const { clanId } = useClan();

  const [playersDB, setPlayersDB] = useState([]);

  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");

  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!clanId) return;

    async function fetchPlayers() {

      setLoading(true);

      const { data, error } = await supabase
        .from("view_ranking_elo") // 🔥 CAMBIO CLAVE
        .select("*")
        .eq("clan_id", clanId)
        .order("elo", { ascending: false });

      if (error) {
        console.error("Error cargando jugadores:", error);
        setPlayersDB([]);
      } else {
        setPlayersDB(data || []);
      }

      // 🔥 RESET
      setPlayerA(null);
      setPlayerB(null);
      setSearchA("");
      setSearchB("");

      setLoading(false);
    }

    fetchPlayers();

  }, [clanId]);

  // 🔥 evitar duplicados
  const filteredPlayersA = playersDB.filter(
    p => p.player_tag !== playerB?.player_tag
  );

  const filteredPlayersB = playersDB.filter(
    p => p.player_tag !== playerA?.player_tag
  );

  return (

    <div className="space-y-8">

      {/* 🔍 SELECTORES */}
      <div className="grid md:grid-cols-2 gap-6">

        <PlayerSelect
          value={searchA}
          onChange={setSearchA}
          players={filteredPlayersA}
          onSelect={(p) => {
            setPlayerA(p);
            setSearchA(p.player_name);
          }}
          placeholder="Jugador 1..."
        />

        <PlayerSelect
          value={searchB}
          onChange={setSearchB}
          players={filteredPlayersB}
          onSelect={(p) => {
            setPlayerB(p);
            setSearchB(p.player_name);
          }}
          placeholder="Jugador 2..."
        />

      </div>

      {/* ⏳ LOADING */}
      {loading && (
        <div className="text-center text-gray-500 text-sm">
          Cargando jugadores...
        </div>
      )}

      {/* ⚔️ COMPARADOR */}
      {!loading && playerA && playerB && (
        <PlayerComparison
          players={[playerA.player_tag, playerB.player_tag]}
        />
      )}

      {/* 🧠 HINT */}
      {!loading && (!playerA || !playerB) && (
        <div className="text-center text-gray-600 text-xs tracking-widest uppercase">
          Selecciona dos jugadores para comparar
        </div>
      )}

    </div>

  );
}