// src/pages/ranking/RankingElo.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from "../../services/supabaseClient";

const RankingElo = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchElo = async () => {
            const { data, error } = await supabase
                .from('view_ranking_elo_historico')
                .select('*')
                .order('elo_calculado', { ascending: false });

            if (error) console.error("Error al cargar ELO:", error);
            else setRanking(data);
            setLoading(false);
        };
        fetchElo();
    }, []);

    if (loading) return <div className="text-white text-center">Cargando ELO...</div>;

    return (
        <div className="ranking-elo-container bg-[#0a0a0a] p-6 rounded-lg border border-gray-800">
            <table className="w-full text-left text-white border-collapse">
                <thead>
                    <tr className="border-b border-gray-700 text-green-500">
                        <th className="p-3">#</th>
                        <th className="p-3">Nombre</th>
                        <th className="p-3 text-right">ELO</th>
                    </tr>
                </thead>
                <tbody>
                    {ranking.map((j, index) => (
                        <tr key={j.player_id} className="border-b border-gray-800 hover:bg-gray-900">
                            <td className="p-3 font-mono">{index + 1}</td>
                            <td className="p-3">{j.name}</td>
                            <td className="p-3 text-right font-bold text-green-400">{j.elo_calculado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RankingElo;