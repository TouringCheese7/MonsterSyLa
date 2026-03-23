import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import RankingTableRanking from './components/RankingTableRanking';

export default function RankingHonor() {
  const [eloData, setEloData] = useState([]);

  useEffect(() => {
    async function fetchElo() {
      const { data } = await supabase.from('view_ranking_elo').select('*').order('elo', { ascending: false });
      setEloData(data?.map(d => ({
        name: d.player_name,
        activo: d.activo,
        value: d.elo,
        rango: d.rango
      })) || []);
    }
    fetchElo();
  }, []);

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black text-yellow-500 uppercase mb-10 text-center italic">Jerarquía de Honor</h1>
      <RankingTableRanking 
        title="Escalafón Militar" 
        data={eloData} 
        typeLabel="PUNTOS ELO" 
      />
    </div>
  );
}