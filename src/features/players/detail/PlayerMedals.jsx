import { useState } from "react";

export default function PlayerMedals({ medals }) {

  const [filter, setFilter] = useState("guerra");

  if (!medals || medals.length === 0) {
    return (
      <div className="bg-[#050505] border border-yellow-500/20 rounded-3xl p-6">
        <h2 className="text-yellow-400 font-black uppercase mb-2">
          🏆 Medallas
        </h2>
        <p className="text-gray-500 text-sm">Sin medallas aún</p>
      </div>
    );
  }

  /* -----------------------------
  🧠 FORMATO FECHA
  ----------------------------- */
  function formatDate(dateString) {
    if (!dateString) return "—";

    let date;

    if (typeof dateString === "string" && dateString.includes("T")) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + "T00:00:00");
    }

    if (isNaN(date)) return "—";

    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  /* -----------------------------
  🏆 CONTADOR
  ----------------------------- */
  const total = {
    oro: medals.filter(m => m.posicion === 1).length,
    plata: medals.filter(m => m.posicion === 2).length,
    bronce: medals.filter(m => m.posicion === 3).length
  };

  /* -----------------------------
  🎯 FILTRO + ORDEN
  ----------------------------- */
  const filtered = medals
    .filter(m => m.tipo === filter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const tipos = ["guerra", "donaciones", "viaje", "general"];

  const descripcion = {
    guerra: "Top semanal en guerra",
    donaciones: "Top semanal en donaciones",
    viaje: "Top semanal en viaje",
    general: "Mejor desempeño general"
  };

  return (
    <div className="bg-[#050505] border border-yellow-500/20 rounded-3xl p-6">

      {/* HEADER */}
      <h2 className="text-yellow-400 font-black uppercase mb-1">
        🏆 Medallas
      </h2>

      <p className="text-[10px] text-gray-500 mb-4">
        Totales históricos
      </p>

      {/* CONTADOR */}
      <div className="flex gap-6 text-sm font-mono mb-6">
        <span className="text-yellow-400">🥇 {total.oro}</span>
        <span className="text-gray-300">🥈 {total.plata}</span>
        <span className="text-orange-500">🥉 {total.bronce}</span>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tipos.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition ${
              filter === t
                ? "bg-green-500/20 text-green-400 border-green-500/40"
                : "bg-white/5 text-gray-400 border-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 🔥 GRID CON SCROLL */}
      <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">

        <div className="grid md:grid-cols-3 gap-4">

          {filtered.map((m, i) => {

            const medalIcon =
              m.posicion === 1
                ? "🥇"
                : m.posicion === 2
                ? "🥈"
                : "🥉";

            const borderColor =
              m.posicion === 1
                ? "border-yellow-500/50"
                : m.posicion === 2
                ? "border-gray-400/40"
                : "border-orange-500/40";

            return (
              <div
                key={i}
                className={`bg-black border ${borderColor} rounded-xl p-4 text-center hover:scale-105 transition-all`}
              >

                {/* ICONO */}
                <div className="text-2xl mb-2">
                  {medalIcon}
                </div>

                {/* TIPO */}
                <p className="text-xs font-black uppercase text-yellow-400">
                  {m.tipo}
                </p>

                {/* DESCRIPCIÓN */}
                <p className="text-[10px] text-gray-500 mt-1">
                  {descripcion[m.tipo] || "Logro semanal"}
                </p>

                {/* FECHA */}
                <p className="text-[10px] text-gray-600 font-mono mt-1">
                  {formatDate(m.date)}
                </p>

              </div>
            );

          })}

        </div>

      </div>

    </div>
  );
}