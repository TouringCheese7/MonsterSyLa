import { useEffect, useState } from "react";
import { useClan } from "../../../context/ClanContext";
import { getTopRecords } from "../../../services/clanService";

export default function TopRecords() {

  const { clanId } = useClan();

  const [category, setCategory] = useState("donations");
  const [records, setRecords] = useState([]);

  useEffect(() => {

    if (!clanId) return;

    async function fetchData() {
      const data = await getTopRecords(clanId, category);
      setRecords(data || []);
    }

    fetchData();

  }, [clanId, category]);

  return (

    <section className="mt-10">

      {/* 🔥 TITLE */}
      <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 border-l-4 border-green-500 pl-4 italic">
        Top 10 Récords
      </h2>

      {/* 🔥 FILTROS */}
      <div className="flex gap-3 mb-6 flex-wrap">

        {["donations", "war", "travel"].map((cat) => (

          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition ${
              category === cat
                ? "bg-green-600 text-white border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                : "bg-black/40 text-gray-400 border-white/10 hover:border-green-500/40"
            }`}
          >
            {cat === "donations" && "Donaciones"}
            {cat === "war" && "Guerra"}
            {cat === "travel" && "Viaje"}
          </button>

        ))}

      </div>

      {/* 🔥 CONTENEDOR SCROLL */}
      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">

        {records.map((r) => (

          <div
            key={`${r.player_id}-${r.fecha}-${r.category}`}
            className="grid grid-cols-[70px_1fr_140px] items-center bg-black/40 border border-green-500/20 px-4 py-3 rounded-xl hover:scale-[1.01] transition-all"
          >

            {/* 🟢 POSICIÓN */}
            <div className="text-green-400 font-black text-lg">
              #{r.position}
            </div>

            {/* 🧠 INFO */}
            <div>
              <p className="font-bold text-white">
                {r.player_name}
              </p>
              <p className="text-xs text-gray-400 font-mono">
                {r.player_tag}
              </p>
            </div>

            {/* 📊 VALOR */}
            <div className="text-right">
              <p className="text-green-400 font-black text-lg">
                {r.value}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(r.fecha).toLocaleDateString("es-MX")}
              </p>
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}