import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function RankingGeneral() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    async function fetchRanking() {
      const { data } = await supabase
        .from('view_ranking_elo_historico')
        .select('name, elo_calculado')
        .order('elo_calculado', { ascending: false });
      if (data) setRanking(data);
    }
    fetchRanking();
  }, []);

  return (
    <div className="bg-black/40 border border-green-500/20 rounded-2xl p-6 mt-10 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-green-400">Ranking Completo</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-500 border-b border-white/10">
            <th className="pb-3">Posición</th>
            <th className="pb-3">Jugador</th>
            <th className="pb-3 text-right">ELO Histórico</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((p, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-4 font-mono text-gray-400">#{i + 1}</td>
              <td className="py-4 font-bold">{p.name}</td>
              <td className="py-4 text-right text-green-400 font-black">{Number(p.elo_calculado).toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}