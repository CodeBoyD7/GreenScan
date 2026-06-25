import React, { createContext, useContext, type ReactNode } from "react";

interface OfflineCtx {
  isOnline: boolean;
}

const OfflineContext = createContext<OfflineCtx>({ isOnline: true });

export function OfflineProvider({ children }: { children: ReactNode }) {
  return (
    <OfflineContext.Provider value={{ isOnline: true }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  return useContext(OfflineContext);
}
