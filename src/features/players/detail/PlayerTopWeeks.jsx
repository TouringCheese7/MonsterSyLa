export default function PlayerTopWeeks({ data, title, color }) {

  return (

    <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5">

      <h3 className={`font-bold mb-4 ${color}`}>
        {title}
      </h3>

      {data?.length === 0 && (
        <p className="text-gray-500 text-sm">Sin datos</p>
      )}

      {data?.map((r, i) => (

        <div key={i} className="flex justify-between text-sm mb-2">

          <span>
            {new Date(r.date).toLocaleDateString("es-MX")}
          </span>

          <span className="font-mono">
            {r.puntos}
          </span>

          <span className="text-gray-500">
            #{r.posicion}
          </span>

        </div>

      ))}

    </div>

  );
}