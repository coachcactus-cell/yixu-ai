"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FullscreenContextType {
  isFullscreen: boolean;
  setFullscreen: (value: boolean) => void;
}

const FullscreenContext = createContext<FullscreenContextType>({
  isFullscreen: false,
  setFullscreen: () => {},
});

export function FullscreenProvider({ children }: { children: ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <FullscreenContext.Provider value={{ isFullscreen, setFullscreen: setIsFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  );
}

export function useFullscreen() {
  return useContext(FullscreenContext);
}
