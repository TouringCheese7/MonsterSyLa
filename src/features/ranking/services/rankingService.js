import { supabase } from "../../../services/supabaseClient";

/* ---------------------------
🏆 ELO
--------------------------- */
export async function getEloRanking(clanId) {

  const { data: elo } = await supabase
    .from("view_ranking_elo")
    .select("*")
    .eq("clan_id", clanId)
    .order("elo", { ascending: false });

  const { data: cambios } = await supabase
    .from("view_ranking_change")
    .select("*")
    .eq("clan_id", clanId);

  const cambiosMap = {};
  cambios?.forEach(c => {
    cambiosMap[c.player_tag] = c.cambio;
  });

  return elo?.map(d => ({
    name: d.player_name,
    player_tag: d.player_tag,
    activo: d.activo,
    value: d.elo,
    rango: d.rango,
    cambio: cambiosMap[d.player_tag] ?? 0
  })) || [];

}