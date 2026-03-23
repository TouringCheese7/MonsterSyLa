import { useEffect, useState } from "react";
import {
  getEloRanking,
  getDonacionesRanking,
  getGuerraRanking,
  getViajeRanking,
  getHistorial
} from "../services/rankingService";

export function useRankingData(filter, clanId) {

  const [data, setData] = useState({
    elo: [],
    don: [],
    gue: [],
    via: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchAll() {

      setLoading(true);

      try {

        const elo = await getEloRanking(clanId);

        let don = [], gue = [], via = [];

        if (filter === "ult_4_semanas") {

          const res = await getHistorial(clanId);

          don = res.don;
          gue = res.gue;
          via = res.via;

        } else {

          [don, gue, via] = await Promise.all([
            getDonacionesRanking(filter, clanId),
            getGuerraRanking(filter, clanId),
            getViajeRanking(filter, clanId)
          ]);

        }

        setData({ elo, don, gue, via });

      } catch (err) {
        console.error("Ranking error:", err);
      }

      setLoading(false);

    }

    if (clanId) fetchAll();

  }, [filter, clanId]);

  return { data, loading };

}