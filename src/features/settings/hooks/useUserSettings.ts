/**
 * Bootstrap + mutaciones del Centro de Ajustes.
 * Fuente única de verdad para settings + profile + subscriptions en la sesión.
 */

import { useCallback, useEffect, useState } from "react";
import {
  settingsRepository,
  type SettingsBootstrap,
} from "../services/settingsRepository";
import { applyTheme, watchSystemTheme, type ThemePreference } from "../utils/theme";

interface State {
  loading: boolean;
  error: string | null;
  data: SettingsBootstrap | null;
}

export function useUserSettings() {
  const [state, setState] = useState<State>({ loading: true, error: null, data: null });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await settingsRepository.bootstrap();
      setState({ loading: false, error: null, data });
      const pref = (data.settings.theme ?? "system") as ThemePreference;
      applyTheme(pref);
    } catch (e) {
      setState({ loading: false, error: (e as Error).message, data: null });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await settingsRepository.bootstrap();
        if (cancelled) return;
        setState({ loading: false, error: null, data });
        const pref = (data.settings.theme ?? "system") as ThemePreference;
        applyTheme(pref);
      } catch (e) {
        if (cancelled) return;
        setState({ loading: false, error: (e as Error).message, data: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return watchSystemTheme(
      () => (state.data?.settings.theme ?? "system") as ThemePreference,
    );
  }, [state.data?.settings.theme]);

  const patchSettings = useCallback(
    async (
      patch: Partial<{
        theme: ThemePreference;
        notifications_enabled: boolean;
        weekly_report_enabled: boolean;
        inactivity_reminders_enabled: boolean;
        important_notices_enabled: boolean;
        timezone: string;
      }>,
    ) => {
      // Optimista.
      setState((s) =>
        s.data
          ? { ...s, data: { ...s.data, settings: { ...s.data.settings, ...patch } } }
          : s,
      );
      try {
        const updated = await settingsRepository.updateSettings({ data: patch } as never);
        setState((s) => (s.data ? { ...s, data: { ...s.data, settings: updated } } : s));
        if (patch.theme) applyTheme(patch.theme);
      } catch (e) {
        await refresh(); // revertir con recarga
        throw e;
      }
    },
    [refresh],
  );

  const setName = useCallback(
    async (name: string) => {
      await settingsRepository.updateName(name);
      setState((s) =>
        s.data && s.data.profile
          ? { ...s, data: { ...s.data, profile: { ...s.data.profile, name } } }
          : s,
      );
    },
    [],
  );

  const setAvatarPath = useCallback(async (path: string | null) => {
    const res = await settingsRepository.setAvatarPath(path);
    setState((s) =>
      s.data
        ? { ...s, data: { ...s.data, settings: { ...s.data.settings, avatar_path: res.path } } }
        : s,
    );
  }, []);

  return {
    ...state,
    refresh,
    patchSettings,
    setName,
    setAvatarPath,
  };
}
