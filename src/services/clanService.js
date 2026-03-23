import { supabase } from "./supabaseClient";

/* 🔥 TOP 3 */
export async function getTop3Players(clanId) {
  const { data, error } = await supabase
    .from("view_ranking_historico")
    .select("*")
    .eq("clan_id", clanId)
    .order("score_total", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error top3:", error);
    return [];
  }

  return data;
}

/* 🔥 DONACIONES */
export async function getTopDonations(clanId) {
  const { data } = await supabase
    .from("view_ranking_historico")
    .select("*")
    .eq("clan_id", clanId)
    .order("total_donaciones", { ascending: false })
    .limit(1);

  return data?.[0] || null;
}

/* 🔥 GUERRA */
export async function getTopWar(clanId) {
  const { data } = await supabase
    .from("view_ranking_historico")
    .select("*")
    .eq("clan_id", clanId)
    .order("total_guerra", { ascending: false })
    .limit(1);

  return data?.[0] || null;
}

/* 🔥 VIAJE */
export async function getTopTravel(clanId) {
  const { data } = await supabase
    .from("view_ranking_historico")
    .select("*")
    .eq("clan_id", clanId)
    .order("total_viaje", { ascending: false })
    .limit(1);

  return data?.[0] || null;
}

/* 🔥 RANKING */
export async function getRanking(view, order, clanId = 1) {

  const { data, error } = await supabase
    .from(view)
    .select("*")
    .eq("clan_id", clanId)
    .order("score_total", { ascending: order === "asc" });

  if (error) {
    console.error("Error ranking:", error);
    return [];
  }

  return data;
}