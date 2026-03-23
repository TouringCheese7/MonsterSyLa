import React from 'react';
import { getRankImage } from '../../../utils/ranks';

const getCambioIcon = (cambio) => {
  if (cambio > 0) return "↑";
  if (cambio < 0) return "↓";
  return "•";
};

const getCambioColor = (cambio) => {
  if (cambio > 0) return "text-green-400";
  if (cambio < 0) return "text-red-400";
  return "text-gray-500";
};

export default function RankingTableRanking({
  title,
  data = [],
  typeLabel,
  isHistoryView = false,
  showActiveOnly = false
}) {

const getCambioIcon = (cambio) => {
  if (cambio > 0) return "↑";
  if (cambio < 0) return "↓";
  return "•";
};

const getCambioColor = (cambio) => {
  if (cambio > 0) return "text-green-400";
  if (cambio < 0) return "text-red-400";
  return "text-gray-500";
};

  if (!data || data.length === 0) return null;

  /* 🔥 FILTRO ACTIVOS */
  const filteredData = showActiveOnly
    ? data.filter(p => p.activo)
    : data;

  /* 🔥 MAX VALUE PARA BARRAS */
  const maxValue = Math.max(
    ...filteredData.map(p => p.value || 0),
    1
  );

  return (

    <div className="bg-[#0a0a0a] border border-green-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">

      {/* TITLE */}
      <h2 className="text-lg font-bold text-green-500 uppercase tracking-wider mb-4 border-l-4 border-green-500 pl-3 italic">
        {title}
      </h2>

      <div className="overflow-x-auto max-h-[300px] overflow-y-auto">

        <table className="w-full text-left text-white border-collapse">

          {/* HEADER */}
          <thead className="sticky top-0 bg-[#0a0a0a] z-10">
            <tr className="border-b border-green-500/30 text-gray-500 text-[10px] uppercase font-black">
              <th className="py-2 pl-4 w-12">#</th>
              <th className="py-2">Jugador</th>
              {!isHistoryView && <th className="py-2">Tag</th>}
              <th className="py-2 text-center">Estado</th>

              {isHistoryView ? (
                <>
                  <th className="py-2 text-right">S1</th>
                  <th className="py-2 text-right">S2</th>
                  <th className="py-2 text-right">S3</th>
                  <th className="py-2 text-right text-green-400">S4</th>
                </>
              ) : (
                <th className="py-2 text-right pr-6 text-green-400">
                  {typeLabel}
                </th>
              )}

            </tr>
          </thead>

          {/* BODY */}
          <tbody>

            {filteredData.map((row, idx) => {

              const percentage = ((row.value || 0) / maxValue) * 100;

              return (

                <tr
                  key={idx}
                  className="border-b border-green-500/5 hover:bg-green-500/10 transition-all"
                >

                  {/* POS */}
                  <td className="py-3 pl-4 font-mono text-green-500 font-bold italic text-base">
  <div className="flex items-center gap-2">
    <span>#{idx + 1}</span>

    {!isHistoryView && row.cambio !== undefined && (
      <span className={`text-xs font-black ${
        row.cambio > 0
          ? "text-green-400"
          : row.cambio < 0
          ? "text-red-400"
          : "text-gray-500"
      }`}>
        {row.cambio > 0 ? "↑" : row.cambio < 0 ? "↓" : "•"}
        {Math.abs(row.cambio)}
      </span>
    )}
  </div>
</td>

                  {/* PLAYER */}
                  <td className="py-3 font-black uppercase text-gray-200">

                    <div className="flex items-center gap-4">

                      {/* RANGO IMG */}
                      {row.rango && (
                        <img
                          src={getRankImage(row.rango)}
                          alt={row.rango}
                          className="w-10 h-10 object-contain"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      )}

                      <div className="flex flex-col w-full">

                        {/* NAME */}
                        <span className="text-sm tracking-tight">
                          {row.name}
                        </span>

                        {/* 🔥 BARRA CR */}
                        {!isHistoryView && (
                          <div className="w-full h-2 bg-black/40 border border-white/10 rounded-full mt-1 overflow-hidden">

                            <div
                              className={`h-full transition-all duration-700 ${
                                idx === 0
                                  ? "bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.7)]"
                                  : idx === 1
                                  ? "bg-gray-300"
                                  : idx === 2
                                  ? "bg-orange-500"
                                  : "bg-green-400"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />

                          </div>
                        )}

                      </div>

                    </div>

                  </td>

                  {/* TAG */}
                  {!isHistoryView && (
                    <td className="py-3 font-mono text-green-400/80 text-xs">
                      {row.player_tag || '#---'}
                    </td>
                  )}

                  {/* ESTADO */}
                  <td className="py-3 text-center text-[10px] font-black uppercase">
                    <span className={row.activo ? 'text-green-400' : 'text-red-500'}>
                      {row.activo ? 'ACTIVO' : 'AUSENTE'}
                    </span>
                  </td>

                  {/* VALUES */}
                  {isHistoryView ? (
                    row.history?.map((val, i) => (
                      <td
                        key={i}
                        className={`py-3 text-right font-mono ${
                          i === 3
                            ? 'text-green-400 font-bold pr-6'
                            : 'text-gray-500 px-2'
                        }`}
                      >
                        {Math.round(val || 0)}
                      </td>
                    ))
                  ) : (
                    <td className="py-3 text-right pr-6 font-bold text-green-400 font-mono text-lg">
                      {Math.round(row.value || 0)}
                    </td>
                  )}

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>

  );

}