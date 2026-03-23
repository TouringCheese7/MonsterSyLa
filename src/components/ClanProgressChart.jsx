import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useClan } from "../context/ClanContext";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function ClanProgressChart() {

  const { clanId } = useClan();
  const [data, setData] = useState([]);

  useEffect(() => {

    if (!clanId) return;

    async function fetchData() {

      const { data: rows } = await supabase
        .from("snapshots")
        .select("date, donations, war_points")
        .eq("clan_id", clanId);

      if (!rows) return;

      const grouped = {};

      rows.forEach(r => {

        if (!grouped[r.date]) {
          grouped[r.date] = {
            date: new Date(r.date).toLocaleDateString(),
            don: 0,
            war: 0
          };
        }

        grouped[r.date].don += r.donations || 0;
        grouped[r.date].war += r.war_points || 0;

      });

      const arr = Object.values(grouped)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-6);

      setData(arr);

    }

    fetchData();

  }, [clanId]);

  return (
    <div className="bg-[#111] border border-green-500/20 rounded-xl p-6 mt-16">
      <h3 className="text-green-500 font-bold mb-6 uppercase tracking-wider">
        Progreso del Clan
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#1f1f1f" />
          <XAxis dataKey="date" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />

          <Line dataKey="don" stroke="#22c55e" strokeWidth={3} />
          <Line dataKey="war" stroke="#10b981" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}