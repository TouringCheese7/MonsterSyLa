import MainLayout from "../../../layouts/MainLayout";
import GlowLine from "../../../components/GlowLine";

import TopRecords from "../components/TopRecords";
import PlayerComparisonContainer from "../components/PlayerComparisonContainer";

export default function StatsPage() {

  return (

    <MainLayout>

      {/* 🔥 HERO */}
      <section className="relative text-center py-14 px-4">

        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-transparent blur-3xl opacity-40"></div>

        <div className="relative z-10">

          <h1 className="text-4xl md:text-6xl font-black text-green-500 tracking-widest uppercase">
            Estadísticas del Clan
          </h1>

          <p className="text-gray-400 mt-4 text-xs tracking-widest uppercase">
            Métricas competitivas y comparativas del clan
          </p>

        </div>

      </section>

      <GlowLine />

      {/* 🔥 TOP RECORDS */}
      <section className="px-4 md:px-8 py-10">

        <TopRecords />

      </section>

      <GlowLine />

      {/* ⚔️ COMPARADOR */}
      <section className="px-4 md:px-8 py-10">

        <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 border-l-4 border-green-500 pl-4 italic">
          Comparador de Jugadores
        </h2>

        <PlayerComparisonContainer />

      </section>

      <GlowLine />

    </MainLayout>

  );
}