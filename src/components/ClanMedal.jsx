import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function ClanMedal() {

  const [medal, setMedal] = useState(null);

  useEffect(() => {

    async function fetchMedal() {

      const { data } = await supabase
        .from("view_clan_medal")
        .select("*")
        .single();

      setMedal(data);

    }

    fetchMedal();

  }, []);

  if (!medal) return null;

  const rows = [
    { name: "TLATOANI", value: medal.tlatoani },
    { name: "TLACATECATL", value: medal.tlacatecatl },
    { name: "OCELOTL", value: medal.ocelotl },
    { name: "CUAUHTLI", value: medal.cuauhtli },
    { name: "YAOTL", value: medal.yaotl },
    { name: "TELPOCHCALLI", value: medal.telpochcalli }
  ];

  return (

    <div className="bg-[#050505] border border-green-500/20 rounded-xl p-6 mt-10">

      <h2 className="text-xl font-bold text-green-500 mb-6 uppercase tracking-wider">
        Medallero del Clan
      </h2>

      <div className="flex flex-col gap-3">

        {rows.map((r) => (

          <div
            key={r.name}
            className="flex justify-between items-center border-b border-green-500/10 pb-2"
          >

            <span className="font-bold tracking-wide">
              {r.name}
            </span>

            <span className="text-green-400 font-mono text-lg">
              {r.value}
            </span>

          </div>

        ))}

      </div>

    </div>

  );
}