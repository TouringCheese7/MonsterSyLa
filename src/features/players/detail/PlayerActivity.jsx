export default function PlayerActivity({ 
  activity, 
  fechasJugador, 
  formatDate, 
  getTiempoEnClan 
}) {

  return (

    <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl flex flex-col items-center gap-6">

      <div className="h-auto max-h-[320px]">

        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 text-center">
          Nivel de Actividad
        </h3>

        {/* TERMÓMETRO */}
        <div className="relative w-14 h-52 bg-gray-900 rounded-full border border-white/10 p-1 mx-auto flex items-end">

          <div
            className="w-full bg-green-500 rounded-full shadow-[0_0_20px_#22c55e] transition-all duration-500"
            style={{ height: `${activity}%` }}
          />

          <div className="absolute inset-0 flex items-center justify-center font-black text-lg">
            {activity}%
          </div>

        </div>

      </div>

<div className="mt-6 text-center text-[18px] font-mono space-y-1">
  <p className="text-green-400">
    🟢 {fechasJugador?.ingreso ? formatDate(fechasJugador.ingreso) : "—"}
  </p>

  <p className="text-red-500">
    🔴 {fechasJugador?.salida ? formatDate(fechasJugador.salida) : "Actual"}
  </p>

  <p className="text-gray-500 mt-1">
    ⏳ {getTiempoEnClan?.(fechasJugador?.ingreso, fechasJugador?.salida)}
  </p>

</div>

    </div>

  );
}