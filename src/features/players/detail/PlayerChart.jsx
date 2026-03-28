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

  return (
    <div className="bg-[#050505] p-8 rounded-3xl">

      <h3 className="text-green-500 mb-24">
        Historial
      </h3>

      <ResponsiveContainer width="100%" height={250}>

        <LineChart data={history}>

          <CartesianGrid stroke="#1f1f1f" />

          <XAxis dataKey="date" stroke="#aaa" />
          <YAxis stroke="#aaa" />

          <Tooltip />

          <Line dataKey="don" stroke="#22c55e" strokeWidth={3} />
          <Line dataKey="war" stroke="#ef4444" strokeWidth={3} />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}