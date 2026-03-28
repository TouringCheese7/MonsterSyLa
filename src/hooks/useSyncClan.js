import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useClan } from "../context/ClanContext";
import { supabase } from "../services/supabaseClient";

export default function useSyncClan() {

  const { clanSlug } = useParams();

  const {
    clanId,
    setClanId,
    setClanName,
    setClanSlug
  } = useClan();

  useEffect(() => {

    if (!clanSlug) return;

    async function fetchClan() {

      const cleanSlug = clanSlug.trim().toLowerCase();

      console.log("slug RAW:", clanSlug);
      console.log("slug limpio:", cleanSlug);

      const { data, error } = await supabase
        .from("clans")
        .select("*");

      if (error) {
        console.error("Error cargando clans:", error);
        return;
      }

      console.log("CLANES COMPLETOS:", data);

      // 🔥 BUSCAR EL CLAN CORRECTO
      const clan = data.find(
        c => c.slug?.trim().toLowerCase() === cleanSlug
      );

      if (!clan) {
        console.warn("Clan no encontrado:", cleanSlug);
        return;
      }

      console.log("CLAN ENCONTRADO:", clan);

      // 🔥 SET GLOBAL SOLO SI CAMBIA
      if (clan.id !== clanId) {
        setClanId(clan.id);
        setClanName(clan.clan_name);
        setClanSlug(clan.slug);
      }

    }

    fetchClan();

  }, [clanSlug]);

}