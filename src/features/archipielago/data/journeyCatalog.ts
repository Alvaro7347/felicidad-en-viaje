// Catálogo central del viaje (Commit 1 del saneamiento estructural).
//
// Único origen de verdad para:
// - ISLAND_ORDER
// - ISLAND_TITLES
// - SCREEN_TO_ISLAND
// - ISLAND_TO_ISLAND_SCREEN
// - ISLAND_TO_LESSON_SCREEN
//
// Este archivo NO cambia comportamiento visible. Solo elimina duplicaciones
// entre AppHeader y SelfJourneyDashboardScreen. No mueve ROUTE_STAGES,
// START_PORT_NODES ni STAGE_TO_ISLAND (siguen en data/islands.ts).

import type { Screen } from "../types";
import type { IslandId } from "./mvp1Progress";

export const ISLAND_ORDER: IslandId[] = [
  "start-port",
  "first-melodies",
  "pulse",
  "rhythm",
  "music",
  "joy",
  "chords",
  "strumming",
  "songs",
];

export const ISLAND_TITLES: Record<IslandId, string> = {
  "start-port": "Puerto de Inicio",
  "first-melodies": "Isla de Primeras Melodías",
  pulse: "Isla del Pulso",
  rhythm: "Isla del Ritmo",
  music: "Isla Musical",
  joy: "Isla de la Alegría",
  chords: "Isla de los Acordes",
  strumming: "Isla del Rasgueo",
  songs: "Isla de las Canciones",
};

// Pantalla actual → isla a la que pertenece (usado por AppHeader para calcular
// el título y el porcentaje que se muestran en la barra superior).
export const SCREEN_TO_ISLAND: Partial<Record<Screen, IslandId>> = {
  route: "start-port",
  mission: "start-port",
  "mission-guide": "start-port",
  "mission-two": "start-port",
  "mission-three": "start-port",
  "mission-four": "start-port",
  "mission-six": "start-port",
  "mission-seven": "start-port",
  "mission-eight": "start-port",
  "mission-nine": "start-port",
  celebration: "start-port",
  "first-melodies-island": "first-melodies",
  "first-melodies-lesson": "first-melodies",
  "pulse-island": "pulse",
  "pulse-lesson": "pulse",
  "rhythm-island": "rhythm",
  "rhythm-lesson": "rhythm",
  "music-island": "music",
  "music-lesson": "music",
  "joy-island": "joy",
  "joy-lesson": "joy",
  "chords-island": "chords",
  "chords-lesson": "chords",
  "strumming-island": "strumming",
  "strumming-lesson": "strumming",
  "songs-island": "songs",
  "songs-lesson": "songs",
};

// Isla → pantalla de la propia isla (índice/portada de la isla).
export const ISLAND_TO_ISLAND_SCREEN: Record<IslandId, Screen> = {
  "start-port": "route",
  "first-melodies": "first-melodies-island",
  pulse: "pulse-island",
  rhythm: "rhythm-island",
  music: "music-island",
  joy: "joy-island",
  chords: "chords-island",
  strumming: "strumming-island",
  songs: "songs-island",
};

// Isla → pantalla de lección genérica de esa isla.
// Para "start-port" no existe una pantalla de lección genérica (cada nodo
// n1..n9 abre su propio screen de misión), por eso se mapea a "route".
export const ISLAND_TO_LESSON_SCREEN: Record<IslandId, Screen> = {
  "start-port": "route",
  "first-melodies": "first-melodies-lesson",
  pulse: "pulse-lesson",
  rhythm: "rhythm-lesson",
  music: "music-lesson",
  joy: "joy-lesson",
  chords: "chords-lesson",
  strumming: "strumming-lesson",
  songs: "songs-lesson",
};
