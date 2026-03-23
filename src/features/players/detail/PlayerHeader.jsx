import React from "react";
import { getRankImage } from "../../../utils/ranks";
import RankProgress from "./RankProgress";

export default function PlayerHeader({ player }) {

  if (!player) return null;

  return (

    <div className="relative w-full rounded-2xl border border-green-500/20 bg-black/40 backdrop-blur-xl px-8 py-8 overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.15)]">

      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">

        {/* IZQUIERDA → PROGRESO */}
        <div className="flex justify-center md:justify-start">
          <RankProgress elo={player.elo || 0} />
        </div>

        {/* CENTRO → INFO */}
        <div className="flex flex-col items-center text-center">

          {/* 🔥 LOGO CON DEGRADADO */}
          <div className="relative flex justify-center mb-2">

            <div className="absolute w-24 h-24 bg-gradient-to-b from-green-500/20 to-transparent blur-xl"></div>

            <img
              src={getRankImage(player.rango)}
              alt={player.rango}
              className="relative w-24 h-24 object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]"
            />

          </div>

          <span className="text-xs tracking-widest text-gray-400 font-bold uppercase mb-2">
            {player.rango}
          </span>

          <h1 className="text-4xl md:text-5xl font-black">
            {player.player_name}
          </h1>

          <p className="text-green-400 text-sm mt-1 font-mono tracking-widest">
            {player.player_tag}
          </p>

        </div>

        {/* DERECHA → DECORATIVO */}
        <div className="hidden md:flex justify-end">

          <img
            src={getRankImage(player.rango)}
            alt="rango"
            className="w-60 h-60 object-contain opacity-20 blur-[1px]"
          />

        </div>

      </div>

    </div>

  );

}