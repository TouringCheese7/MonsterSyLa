import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";

import PlayerSelect from "./PlayerSelect";
import PlayerComparison from "./PlayerComparison";

export default function PlayerComparisonContainer() {

  const [playersDB, setPlayersDB] = useState([]);

  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");

  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);

  useEffect(() => {

    async function fetchPlayers() {

      const { data } = await supabase
        .from("view_players_full")
        .select("*");

      setPlayersDB(data || []);

    }

    fetchPlayers();

  }, []);

  return (

    <div className="space-y-6">

      {/* 🔍 SELECTORES */}
      <div className="grid md:grid-cols-2 gap-6">

        <PlayerSelect
          value={searchA}
          onChange={setSearchA}
          players={playersDB}
          onSelect={(p) => {
            setPlayerA(p);
            setSearchA(p.player_name);
          }}
          placeholder="Jugador 1..."
        />

        <PlayerSelect
          value={searchB}
          onChange={setSearchB}
          players={playersDB}
          onSelect={(p) => {
            setPlayerB(p);
            setSearchB(p.player_name);
          }}
          placeholder="Jugador 2..."
        />

      </div>

      {/* ⚔️ COMPARADOR */}
      {playerA && playerB && (
        <PlayerComparison
          players={[playerA.player_tag, playerB.player_tag]}
        />
      )}

    </div>
  );
}