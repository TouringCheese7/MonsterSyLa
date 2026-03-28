import { createContext, useContext, useState, useEffect } from "react";

const ClanContext = createContext();

export function ClanProvider({ children }) {

  const [clanId, setClanId] = useState(null);
  const [clanName, setClanName] = useState("");
  const [clanSlug, setClanSlug] = useState(""); // 🔥 ESTA LÍNEA FALTABA

  /* 🔥 CARGAR AL INICIO */
  useEffect(() => {

    const savedClanId = localStorage.getItem("clanId");
    const savedClanName = localStorage.getItem("clanName");
    const savedClanSlug = localStorage.getItem("clanSlug"); // 🔥

    if (savedClanId) setClanId(parseInt(savedClanId));
    if (savedClanName) setClanName(savedClanName);
    if (savedClanSlug) setClanSlug(savedClanSlug); // 🔥

  }, []);

  /* 🔥 GUARDAR */
  useEffect(() => {

    if (clanId) localStorage.setItem("clanId", clanId);
    if (clanName) localStorage.setItem("clanName", clanName);
    if (clanSlug) localStorage.setItem("clanSlug", clanSlug); // 🔥

  }, [clanId, clanName, clanSlug]);

  return (
    <ClanContext.Provider value={{
      clanId,
      setClanId,
      clanName,
      setClanName,
      clanSlug,        // 🔥 EXPORTAR
      setClanSlug      // 🔥 EXPORTAR
    }}>
      {children}
    </ClanContext.Provider>
  );
}

export function useClan() {
  return useContext(ClanContext);
}