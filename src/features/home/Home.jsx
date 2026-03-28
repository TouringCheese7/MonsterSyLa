import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🔥

import MainLayout from "../../layouts/MainLayout";

import PlayerCard from "../../components/PlayerCard";
import RankingTable from "../../components/RankingTable";
import GlowLine from "../../components/GlowLine";
import ClanStats from "../../components/ClanStats";
import RecentActivity from "../../components/RecentActivity";
import ClanProgressChart from "../../components/ClanProgressChart";
import Button from "../../components/Button";
import MVP from "../../features/home/components/MVP";

import { useClan } from "../../context/ClanContext";

import {
  getTop3Players,
  getTopDonations,
  getTopWar,
  getTopTravel
} from "../../services/clanService";

export default function Home() {

  const { clanId, clanName, clanSlug } = useClan(); // 🔥

  const navigate = useNavigate(); // 🔥

  const [top3, setTop3] = useState([]);
  const [leaders, setLeaders] = useState({
    don: null,
    gue: null,
    via: null
  });

  useEffect(() => {

    if (!clanId) return;

    async function fetchData() {

      const t3 = await getTop3Players(clanId);
      const don = await getTopDonations(clanId);
      const gue = await getTopWar(clanId);
      const via = await getTopTravel(clanId);

      setTop3(t3 || []);

      setLeaders({
        don,
        gue,
        via
      });

    }

    fetchData();

  }, [clanId]);

  return (

    <MainLayout>

      {/* 🔥 HERO DEL CLAN */}
      <section className="relative text-center py-14 px-4">

        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-transparent blur-3xl opacity-40"></div>

        <div className="relative z-10">

          <h1 className="text-5xl md:text-7xl font-black text-green-500 tracking-widest uppercase break-words">
            {clanName || "Selecciona un clan"}
          </h1>

          <p className="text-gray-400 mt-6 text-sm tracking-widest uppercase">
            Estadísticas competitivas del clan
          </p>

          {/* 🔥 BOTONES FIX */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">

            <Button
              onClick={() => clanSlug && navigate(`/${clanSlug}/ranking`)}
              className="bg-green-600 hover:bg-green-500 font-bold tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.4)]"
            >
              Ver Ranking
            </Button>

            <Button
              onClick={() => clanSlug && navigate(`/${clanSlug}/players`)}
              className="border border-green-500 text-green-400 hover:bg-green-500/10 font-bold tracking-widest"
            >
              Ver Jugadores
            </Button>

          </div>

        </div>

      </section>

      <GlowLine />

      {/* 🔥 MVP */}
      <MVP player={top3[0]} />

      <ClanStats />
      <RecentActivity />
      <ClanProgressChart />

      <GlowLine />

      {/* 🔥 TOP 3 */}
      <section>

        <h2 className="text-2xl md:text-3xl font-black uppercase mb-10 border-l-4 border-green-500 pl-4 italic">
          Mejores Jugadores Históricos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {top3.map((p, i) => (

            <PlayerCard
              key={i}
              place={i === 0 ? "Primer Lugar" : i === 1 ? "Segundo Lugar" : "Tercer Lugar"}
              username={p.player_name || p.name}
              tag={p.player_tag || "#TAG"}
              stats={[
                { label: "Donaciones", value: p.total_donaciones },
                { label: "Guerra", value: p.total_guerra },
                { label: "Viaje", value: p.total_viaje }
              ]}
            />

          ))}

        </div>

      </section>

      <GlowLine />

      {/* 🔥 TOP STATS */}
      <section>

        <h2 className="text-2xl md:text-3xl font-black uppercase mb-10 border-l-4 border-green-500 pl-4 italic">
          Top Rankings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <PlayerCard
            place="TOP Donaciones"
            username={leaders.don?.player_name || leaders.don?.name || "---"}
            tag={leaders.don?.player_tag || "#"}
            stats={[
              { label: "Donaciones", value: leaders.don?.total_donaciones || 0 }
            ]}
          />

          <PlayerCard
            place="TOP Guerra"
            username={leaders.gue?.player_name || leaders.gue?.name || "---"}
            tag={leaders.gue?.player_tag || "#"}
            stats={[
              { label: "Guerra", value: leaders.gue?.total_guerra || 0 }
            ]}
          />

          <PlayerCard
            place="TOP Viaje"
            username={leaders.via?.player_name || leaders.via?.name || "---"}
            tag={leaders.via?.player_tag || "#"}
            stats={[
              { label: "Viaje", value: leaders.via?.total_viaje || 0 }
            ]}
          />

        </div>

      </section>

      <GlowLine />

      {/* 🔥 TABLA */}
      <section>

        <h2 className="text-2xl md:text-3xl font-black uppercase mb-10 border-l-4 border-green-500 pl-4 italic">
          Ranking General
        </h2>

        <RankingTable view="view_ranking_historico" />

      </section>

    </MainLayout>

  );
}