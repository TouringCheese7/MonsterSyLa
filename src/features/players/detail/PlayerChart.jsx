import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function PlayerChart({ history }) {

  const [range, setRange] = useState("12w");
  const [mode, setMode] = useState("war");

  /* 🔥 FILTRO SIMPLE Y QUE SÍ FUNCIONA */
  function filterHistory(data) {
    if (!data) return [];

    switch (range) {
      case "4s":
        return data.slice(-4);
      case "12s":
        return data.slice(-12);
      case "6m":
        return data.slice(-24);
      case "all":
      default:
        return data;
    }
  }

  const filtered = filterHistory(history || []);

  return (
    <div className="bg-[#050505] p-6 rounded-3xl">

      <h3 className="text-green-500 mb-4">Historial</h3>

      {/* CONTROLES */}
      <div className="flex justify-between mb-4 flex-wrap gap-2">

        {/* RANGO */}
        <div className="flex gap-2">
          {["4s", "12s", "6m", "all"].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2 py-1 rounded text-sm ${
                range === r
                  ? "bg-green-500 text-black"
                  : "bg-zinc-800 text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* MODO */}
        <div className="flex gap-2">
          {["gue", "don", "total"].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2 py-1 rounded text-sm ${
                mode === m
                  ? "text-green-400"
                  : "text-zinc-500"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={filtered}>
          <CartesianGrid stroke="#1f1f1f" />

          <XAxis
            dataKey="date"
            stroke="#aaa"
            tickFormatter={(value) => {
              const d = new Date(value);
              return isNaN(d)
                ? ""
                : d.toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short"
                  });
            }}
          />

          <YAxis stroke="#aaa" />
          <Tooltip />

          {/* 🔥 TOTAL */}
          {mode === "total" ? (
            <>
              <Line
                type="monotone"
                dataKey="gue"
                stroke="#ef4444"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="don"
                stroke="#22c55e"
                strokeWidth={2}
              />
            </>
          ) : (
            <Line
              type="monotone"
              dataKey={mode} // 🔥 FIX CLAVE
              stroke={mode === "war" ? "#ef4444" : "#22c55e"}
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          )}

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}