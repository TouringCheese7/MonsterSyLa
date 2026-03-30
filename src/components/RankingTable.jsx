import { useState, useEffect } from "react";
import { getRanking } from "../services/clanService";
import { supabase } from "../services/supabaseClient";
import { useClan } from "../context/ClanContext";

export default function RankingTable({ view = "view_ranking_historico" }) {

  const { clanId } = useClan();

  const [data, setData] = useState([]);
  const [selectedView, setSelectedView] = useState(view);
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  const titulos = {
    view_ranking_semanal: "Ranking Semanal",
    view_ranking_temporada: "Ranking de Temporada",
    view_ranking_historico: "Ranking Histórico"
  };

  useEffect(() => {

    if (!clanId) return;

    async function fetchRanking() {

      setLoading(true);

      try {

        /* 🔥 1. TRAER RANKING */
        const ranking = await getRanking(selectedView, order, clanId);

        let cambiosMap = {};

        /* 🔥 2. SOLO HISTÓRICO */
if (selectedView === "view_ranking_historico") {

const { data: cambios, error } = await supabase
  .from("view_ranking_change")
  .select("*")
  .eq("clan_id", Number(clanId));

if (!error && cambios) {
  cambios.forEach(c => {
    cambiosMap[c.player_tag] = c.cambio;
  });
}

}

        /* 🔥 3. MEZCLAR */
        const rankingWithChange = ranking.map(r => ({
          ...r,
          cambio: cambiosMap[r.player_tag] ?? 0
        }));

        setData(rankingWithChange);

      } catch (err) {

        console.error("Error cargando ranking:", err);
        setData([]);

      }

      setLoading(false);

    }

    fetchRanking();

  }, [selectedView, order, clanId]); // 🔥 ESTE ERA EL CAMBIO CLAVE

  return (

    <div className="bg-[#0a0a0a] border border-green-500/30 rounded-xl p-4 md:p-6 mt-10 shadow-[0_0_20px_rgba(34,197,94,0.2)]">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

        <h2 className="text-lg md:text-xl font-bold text-green-500 uppercase tracking-wider text-center md:text-left">
          {titulos[selectedView]}
        </h2>

        <div className="flex gap-2 w-full md:w-auto">

          <select
            className="bg-[#111] text-white border border-green-500/30 p-2 rounded cursor-pointer text-sm flex-1"
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
          >
            <option value="view_ranking_semanal">Semanal</option>
            <option value="view_ranking_temporada">Temporada</option>
            <option value="view_ranking_historico">Histórico</option>
          </select>

          <select
            className="bg-[#111] text-white border border-green-500/30 p-2 rounded cursor-pointer text-sm flex-1"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="desc">Mayor a Menor</option>
            <option value="asc">Menor a Mayor</option>
          </select>

        </div>

      </div>

      {/* TABLA */}
      <div className="overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar">
        <div className="min-w-[600px] md:min-w-0">

          <table className="w-full text-left text-white border-collapse">

            <thead className="sticky top-0 bg-[#111] z-10">
              <tr className="border-b border-green-500/30 text-gray-400 text-[10px] md:text-xs uppercase">

                <th className="py-3 pl-4">Pos.</th>
                <th className="py-3">Jugador</th>
                <th className="py-3 table-cell">Tag</th>
                <th className="py-3 text-center">Estado</th>
                <th className="py-3 text-right table-cell">Don.</th>
                <th className="py-3 text-right table-cell">Guerra</th>
                <th className="py-3 text-right table-cell">Viaje</th>
                <th className="py-3 text-right pr-4 text-green-400">Total</th>

              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="8" className="text-center py-10">
                    Cargando...
                  </td>
                </tr>

              ) : (

                data.map((row, idx) => (

                  <tr
                    key={idx}
                    className="border-b border-green-500/5 hover:bg-green-500/10 transition-colors text-sm md:text-base"
                  >

                    <td className="py-3 pl-4 font-mono text-green-500 font-bold">
                      <div className="flex items-center gap-2">

                        <span>#{idx + 1}</span>

                        {selectedView === "view_ranking_historico" && (
                          <span
                            className={`text-xs font-black ${
                              row.cambio > 0
                                ? "text-green-400"
                                : row.cambio < 0
                                ? "text-red-400"
                                : "text-gray-500"
                            }`}
                          >
                            {row.cambio > 0 ? "↑" : row.cambio < 0 ? "↓" : "•"}
                            {Math.abs(row.cambio)}
                          </span>
                        )}

                      </div>
                    </td>

                    <td className="py-3 font-bold truncate max-w-[100px] md:max-w-none">
                      {row.player_name}
                    </td>

                    <td className="py-3 font-mono text-green-500/60 text-xs table-cell">
                      {row.player_tag}
                    </td>

                    <td className="py-3 text-center">
                      <span
                        className={`text-[9px] md:text-[10px] px-2 py-1 rounded ${
                          row.es_activo
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {row.es_activo ? "ACTIVO" : "AUSENTE"}
                      </span>
                    </td>

                    <td className="py-3 text-right font-mono table-cell">
                      {parseInt(row.total_donaciones)}
                    </td>

                    <td className="py-3 text-right font-mono table-cell">
                      {parseInt(row.total_guerra)}
                    </td>

                    <td className="py-3 text-right font-mono table-cell">
                      {parseInt(row.total_viaje)}
                    </td>

                    <td className="py-3 text-right pr-4 font-bold text-green-400 font-mono text-sm md:text-lg">
                      {parseInt(row.score_total)}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}