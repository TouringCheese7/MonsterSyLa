import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function ClanActivityChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    async function fetchData() {

      const { data: rows } = await supabase
        .from("view_ranking_semanal")
        .select("*")
        .order("score_total", { ascending: false })
        .limit(10);

      if (!rows) return;

      const formatted = rows.map(r => ({
        name: r.player_name,
        score: Math.round(r.score_total)
      }));

      setData(formatted);

    }

    fetchData();

  }, []);

  return (

    <div className="bg-[#111] border border-green-500/20 rounded-xl p-6 mt-16">

      <h3 className="text-green-500 font-bold mb-6 uppercase tracking-wider">
        Actividad del Clan
      </h3>

      <ResponsiveContainer width="100%" height={350}>

        <BarChart data={data} layout="vertical">

          <CartesianGrid stroke="#1f1f1f"/>

          <XAxis type="number" stroke="#aaa"/>

          <YAxis
            dataKey="name"
            type="category"
            stroke="#aaa"
            width={120}
          />

          <Tooltip />

          <Bar
            dataKey="score"
            fill="#22c55e"
            radius={[0,6,6,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}