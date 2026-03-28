import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useClan } from "../context/ClanContext";

export default function ClanStats() {

  const { clanId } = useClan();

  const [stats, setStats] = useState({
    members: 0,
    avgWar: 0,
    avgDonations: 0,
    mvp: "---"
  });

  useEffect(() => {

    if (!clanId) return;

    async function fetchStats() {

      // 🔥 última fecha DEL CLAN
      const { data: lastDateData } = await supabase
        .from("snapshots")
        .select("date")
        .eq("clan_id", clanId)
        .order("date", { ascending: false })
        .limit(1);

      if (!lastDateData?.length) return;

      const lastDate = lastDateData[0].date;

      // 🔥 SOLO ESE CLAN
      const { data: activePlayers } = await supabase
        .from("snapshots")
        .select(`
          player_id,
          donations,
          war_points,
          players(name)
        `)
        .eq("clan_id", clanId)
        .eq("date", lastDate);

      if (!activePlayers) return;

      const members = activePlayers.length;

      const totalWar = activePlayers.reduce(
        (sum, p) => sum + (p.war_points || 0), 0
      );

      const totalDon = activePlayers.reduce(
        (sum, p) => sum + (p.donations || 0), 0
      );

      const avgWar = Math.round(totalWar / members);
      const avgDon = Math.round(totalDon / members);

      const ranked = activePlayers.map(p => ({
        name: p.players?.name,
        score: (p.donations || 0) + (p.war_points || 0) * 1.5
      }));

      ranked.sort((a, b) => b.score - a.score);

      const mvp = ranked[0]?.name || "---";

      setStats({
        members,
        avgWar,
        avgDonations: avgDon,
        mvp
      });

    }

    fetchStats();

  }, [clanId]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
      <StatCard title="Miembros Activos" value={stats.members} />
      <StatCard title="Promedio Guerra" value={stats.avgWar} />
      <StatCard title="Promedio Donaciones" value={stats.avgDonations} />
      <StatCard title="MVP de la Semana" value={stats.mvp} />
    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-[#111] border border-green-500/20 rounded-xl p-6 text-center shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_20px_rgba(34,197,94,0.35)] transition">
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
        {title}
      </p>
      <p className="text-3xl font-black text-green-400">
        {value}
      </p>
    </div>
  );
}