import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 🔥 PÁGINAS
import Home from "../features/home/Home";
import RankingPage from "../features/ranking/pages/RankingPage";
import PlayersPage from "../features/players/PlayersPage";
import PlayerDetail from "../features/players/PlayerDetail";

// 🔥 NUEVA PÁGINA (ESTADÍSTICAS)
import StatsPage from "../features/stats/pages/StatsPage";

// 🔥 COMPONENTES
import GlobalSearch from "../components/GlobalSearch";

// 🔥 HOOKS
import useSyncClan from "../hooks/useSyncClan";
import { useClan } from "../context/ClanContext";

/* 🔥 WRAPPER MULTICLAN */
function ClanWrapper({ children }) {

  useSyncClan();

  const { clanId } = useClan();

  if (!clanId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-green-400">
        Cargando clan...
      </div>
    );
  }

  return children;
}

export default function AppRouter() {

  return (

    <Router>

      <GlobalSearch />

      <Routes>

        {/* 🔥 REDIRECCIÓN INICIAL */}
        <Route path="/" element={<Navigate to="/mexyssyla" />} />

        {/* 🔥 HOME */}
        <Route 
          path="/:clanSlug" 
          element={
            <ClanWrapper>
              <Home />
            </ClanWrapper>
          } 
        />

        {/* 🔥 RANKING */}
        <Route 
          path="/:clanSlug/ranking" 
          element={
            <ClanWrapper>
              <RankingPage />
            </ClanWrapper>
          } 
        />

        {/* 🔥 PLAYERS */}
        <Route 
          path="/:clanSlug/players" 
          element={
            <ClanWrapper>
              <PlayersPage />
            </ClanWrapper>
          } 
        />

        {/* 🔥 PLAYER DETAIL */}
        <Route 
          path="/:clanSlug/players/:tag" 
          element={
            <ClanWrapper>
              <PlayerDetail />
            </ClanWrapper>
          } 
        />

        {/* 🔥🔥🔥 NUEVA RUTA ESTADÍSTICAS */}
        <Route 
          path="/:clanSlug/stats" 
          element={
            <ClanWrapper>
              <StatsPage />
            </ClanWrapper>
          } 
        />

      </Routes>

    </Router>

  );
}