import { useEffect, useState } from 'react';
import { supabase } from "../../../services/supabaseClient";
import { getRangoIcon } from '../utils/RangoHelpers';

export default function TopThree() {

  const [podium, setPodium] = useState([]);

  useEffect(() => {

    async function fetchTopThree() {

      const { data } = await supabase
        .from('view_ranking_elo')
        .select('*')
        .order('elo', { ascending: false })
        .limit(3);

      setPodium(data || []);

    }

    fetchTopThree();

  }, []);

  const podiumOrder = [podium[1], podium[0], podium[2]].filter(Boolean);

  return (

    <div className="flex justify-center items-end gap-6 h-72 mb-16 mt-6">

      {podiumOrder.map((p, index) => {

        const isFirst = index === 1;
        const isSecond = index === 0;
        const isThird = index === 2;

        const heights = ["h-44", "h-60", "h-36"];

        const baseColor =
          isFirst
            ? "bg-yellow-500"
            : isSecond
            ? "bg-gray-400"
            : "bg-orange-700";

        const glow =
          isFirst
            ? "shadow-[0_0_30px_rgba(234,179,8,0.35)]"
            : "";

        return (

          <div
            key={index}
            className={`flex flex-col items-center w-32 ${heights[index]}`}
          >

            {/* PODIO */}
            <div
              className={`w-full h-full ${baseColor} rounded-t-2xl border border-white/10 flex flex-col justify-end items-center pb-4 transition-all duration-300 ${glow}`}
            >

              {/* RANGO */}
              <img
                src={getRangoIcon(p?.rango)}
                alt="rango"
                className="w-12 h-12 object-contain mb-2"
              />

              {/* POSICIÓN */}
              <span className="text-xl font-black text-black">
                {isFirst ? "1°" : isSecond ? "2°" : "3°"}
              </span>

            </div>

            {/* INFO */}
            <div className="text-center mt-3">

              <p className="font-bold text-sm text-white truncate w-28">
                {p?.player_name}
              </p>

              <p className="text-green-400 font-black text-lg">
                {Math.round(p?.elo || 0)}
              </p>

            </div>

          </div>

        );

      })}

    </div>

  );

}