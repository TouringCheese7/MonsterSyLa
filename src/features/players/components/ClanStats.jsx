import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useClan } from "../../../context/ClanContext";

export default function ClanStats() {

  const { clanId } = useClan();

  const [stats, setStats] = useState({
    members: 0,
    donations: 0,
    war: 0,
    travel: 0
  });

  useEffect(() => {

    if (!clanId) return;

    async function fetchStats() {

      const { data, error } = await supabase
        .from("view_ranking_semanal")
        .select("*")
        .eq("clan_id", clanId); // 🔥 CLAVE

      if (error) {
        console.error("Error stats:", error);
        return;
      }

      if (!data) return;

      /* 🔥 SOLO ACTIVOS */
      const activos = data.filter(p => p.es_activo);

      const donations = activos.reduce((sum, p) => sum + (p.total_donaciones || 0), 0);
      const war = activos.reduce((sum, p) => sum + (p.total_guerra || 0), 0);
      const travel = activos.reduce((sum, p) => sum + (p.total_viaje || 0), 0);

      setStats({
        members: activos.length,
        donations,
        war,
        travel
      });

    }

    fetchStats();

  }, [clanId]);

  return (

    <section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <StatCard label="Miembros Activos" value={stats.members} />

        <StatCard label="Donaciones Semanal" value={stats.donations} />

        <StatCard label="Guerra Semanal" value={stats.war} />

        <StatCard label="Viaje Semanal" value={stats.travel} />

      </div>

    </section>

  );

}

function StatCard({ label, value }) {

  return (

    <div className="bg-[#050505] border border-green-500/20 p-6 rounded-2xl text-center shadow-[0_0_10px_rgba(34,197,94,0.15)]">

      <p className="text-[10px] uppercase text-gray-500 font-black mb-2 tracking-widest">
        {label}
      </p>

      <p className="text-3xl font-black text-green-500 font-mono">
        {(value || 0).toLocaleString()}
      </p>

    </div>

  );

}