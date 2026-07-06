import { createContext, useContext, type ReactNode } from "react";
import { useMvp1Progress } from "../hooks/useMvp1Progress";

type Mvp1ProgressContextValue = ReturnType<typeof useMvp1Progress>;

const Mvp1ProgressContext = createContext<Mvp1ProgressContextValue | null>(null);

export function Mvp1ProgressProvider({ children }: { children: ReactNode }) {
  const progress = useMvp1Progress();

  return (
    <Mvp1ProgressContext.Provider value={progress}>
      {children}
    </Mvp1ProgressContext.Provider>
  );
}

export function useMvp1ProgressContext() {
  const progress = useContext(Mvp1ProgressContext);
  if (!progress) {
    throw new Error("useMvp1ProgressContext debe usarse dentro de Mvp1ProgressProvider.");
  }
  return progress;
}