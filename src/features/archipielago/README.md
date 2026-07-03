# Archipiélago de la Felicidad — Claridad del Viaje

MVP reconstruido con fidelidad desde la versión validada en Replit.
Esta carpeta contiene TODO el producto. No dispersar código fuera de aquí.

## Regla de oro

**Primero fidelidad al MVP validado. Después iteración.**

Cualquier cambio que no preserve la experiencia validada requiere justificación
explícita. No rediseñar, no reordenar el flujo, no renombrar islas.

## Objetivo del MVP

Acompañar al usuario en su primer contacto con la música desde una narrativa
de viaje emocional: un archipiélago con islas, misiones pequeñas y celebración
de micro-victorias. No es una app de teoría musical ni un LMS.

## Flujo actual

```
welcome → onboarding → diagnosis → diagnosis-result → entry-moment
        → route → mission → celebration
```

Pantallas auxiliares accesibles desde `route`:
`mission-guide`, `mission-two`, `mission-three`, `mission-four`.

El estado del flujo vive en `ArchipelagoApp.tsx` (state machine con `screen`).

## Pantallas (`screens/`)

- `WelcomeScreen` — portada + CTA inicial.
- `OnboardingScreen` — introducción narrativa al Archipiélago.
- `DiagnosisScreen` — 6 preguntas del perfil musical + nombre.
- `DiagnosisResultScreen` — devolución personalizada con el nombre.
- `EntryMomentScreen` — micro-transición emocional.
- `RouteScreen` — mapa de islas + nodos de la Isla del Silencio.
- `MissionScreen` — misión "Toca tu primer DO" + check-in emocional.
- `MissionGuide/Two/Three/FourScreen` — misiones adyacentes (revisión).
- `CelebrationScreen` — sello desbloqueado + próxima isla.

## Componentes (`components/`)

Primitivos visuales, sin lógica de negocio:
`Btn`, `Card`, `Tag`, `BackBtn`, `AppHeader`, `SplashScreen`, `DevNav`.

`DevNav` solo se renderiza en `import.meta.env.DEV`.

## Datos (`data/`)

Contenido estático del MVP: `brand.ts` (colores + fotos), `routes.ts`,
`islands.ts`, `emotions.ts`, `diagnosis.ts`, `screens.ts`.

## Qué NO se debe agregar todavía

- Login real / autenticación.
- Backend / base de datos / persistencia.
- Pagos.
- IA (chat, generación, análisis).
- Módulo de profesor.
- Chat o comunidad.
- Subida de videos del usuario.
- Bottom navigation.
- Convertir esto en una app interna genérica.

Cualquiera de estos temas implica salir del MVP validado y debe discutirse
antes de tocar código.

## Deuda técnica reconocida

- Estilos inline heredados de la reconstrucción fiel: no migrar a Tailwind
  ni a design tokens hasta confirmar que la fidelidad visual está aceptada.
- Progreso, sellos y emoción viven en estado local — no persisten.
- Botones "Escríbele aquí" / "Descargar App" son no-op intencionales.

Refactorizar solo después de validar fidelidad con el usuario.
