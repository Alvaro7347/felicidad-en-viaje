const LS_KEYS = {
  motivation: "archipielago_user_motivation",
  emotions: "archipielago_user_emotions",
  fuelPhrase: "archipielago_user_fuel_phrase",
  lastVisit: "archipielago_last_visit_at",
} as const;

export type MusicalFuel = {
  motivation: string | null;
  emotions: string[];
  fuelPhrase: string | null;
};

function read(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(key);
    return v && v.trim() ? v : null;
  } catch {
    return null;
  }
}

export function getMusicalFuel(): MusicalFuel {
  const motivation = read(LS_KEYS.motivation);
  const fuelPhrase = read(LS_KEYS.fuelPhrase);
  const emotionsRaw = read(LS_KEYS.emotions);
  let emotions: string[] = [];
  if (emotionsRaw) {
    try {
      const parsed = JSON.parse(emotionsRaw);
      if (Array.isArray(parsed)) emotions = parsed.filter((x) => typeof x === "string");
    } catch {}
  }
  return { motivation, emotions, fuelPhrase };
}

export function hasMusicalFuel(): boolean {
  return Boolean(getMusicalFuel().fuelPhrase);
}

/**
 * Returns days since last visit BEFORE updating the stored timestamp.
 * Then updates the "last visit" marker. First-ever call returns null.
 */
export function touchLastVisit(): number | null {
  if (typeof window === "undefined") return null;
  let days: number | null = null;
  try {
    const prev = window.localStorage.getItem(LS_KEYS.lastVisit);
    if (prev) {
      const prevDate = new Date(prev).getTime();
      if (!Number.isNaN(prevDate)) {
        days = Math.floor((Date.now() - prevDate) / (1000 * 60 * 60 * 24));
      }
    }
    window.localStorage.setItem(LS_KEYS.lastVisit, new Date().toISOString());
  } catch {}
  return days;
}
