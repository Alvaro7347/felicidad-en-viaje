
# Auditoría y refactor de `ArchipelagoApp.tsx`

## Diagnóstico

Hoy todo el MVP vive en **un único archivo de 2.153 líneas** (`src/components/ArchipelagoApp.tsx`). Contiene:

- Tokens de marca (`B`, `PHOTOS`)
- Datos estáticos (`ROUTES`, `SILENCE_NODES`, `ISLANDS`, `EMOTIONS`, `DIAG_QUESTIONS`)
- Tipos (`Screen`, `NodeStatus`, `RouteNode`, `DiagQuestion`, `DiagAnswers`)
- 4 primitivos UI (`Btn`, `Card`, `Tag`, `BackBtn`)
- Layout (`AppHeader`, `SplashScreen`, `DevNav`)
- 11 pantallas (`Welcome`, `Onboarding`, `Diagnosis`, `DiagnosisResult`, `EntryMoment`, `Route`, `Mission`, `MissionTwo/Three/Four`, `MissionGuide`, `Celebration`)
- El componente raíz `ArchipelagoApp` con máquina de estados

Problemas concretos detectados ("Frankenstein"):

1. **Duplicaciones**
   - `onboardingFlow` (línea 2060) repite `ONBOARDING_SCREENS` (línea 271). Se usa el local en vez de la constante.
   - Import doble de líneas en blanco al principio (línea 2 y 3 vacías).
   - `Card` local (línea 233) colisiona conceptualmente con `@/components/ui/card` (aunque no está importado, confunde).
   - Routing de `onReviewMission` en línea 2115 es un ternario anidado de 3 niveles: mapa `id → screen` implícito y frágil.
2. **Variables/estados que estorban**
   - `route = useMemo(() => ROUTES[0], [])` nunca se usa (línea 2057).
   - `completedMission` gatea `celebration` (línea 2147) pero `devJump` lo fuerza a `true` (línea 2064): la guarda es efectivamente muerta.
   - `DEV_SCREENS` + `DevNav` es un panel de desarrollo visible en producción.
3. **Estilos inline masivos** — cada pantalla repite paletas y sombras a mano, sin usar los tokens (`B`) de forma consistente. No hay `styles.css` variables ni Tailwind, todo es `style={{}}`.
4. **Estructura plana** — imposible encontrar una pantalla sin `grep`. El file-tree no refleja el flujo del producto.

Nada de esto rompe la UX validada; sí bloquea que "un programador promedio la entienda sin dificultades".

## Objetivo

Reorganizar el código **sin cambiar ni un pixel de la experiencia validada**. Mismos textos, mismos flujos, misma paleta, mismas fotos.

## Cambios propuestos

### 1. Nueva estructura de carpetas

```text
src/features/archipielago/
  ArchipelagoApp.tsx          ← raíz, solo máquina de estados + routing
  types.ts                    ← Screen, NodeStatus, RouteNode, DiagQuestion, DiagAnswers
  data/
    brand.ts                  ← B, PHOTOS
    routes.ts                 ← ROUTES
    islands.ts                ← ISLANDS, SILENCE_NODES
    emotions.ts               ← EMOTIONS
    diagnosis.ts              ← DIAG_QUESTIONS
  components/
    Btn.tsx
    Card.tsx
    Tag.tsx
    BackBtn.tsx
    AppHeader.tsx
    SplashScreen.tsx
  screens/
    WelcomeScreen.tsx
    OnboardingScreen.tsx
    DiagnosisScreen.tsx
    DiagnosisResultScreen.tsx
    EntryMomentScreen.tsx
    RouteScreen.tsx
    MissionScreen.tsx
    MissionTwoScreen.tsx
    MissionThreeScreen.tsx
    MissionFourScreen.tsx
    MissionGuideScreen.tsx
    CelebrationScreen.tsx
```

`src/components/ArchipelagoApp.tsx` pasa a ser un re-export de una línea para no romper la ruta `/`.

### 2. Limpieza de duplicados y muertos

- Eliminar `onboardingFlow` local y usar `ONBOARDING_SCREENS`.
- Eliminar `route = useMemo(...)` (nunca leído).
- Eliminar la guarda `completedMission` sobre `celebration` (ya se setea antes de navegar) → simplifica la lógica.
- Reemplazar el ternario anidado de `onReviewMission` por un mapa `Record<string, Screen>` legible.
- Quitar líneas en blanco dobles al inicio.

### 3. `DevNav`

Envolver su render en `if (import.meta.env.DEV)` para que **no aparezca en producción publicada** pero siga disponible en preview de Lovable. Mantiene la utilidad, elimina el ruido visual en el sitio final.

### 4. Tipado del routing

Introducir un mapa `SCREEN_TO_COMPONENT` no — mantendría legibilidad menor. En su lugar, dejar el `switch/return` explícito en `ArchipelagoApp.tsx` pero mucho más corto (sin props redundantes, sin `completedMission`).

### 5. Lo que NO se toca (fidelidad primero)

- Ninguna copy, ningún emoji, ningún color, ninguna foto.
- Ningún estilo inline se convierte a Tailwind en esta pasada (sería una segunda auditoría).
- Ningún componente shadcn se introduce en las pantallas del MVP.
- Ninguna funcionalidad nueva (login, backend, etc.).

## Verificación

1. `bunx tsgo --noEmit` limpio.
2. Abrir preview y recorrer manualmente: splash → welcome → onboarding → diagnóstico → resultado → entrada → ruta → misión → celebración. Screenshot con Playwright de al menos welcome + route + celebration para comparar contra el estado actual.
3. Confirmar que `DevNav` desaparece en build de producción y sigue visible en dev.

## Notas técnicas

- Se usan imports absolutos `@/features/archipielago/...` (alias ya configurado).
- Todos los archivos siguen siendo componentes de presentación puros; el estado global sigue viviendo en `ArchipelagoApp.tsx`.
- Cero cambios en `src/routes/` ni en `__root.tsx`.

## Fuera de alcance (para una próxima iteración)

- Migrar estilos inline a tokens CSS / Tailwind.
- Extraer el motor del diagnóstico a un hook (`useDiagnosis`).
- Persistir progreso en Lovable Cloud.
- Tests.

¿Apruebo y ejecuto el refactor?
