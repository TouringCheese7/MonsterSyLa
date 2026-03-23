export default function PlayerAchievements({ achievements }) {

  /* -----------------------------
  🚫 SI NO HAY LOGROS
  ----------------------------- */
  if (!achievements || achievements.length === 0) {
    return (
      <div className="bg-[#050505] border border-white/5 p-6 rounded-3xl">
        <h2 className="text-yellow-400 font-black uppercase mb-4">
          🏆 Logros
        </h2>
        <p className="text-gray-500 text-sm">
          Sin logros aún
        </p>
      </div>
    );
  }

  /* -----------------------------
  🧠 ANTI DUPLICADOS
  ----------------------------- */
  const uniqueAchievements = [
    ...new Map(
      achievements.map(a => [a.id, a])
    ).values()
  ];

  /* -----------------------------
  🎨 COLORES POR RAREZA
  ----------------------------- */
  const rarezaStyles = {
    comun: "border-white/10 text-gray-300",
    raro: "border-blue-500/40 text-blue-400",
    epico: "border-purple-500/40 text-purple-400",
    legendario: "border-yellow-500/40 text-yellow-400"
  };

  /* -----------------------------
  📊 ORDEN
  ----------------------------- */
  const ordenados = [...uniqueAchievements].sort((a, b) => {
    const prioridad = {
      legendario: 4,
      epico: 3,
      raro: 2,
      comun: 1
    };
    return (prioridad[b.rareza] || 0) - (prioridad[a.rareza] || 0);
  });

  return (
    <div className="bg-[#050505] border border-white/5 p-6 rounded-3xl">

      {/* HEADER */}
      <h2 className="text-yellow-400 font-black uppercase mb-6">
        🏆 Logros
      </h2>

      {/* 🔥 GRID + SCROLL */}
      <div className="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">

        <div className="grid md:grid-cols-3 gap-4">

          {ordenados.map((a, i) => (

            <div
              key={i}
              className={`bg-black border rounded-xl p-4 text-center 
              hover:scale-105 transition-all duration-300
              ${rarezaStyles[a.rareza] || "border-white/10 text-white"}`}
            >

              {/* ICONO */}
              <div className="text-xl mb-2">
                🏆
              </div>

              {/* NOMBRE */}
              <p className="text-xs font-black uppercase">
                {a.nombre}
              </p>

              {/* DESCRIPCIÓN */}
              <p className="text-[10px] text-gray-500 mt-1">
                {a.descripcion}
              </p>

              {/* RAREZA */}
              <p className="text-[9px] mt-2 opacity-60 uppercase tracking-widest">
                {a.rareza}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}