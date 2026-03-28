import { useEffect, useState } from "react";
import { useClan } from "../../../context/ClanContext";
import { getRivalries } from "../../../services/clanService";

export default function Rivalries() {

  const { clanId } = useClan();
  const [data, setData] = useState([]);

  useEffect(() => {

    if (!clanId) return;

    async function fetchData() {
      const res = await getRivalries(clanId);
      setData(res);
    }

    fetchData();

  }, [clanId]);

  return (

    <section>

      <h2 className="text-2xl font-black mb-6 border-l-4 border-green-500 pl-4">
        Rivalidades 🔥
      </h2>

      <div className="space-y-4">

        {data.map((r, i) => (

          <div
            key={i}
            className="flex items-center justify-between bg-black/40 border border-red-500/20 px-4 py-3 rounded-lg"
          >

            <span className="text-red-400 font-bold">
              #{i + 1}
            </span>

            <span className="text-white">
              Player {r.player_a} ⚔️ Player {r.player_b}
            </span>

            <span className="text-xs text-gray-400">
              {r.weeks_together} semanas
            </span>

          </div>

        ))}

      </div>

    </section>
  );
}