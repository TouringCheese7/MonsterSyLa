import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-6">

      {/* 🔝 HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">🏠 Home</h1>
        <button className="bg-green-600 px-4 py-2 rounded-xl hover:bg-green-500">
          Cambiar clan
        </button>
      </div>

      {/* 🏆 RANKING DE CLANES */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">🏆 Ranking de Clanes</h2>
        <div className="grid gap-3">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="bg-[#1a1d24] p-4 rounded-xl flex justify-between">
              <span>Clan #{i}</span>
              <span className="text-green-400">---</span>
            </div>
          ))}
        </div>
      </section>

      {/* 🔍 BUSCADOR */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">🔍 Buscar clan</h2>
        <input
          type="text"
          placeholder="Buscar clan..."
          className="w-full p-3 rounded-xl bg-[#1a1d24] outline-none"
        />
      </section>

      {/* ⭐ TOP JUGADORES */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">⭐ Top Jugadores</h2>
        <div className="grid gap-3">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="bg-[#1a1d24] p-4 rounded-xl flex justify-between">
              <span>Jugador #{i}</span>
              <span className="text-yellow-400">ELO ---</span>
            </div>
          ))}
        </div>
      </section>

      {/* 📊 STATS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📊 Estadísticas</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1a1d24] p-4 rounded-xl">
            Total jugadores: ---
          </div>
          <div className="bg-[#1a1d24] p-4 rounded-xl">
            Total clanes: ---
          </div>
        </div>
      </section>

    </div>
  );
}