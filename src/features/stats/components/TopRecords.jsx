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
      setRecords(data);
    }

    fetchData();

  }, [clanId, category]);

  return (

    <section>

      {/* 🔥 TITLE */}
      <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 border-l-4 border-green-500 pl-4 italic">
        Top 15 Récords
      </h2>

      {/* 🔥 BOTONES */}
      <div className="flex gap-3 mb-6">

        {[
          { key: "donations", label: "Donaciones" },
          { key: "war", label: "Guerra" },
          { key: "travel", label: "Viaje" }
        ].map((btn) => (

          <button
            key={btn.key}
            onClick={() => setCategory(btn.key)}
            className={`px-4 py-2 border rounded font-bold transition
              ${category === btn.key
                ? "bg-green-600 text-white border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                : "text-gray-400 border-gray-600 hover:border-green-500"
              }`}
          >
            {btn.label}
          </button>

        ))}

      </div>

      {/* 🔥 LISTA CON SCROLL */}
      <div className="max-h-[410px] overflow-y-auto pr-2 space-y-3 custom-scroll">

        {records.map((r) => (

          <div
            key={`${r.player_id}-${r.fecha}-${r.category}`}
            className={`
              grid grid-cols-[60px_1fr_120px_100px]
              items-center
              bg-black/40
              border border-green-500/20
              px-4 py-3 rounded-lg
              transition
              hover:bg-green-500/10
              ${r.position === 1 ? "border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]" : ""}
            `}
          >

            {/* 🔢 POSICIÓN */}
            <div className="text-green-400 font-black text-lg">
              #{r.position}
            </div>

            {/* 👤 PLAYER */}
            <div>
              <p className="font-bold text-white">{r.player_name}</p>
              <p className="text-xs text-gray-400">{r.player_tag}</p>
            </div>

            {/* 📊 VALOR */}
            <div className="text-center">
              <p className="text-green-400 font-bold text-lg">
                {r.value}
              </p>
              <p className="text-xs text-gray-500">
                {r.fecha}
              </p>
            </div>

            {/* 🟢 STATUS */}
            <div className="text-right">
              {r.is_active && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  ACTIVO
                </span>
              )}
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}