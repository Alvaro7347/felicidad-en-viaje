// Repositorio de datos del viaje (Alejandra / María José).
//
// Responsabilidad ÚNICA: encapsular las llamadas Supabase relacionadas con la
// configuración del viaje musical. No conoce React, navegación, modalidad,
// localStorage ni presentación. Sólo consulta / escribe / lanza errores.
//
// Cada función revisa explícitamente `error` de Supabase y lanza un Error con
// mensaje claro cuando algo falla, para que el llamador aplique su propio
// tratamiento (mostrar mensaje, redirigir, etc.). Los payloads y las opciones
// `onConflict` de cada upsert son idénticos a los que se usaban en el sitio
// original: no se modifica ninguna regla de negocio ni contrato con la DB.

import { supabase } from "@/integrations/supabase/client";
import type { DiagAnswers } from "../types";
import type { ParentOnboardingAnswers } from "@/features/parent-journey/types";

// ── Tipos de retorno ──────────────────────────────────────────────

export type JourneyConfiguration = {
  hasParentJourney: boolean;
  hasUserOnboarding: boolean;
};

export type ProfileRecord = {
  name: string | null;
  experience_mode: string | null;
};

export type ParentJourneyRecord = {
  student_name: string;
  parent_name: string;
  teacher_name: string;
  plan_name: string;
  status: string;
  onboarding_answers: ParentOnboardingAnswers | null;
};

export type SelfOnboardingRecord = {
  name?: string;
  answers?: DiagAnswers;
};

// ── Configuración global (presencia de datos) ─────────────────────

export async function getJourneyConfiguration(userId: string): Promise<JourneyConfiguration> {
  const [pjRes, onbRes] = await Promise.all([
    supabase.from("parent_journeys").select("user_id").eq("user_id", userId).maybeSingle(),
    supabase.from("user_onboarding").select("user_id").eq("user_id", userId).maybeSingle(),
  ]);
  if (pjRes.error) throw new Error(`parent_journeys: ${pjRes.error.message}`);
  if (onbRes.error) throw new Error(`user_onboarding: ${onbRes.error.message}`);
  return {
    hasParentJourney: !!pjRes.data,
    hasUserOnboarding: !!onbRes.data,
  };
}

// ── Profile ───────────────────────────────────────────────────────

export async function loadProfile(userId: string): Promise<ProfileRecord | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("name, experience_mode")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(`profiles: ${error.message}`);
  return data ?? null;
}

export async function updateProfileName(userId: string, name: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, name, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) throw new Error(`profiles: ${error.message}`);
}

// ── Parent journey (María José) ───────────────────────────────────

export async function loadParentJourney(userId: string): Promise<ParentJourneyRecord | null> {
  const { data, error } = await supabase
    .from("parent_journeys")
    .select("student_name, parent_name, teacher_name, plan_name, status, onboarding_answers")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(`parent_journeys: ${error.message}`);
  if (!data) return null;
  return {
    student_name: data.student_name,
    parent_name: data.parent_name,
    teacher_name: data.teacher_name,
    plan_name: data.plan_name,
    status: data.status,
    onboarding_answers: (data.onboarding_answers ?? null) as ParentOnboardingAnswers | null,
  };
}

export async function saveParentJourney(
  userId: string,
  answers: ParentOnboardingAnswers,
): Promise<void> {
  // Payload idéntico al que ejecutaba ArchipelagoApp inline.
  const studentName = answers.student.name.trim();
  const parentName = answers.parent.name.trim();
  const planName = answers.practice.planName?.trim() || "Plan Semanal Presencial";
  const { error } = await supabase.from("parent_journeys").upsert(
    {
      user_id: userId,
      student_name: studentName || "",
      parent_name: parentName || "",
      teacher_name: "Álvaro",
      plan_name: planName,
      status: "pilot",
      onboarding_answers: answers as unknown as never,
    },
    { onConflict: "user_id" },
  );
  if (error) throw new Error(`parent_journeys: ${error.message}`);
}

// ── Self onboarding (Alejandra) ───────────────────────────────────

export async function loadSelfOnboarding(userId: string): Promise<SelfOnboardingRecord | null> {
  const { data, error } = await supabase
    .from("user_onboarding")
    .select("answers")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(`user_onboarding: ${error.message}`);
  if (!data) return null;
  return (data.answers ?? {}) as SelfOnboardingRecord;
}

export async function saveSelfOnboarding(
  userId: string,
  name: string,
  answers: DiagAnswers,
): Promise<void> {
  const payload = { name, answers } as unknown as never;
  const { error } = await supabase
    .from("user_onboarding")
    .upsert(
      { user_id: userId, answers: payload, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
  if (error) throw new Error(`user_onboarding: ${error.message}`);
}
