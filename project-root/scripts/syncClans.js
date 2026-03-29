import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// 🔐 ENV
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const headers = {
  Authorization: `Bearer ${process.env.CR_API_KEY}`,
};

// 🔥 FUNCIÓN PRINCIPAL POR CLAN
async function sincronizarClan(clan, modo) {
  const CLAN_TAG = clan.clan_tag.replace('#', '');
  const CLAN_ID = clan.id;

  try {
    console.log(`\n--- 🛡️ Clan ${CLAN_TAG} | ${modo.toUpperCase()} ---`);

    // =========================
    // 🟡 DOMINGO → SNAPSHOTS
    // =========================
    if (modo === 'domingo') {
      const res = await axios.get(
        `https://proxy.royaleapi.dev/v1/clans/%23${CLAN_TAG}/members`,
        { headers }
      );

      const ahora = new Date();
      const fechaTruncada = `${ahora.toISOString().split('T')[0]}T06:00:00`;

      console.log(`📅 Fecha snapshot: ${fechaTruncada}`);

      for (const m of res.data.items) {
        // 🔥 UPSERT PLAYER (GLOBAL)
        const { data: player, error: playerError } = await supabase
          .from('players')
          .upsert(
            {
              player_tag: m.tag,
              name: m.name,
            },
            { onConflict: 'player_tag' }
          )
          .select()
          .single();

        if (playerError) {
          console.error(`❌ Player error ${m.name}:`, playerError.message);
          continue;
        }

        // 🔥 UPSERT SNAPSHOT (MULTICLAN REAL)
        const { error: snapError } = await supabase
          .from('snapshots')
          .upsert(
            {
              player_id: player.id,
              clan_id: CLAN_ID,
              date: fechaTruncada,
              donations: m.donations,
              donations_received: m.donationsReceived,
              trophies: m.trophies,
              war_points: 0,
            },
            {
              onConflict: 'player_id,clan_id,date',
            }
          );

        if (snapError) {
          console.error(`❌ Snapshot error ${m.name}:`, snapError.message);
        } else {
          console.log(`✅ ${m.name} guardado`);
        }
      }

      console.log('✅ Domingo completado');
    }

    // =========================
    // 🔵 LUNES → GUERRA
    // =========================
    else if (modo === 'lunes') {
      const { data: lastSnapshot, error } = await supabase
        .from('snapshots')
        .select('date')
        .eq('clan_id', CLAN_ID) // 🔥 CRÍTICO
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error || !lastSnapshot) {
        console.error(`❌ No hay snapshot previo para clan ${CLAN_TAG}`);
        return;
      }

      const fechaObjetivo = lastSnapshot.date;
      console.log(`🔍 Actualizando guerra para: ${fechaObjetivo}`);

      const res = await axios.get(
        `https://proxy.royaleapi.dev/v1/clans/%23${CLAN_TAG}/riverracelog`,
        { headers }
      );

      const ultimaGuerra = res.data.items[0];

      const standing = ultimaGuerra.standings.find(
        (s) => s.clan.tag.replace('#', '') === CLAN_TAG
      );

      if (!standing) {
        console.log(`⚠️ Clan no encontrado en river race`);
        return;
      }

      for (const p of standing.clan.participants) {
        const { data: player } = await supabase
          .from('players')
          .select('id')
          .eq('player_tag', p.tag)
          .single();

        if (!player) continue;

        const { error: updateError } = await supabase
          .from('snapshots')
          .update({ war_points: p.fame })
          .eq('player_id', player.id)
          .eq('clan_id', CLAN_ID) // 🔥 CRÍTICO
          .eq('date', fechaObjetivo);

        if (updateError) {
          console.error(`❌ Error guerra ${p.name}:`, updateError.message);
        } else {
          console.log(`⚔️ ${p.name}: ${p.fame} pts`);
        }
      }

      console.log('✅ Lunes completado');
    }
  } catch (err) {
    console.error(`❌ Error en clan ${CLAN_TAG}:`, err.message);
  }
}

// =========================
// 🚀 MAIN MULTICLAN
// =========================
async function main() {
  const modo = process.argv[2];

  if (!['domingo', 'lunes'].includes(modo)) {
    console.log('Uso: node syncClans.js [domingo|lunes]');
    return;
  }

  console.log('\n🚀 INICIANDO SINCRONIZACIÓN MULTICLAN\n');

  const { data: clans, error } = await supabase
    .from('clans')
    .select('id, clan_tag');

  if (error || !clans) {
    console.error('❌ Error obteniendo clanes:', error?.message);
    return;
  }

  console.log(`📦 Clanes encontrados: ${clans.length}`);

  // 🔥 SECUENCIAL (SEGURIDAD)
  for (const clan of clans) {
    await sincronizarClan(clan, modo);
  }

  // ⚡ OPCIONAL (PARALELO)
  // await Promise.all(clans.map(c => sincronizarClan(c, modo)));

  console.log('\n🎉 SINCRONIZACIÓN COMPLETA\n');
}

main();