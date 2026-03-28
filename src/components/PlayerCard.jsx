export default function PlayerCard({ place, username, tag, stats }) {
  
  const formatNumber = (val) => {
    if (val === undefined || val === null) return "0";
    const cleanStr = val.toString().replace('.', '');
    const number = parseInt(cleanStr, 10);
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="bg-[#111] p-4 md:p-6 rounded-xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all">

      <h3 className="text-[10px] md:text-xs uppercase text-green-500 tracking-widest font-bold mb-2">
        {place}
      </h3>

      <h2 className="text-lg md:text-xl font-black text-white break-words">
        {username}
      </h2>

      <p className="text-[10px] font-mono text-green-500/60 mb-4 break-all">
        {tag}
      </p>
      
      {/* 🔥 CAMBIO CLAVE AQUÍ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 border-t border-green-500/20 pt-4">

        {stats.map((stat, i) => (
          <div key={i}>
            <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider">
              {stat.label}
            </p>

            <p className="font-mono text-green-400 font-bold text-base md:text-lg">
              {formatNumber(stat.value)}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}