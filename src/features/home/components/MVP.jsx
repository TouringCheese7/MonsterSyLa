export default function MVP({ player }) {
  if (!player) return null;
  return (
    <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-6 rounded-xl border border-yellow-500/30 mb-10 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
      <h3 className="text-yellow-500 font-black uppercase tracking-widest text-xs mb-2">🏆 MVP Histórico</h3>
      <div className="flex justify-between items-end">
        <p className="text-3xl font-black text-white">{player.player_name}</p>
      </div>
    </div>
  );
}