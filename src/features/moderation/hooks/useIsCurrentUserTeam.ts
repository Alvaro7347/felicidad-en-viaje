// Hook de acceso al workspace de moderación.
//
// Distingue explícitamente cinco estados para que la ruta pueda renderizar
// una UI diferenciada. Una falla de red NUNCA se convierte en `not_team`.

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type TeamAccessStatus = "loading" | "unauthenticated" | "not_team" | "team" | "error";

export interface UseIsCurrentUserTeamResult {
  status: TeamAccessStatus;
  retry: () => void;
}

export function useIsCurrentUserTeam(): UseIsCurrentUserTeamResult {
  const [status, setStatus] = useState<TeamAccessStatus>("loading");
  const [nonce, setNonce] = useState(0);

  const retry = useCallback(() => {
    setStatus("loading");
    setNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 1) Verificar sesión (sin considerar fallo de sesión como "not_team").
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (cancelled) return;
      if (userError) {
        setStatus("error");
        return;
      }
      if (!userData?.user) {
        setStatus("unauthenticated");
        return;
      }

      // 2) Verificar rol vía RPC. Un error de red/servidor NO significa "no equipo".
      const { data, error } = await supabase.rpc("is_soundkeleles_team");
      if (cancelled) return;
      if (error) {
        setStatus("error");
        return;
      }
      setStatus(data === true ? "team" : "not_team");
    })();

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return { status, retry };
}
