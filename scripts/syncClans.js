import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// =========================
// 🔐 VALIDACIÓN ENV
// =========================
if (
  !process.env.SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  !process.env.CR_API_KEY
) {
  console.error('❌ Faltan variables de entorno (.env)');
  process.exit(1);
}

// =========================
// 🔌 CLIENTES
// =========================
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const headers = {
  Authorization: `Bearer ${process.env.CR_API_KEY}`,
};

// =========================
// 🔥 FUNCIÓN PRINCIPAL
// =========================
async function sincronizarClan(clan, modo) {
  const CLAN_TAG = clan.clan_tag.replace('#', '');
  const CLAN_ID = clan.id;

  try {
    console.log(`\n🛡️ Clan ${CLAN_TAG} | ${modo.toUpperCase()}`);

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

      console.log(`📅 Snapshot: ${fechaTruncada}`);

      // 🔥 UPSERT MASIVO PLAYERS
      const playersData = res.data.items.map(m => ({
        player_tag: m.tag,
        name: m.name,
      }));

      const { data: players, error: playersError } = await supabase
        .from('players')
        .upsert(playersData, { onConflict: 'player_tag' })
        .select();

      if (playersError) {
        console.error('❌ Error players:', playersError.message);
        return;
      }

      // 🔥 MAPA TAG → ID
      const playerMap = {};
      players.forEach(p => {
        playerMap[p.player_tag] = p.id;
      });

      // 🔥 SNAPSHOTS MASIVOS
      const snapshotsData = res.data.items.map(m => ({
        player_id: playerMap[m.tag],
        clan_id: CLAN_ID,
        date: fechaTruncada,
        donations: m.donations,
        donations_received: m.donationsReceived,
        trophies: m.trophies,
        war_points: 0,
      }));

      const { error: snapError } = await supabase
        .from('snapshots')
        .upsert(snapshotsData, {
          onConflict: 'player_id,clan_id,date',
        });

      if (snapError) {
        console.error('❌ Error snapshots:', snapError.message);
      } else {
        console.log(`✔ ${snapshotsData.length} jugadores guardados`);
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
        .eq('clan_id', CLAN_ID)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error || !lastSnapshot) {
        console.error(`❌ No hay snapshot para ${CLAN_TAG}`);
        return;
      }

      const fechaObjetivo = lastSnapshot.date;
      console.log(`🔍 Actualizando guerra: ${fechaObjetivo}`);

      const res = await axios.get(
        `https://proxy.royaleapi.dev/v1/clans/%23${CLAN_TAG}/riverracelog`,
        { headers }
      );

      const ultimaGuerra = res.data.items[0];

      const standing = ultimaGuerra.standings.find(
        s => s.clan.tag.replace('#', '') === CLAN_TAG
      );

      if (!standing) {
        console.log('⚠️ Clan no encontrado en guerra');
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
          .eq('clan_id', CLAN_ID)
          .eq('date', fechaObjetivo);

        if (updateError) {
          console.error(`❌ ${p.name}: ${updateError.message}`);
        } else {
          console.log(`⚔️ ${p.name}: ${p.fame}`);
        }
      }

      console.log('✅ Lunes completado');
    }

  } catch (err) {
    console.error(`❌ Error clan ${CLAN_TAG}:`, err.message);
  }
}

// =========================
// 🚀 MAIN
// =========================
async function main() {
  const modo = process.argv[2];

  if (!['domingo', 'lunes'].includes(modo)) {
    console.log('Uso: node syncClans.js [domingo|lunes]');
    return;
  }

  console.log('\n🚀 SINCRONIZACIÓN MULTICLAN\n');

  const { data: clans, error } = await supabase
    .from('clans')
    .select('id, clan_tag');

  if (error || !clans) {
    console.error('❌ Error clanes:', error?.message);
    return;
  }

  console.log(`📦 Clanes: ${clans.length}`);

  for (const clan of clans) {
    await sincronizarClan(clan, modo);
  }

  console.log('\n🎉 COMPLETADO\n');
}

main();