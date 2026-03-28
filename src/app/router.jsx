import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Home from "../features/home/Home";
import RankingPage from "../features/ranking/pages/RankingPage";
import PlayersPage from "../features/players/PlayersPage";
import PlayerDetail from "../features/players/PlayerDetail";

// Buscador
import GlobalSearch from "../components/GlobalSearch";

// Hooks
import useSyncClan from "../hooks/useSyncClan";
import { useClan } from "../context/ClanContext";

/* 🔥 WRAPPER MULTICLAN */
function ClanWrapper({ children }) {

  useSyncClan();

  const { clanId } = useClan();

  // 🧠 EVITA PANTALLA BLANCA
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

        {/* 🔥 RUTAS MULTICLAN */}
        <Route 
          path="/:clanSlug" 
          element={
            <ClanWrapper>
              <Home />
            </ClanWrapper>
          } 
        />

        <Route 
          path="/:clanSlug/ranking" 
          element={
            <ClanWrapper>
              <RankingPage />
            </ClanWrapper>
          } 
        />

        <Route 
          path="/:clanSlug/players" 
          element={
            <ClanWrapper>
              <PlayersPage />
            </ClanWrapper>
          } 
        />

        <Route 
          path="/:clanSlug/players/:tag" 
          element={
            <ClanWrapper>
              <PlayerDetail />
            </ClanWrapper>
          } 
        />

      </Routes>

    </Router>

  );
}