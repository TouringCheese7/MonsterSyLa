import { supabase } from "./supabaseClient";

/* =========================
   🏆 TOP 3 HISTÓRICO
========================= */
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

  return data || [];
}

/* =========================
   🎁 TOP DONACIONES
========================= */
export async function getTopDonations(clanId) {
  const { data, error } = await supabase
    .from("view_ranking_historico")
    .select("*")
    .eq("clan_id", clanId)
    .order("total_donaciones", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error donations:", error);
    return null;
  }

  return data?.[0] || null;
}

/* =========================
   ⚔️ TOP GUERRA
========================= */
export async function getTopWar(clanId) {
  const { data, error } = await supabase
    .from("view_ranking_historico")
    .select("*")
    .eq("clan_id", clanId)
    .order("total_guerra", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error war:", error);
    return null;
  }

  return data?.[0] || null;
}

/* =========================
   🚀 TOP VIAJE
========================= */
export async function getTopTravel(clanId) {
  const { data, error } = await supabase
    .from("view_ranking_historico")
    .select("*")
    .eq("clan_id", clanId)
    .order("total_viaje", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error travel:", error);
    return null;
  }

  return data?.[0] || null;
}

/* =========================
   📊 RANKING DINÁMICO
========================= */
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

  return data || [];
}

/* =========================
   🔥 TOP RECORDS (SEMANAL HISTÓRICO)
========================= */
export async function getTopRecords(clanId, category) {
  const { data, error } = await supabase
    .from("view_top10_records")
    .select("*")
    .eq("clan_id", clanId)
    .eq("category", category)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error top records:", error);
    return [];
  }

  return data || [];
}

/* =========================
   ⚔️ COMPARADOR DE JUGADORES (FIX)
========================= */
/*
IMPORTANTE:
Antes usabas .in("id", playerIds)
pero tú manejas player_tag → así que lo corregimos
*/
export async function getComparePlayers(clanId, playerTags) {
  const { data, error } = await supabase
    .from("view_player_stats")
    .select("*")
    .eq("clan_id", clanId)
    .in("player_tag", playerTags);

  if (error) {
    console.error("Error compare:", error);
    return [];
  }

  return data || [];
}

/* =========================
   🔥 RIVALIDADES
========================= */
export async function getRivalries(clanId) {
  const { data, error } = await supabase
    .from("view_rivalries")
    .select(`
      *,
      player_a:players!view_rivalries_player_a_fkey(name, player_tag),
      player_b:players!view_rivalries_player_b_fkey(name, player_tag)
    `)
    .eq("clan_id", clanId)
    .order("weeks_together", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error rivalries:", error);
    return [];
  }

  return data || [];
}