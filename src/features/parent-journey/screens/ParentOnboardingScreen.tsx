import { useState } from "react";
import { B } from "@/features/archipielago/data/brand";
import { OnboardingProgressHeader } from "@/features/archipielago/components/OnboardingProgressHeader";
import type { ParentOnboardingAnswers } from "@/features/parent-journey/types";

const empty: ParentOnboardingAnswers = {
  parent: { name: "", relationship: "", email: "", motivation: "" },
  student: { name: "", age: "", experience: "", hasUkulele: "", likes: "" },
  learning: { reactions: [], noteForTeacher: "" },
  expectations: { goal: "", weeklyObserve: "", worry: "", goodExperience: [] },
  practice: { planName: "Plan Semanal Presencial", homePractice: "", companion: "", taskType: [] },
  accompaniment: { reportPrefs: [], messageForTeacher: "" },
};

type Props = {
  onComplete: (answers: ParentOnboardingAnswers) => void | Promise<void>;
  onCancel: () => void;
};

const TOTAL = 4;

export function ParentOnboardingScreen({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(1);
  const [ans, setAns] = useState<ParentOnboardingAnswers>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(TOTAL, s + 1));
  const back = () => (step === 1 ? onCancel() : setStep((s) => s - 1));

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onComplete(ans);
    } catch (e) {
      setSubmitError(
        e instanceof Error && e.message
          ? e.message
          : "No pudimos crear el perfil del alumno. Intenta nuevamente.",
      );
    } finally {

      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 8 }}>
      <Progress step={step} total={TOTAL} />

      {step === 1 && <Step1 ans={ans} setAns={setAns} />}
      {step === 2 && <Step2 ans={ans} setAns={setAns} />}
      {step === 3 && <Step3 ans={ans} setAns={setAns} />}
      {step === 4 && <Step4 ans={ans} setAns={setAns} />}

      {step === TOTAL && submitError && (
        <div
          role="alert"
          style={{
            background: "#FFF3F3",
            border: "1px solid #F5B5B5",
            color: "#8A1F1F",
            borderRadius: 12,
            padding: "12px 14px",
            fontSize: 13.5,
            lineHeight: 1.45,
          }}
        >
          {submitError}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button type="button" onClick={back} style={secondaryBtn}>
          Volver
        </button>
        {step < TOTAL ? (
          <button type="button" onClick={next} style={primaryBtn}>
            Continuar
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={submitting} style={{ ...primaryBtn, opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Guardando…" : submitError ? "Reintentar" : "Crear viaje musical"}
          </button>
        )}
      </div>

    </div>
  );
}

// ─── UI helpers ──────────────────────────────────────────────────────────
function Progress({ step, total }: { step: number; total: number }) {
  return (
    <OnboardingProgressHeader
      currentStep={step}
      totalSteps={total}
      label="Perfil de acompañamiento"
    />
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, fontWeight: 800, color: B.dark, margin: 0, lineHeight: 1.2 }}>
        {title}
      </h2>
      {subtitle && <p style={{ marginTop: 6, marginBottom: 0, color: "#6f6f6d", fontSize: 14, lineHeight: 1.5 }}>{subtitle}</p>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 13.5, fontWeight: 700, color: B.dark }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  fontSize: 15,
  borderRadius: 12,
  border: `1px solid ${B.grayBorder}`,
  background: B.white,
  color: B.dark,
  fontFamily: "inherit",
  outline: "none",
};

const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 84, resize: "vertical", lineHeight: 1.5 };

const primaryBtn: React.CSSProperties = {
  flex: 2,
  border: "none",
  background: B.green,
  color: B.dark,
  fontFamily: "Space Grotesk, sans-serif",
  fontWeight: 800,
  fontSize: 15,
  borderRadius: 14,
  padding: "14px 18px",
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(46,230,174,0.28)",
};

const secondaryBtn: React.CSSProperties = {
  flex: 1,
  border: `1px solid ${B.grayBorder}`,
  background: B.white,
  color: B.dark,
  fontFamily: "Space Grotesk, sans-serif",
  fontWeight: 700,
  fontSize: 15,
  borderRadius: 14,
  padding: "14px 18px",
  cursor: "pointer",
};

function OptionList({
  options,
  value,
  onChange,
  multi = false,
}: {
  options: string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map((opt) => {
        const selected = multi ? (value as string[]).includes(opt) : value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => {
              if (multi) {
                const arr = value as string[];
                onChange(arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt]);
              } else {
                onChange(opt);
              }
            }}
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "12px 14px",
              borderRadius: 12,
              border: `1.5px solid ${selected ? B.green : B.grayBorder}`,
              background: selected ? B.greenLight : B.white,
              color: B.dark,
              fontSize: 14.5,
              fontWeight: selected ? 700 : 500,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: multi ? 5 : 999,
                border: `2px solid ${selected ? B.green : "#cfcfcd"}`,
                background: selected ? B.green : "transparent",
                flex: "0 0 auto",
              }}
            />
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── Steps ───────────────────────────────────────────────────────────────
type StepProps = {
  ans: ParentOnboardingAnswers;
  setAns: React.Dispatch<React.SetStateAction<ParentOnboardingAnswers>>;
};

function Step1({ ans, setAns }: StepProps) {
  const p = ans.parent;
  const upd = (patch: Partial<typeof p>) => setAns({ ...ans, parent: { ...p, ...patch } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader title="Cuéntanos sobre ti" subtitle="Queremos saber quién acompañará este viaje musical." />
      <Field label="Nombre del apoderado/a">
        <input style={inputStyle} value={p.name} onChange={(e) => upd({ name: e.target.value })} placeholder="Ej: Carolina" />
      </Field>
      <Field label="Relación con el alumno/a">
        <OptionList
          options={["Mamá", "Papá", "Abuelo/a", "Tío/a", "Tutor/a", "Otro"]}
          value={p.relationship}
          onChange={(v) => upd({ relationship: v as string })}
        />
      </Field>
      <Field label="¿Qué te motivó a iniciar este proceso?">
        <OptionList
          options={[
            "Quiero que descubra la música desde pequeño/a",
            "Le gusta el ukelele y quiere aprender",
            "Busco una actividad significativa fuera de la pantalla",
            "Quiero que gane confianza y se exprese",
            "Quiero compartir la música en familia",
          ]}
          value={p.motivation}
          onChange={(v) => upd({ motivation: v as string })}
        />
        <textarea
          style={{ ...textareaStyle, marginTop: 8 }}
          value={p.motivation && ![
            "Quiero que descubra la música desde pequeño/a",
            "Le gusta el ukelele y quiere aprender",
            "Busco una actividad significativa fuera de la pantalla",
            "Quiero que gane confianza y se exprese",
            "Quiero compartir la música en familia",
          ].includes(p.motivation) ? p.motivation : ""}
          onChange={(e) => upd({ motivation: e.target.value })}
          placeholder="Otro motivo (opcional)…"
        />
      </Field>
    </div>
  );
}

function Step2({ ans, setAns }: StepProps) {
  const s = ans.student;
  const upd = (patch: Partial<typeof s>) => setAns({ ...ans, student: { ...s, ...patch } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader title="Cuéntanos sobre quien aprenderá" subtitle="Esta información ayudará a preparar mejor la primera clase." />
      <Field label="Nombre del alumno/a">
        <input style={inputStyle} value={s.name} onChange={(e) => upd({ name: e.target.value })} placeholder="Ej: Lucía" />
      </Field>
      <Field label="Edad">
        <input style={inputStyle} value={s.age} onChange={(e) => upd({ age: e.target.value })} placeholder="Ej: 8 años" />
      </Field>
      <Field label="¿Ha tocado ukelele o algún instrumento antes?">
        <OptionList
          options={["No, comienza desde cero", "Ha probado un poco", "Ya ha tenido clases antes", "No estoy segura/o"]}
          value={s.experience}
          onChange={(v) => upd({ experience: v as string })}
        />
      </Field>
      <Field label="¿Tiene ukelele propio?">
        <OptionList options={["Sí", "No todavía", "Usará uno prestado"]} value={s.hasUkulele} onChange={(v) => upd({ hasUkulele: v as string })} />
      </Field>
      <Field label="¿Qué música, canciones o artistas le gustan?">
        <textarea style={textareaStyle} value={s.likes} onChange={(e) => upd({ likes: e.target.value })} placeholder="Escribe libremente…" />
      </Field>
    </div>
  );
}

function Step3({ ans, setAns }: StepProps) {
  const s = ans.learning;
  const upd = (patch: Partial<typeof s>) => setAns({ ...ans, learning: { ...s, ...patch } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader title="¿Cómo suele aprender?" subtitle="Cada niño o niña necesita una forma distinta de acompañamiento." />
      <Field label="¿Cómo suele reaccionar cuando aprende algo nuevo? (puedes elegir varias)">
        <OptionList
          multi
          options={[
            "Se entusiasma rápido",
            "Le da vergüenza al inicio",
            "Se frustra si no le resulta",
            "Necesita tiempo para tomar confianza",
            "Le gusta mostrar lo que aprende",
            "Prefiere practicar acompañada/o",
            "Prefiere probar sola/o primero",
          ]}
          value={s.reactions}
          onChange={(v) => upd({ reactions: v as string[] })}
        />
      </Field>
      <Field label="¿Hay algo que el profesor debería saber para acompañarle mejor?">
        <textarea style={textareaStyle} value={s.noteForTeacher} onChange={(e) => upd({ noteForTeacher: e.target.value })} />
      </Field>
    </div>
  );
}

function Step4({ ans, setAns }: StepProps) {
  const e = ans.expectations;
  const pr = ans.practice;
  const updE = (patch: Partial<typeof e>) => setAns({ ...ans, expectations: { ...e, ...patch } });
  const updP = (patch: Partial<typeof pr>) => setAns({ ...ans, practice: { ...pr, ...patch } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader title="Expectativas y práctica" subtitle="Buscamos que el proceso sea realista y sostenible." />
      <Field label="¿Qué esperas que logre con las clases de ukelele?">
        <textarea
          style={textareaStyle}
          value={e.goal}
          onChange={(ev) => updE({ goal: ev.target.value })}
          placeholder="Ej: Que disfrute la música, gane confianza y aprenda sus primeras canciones."
        />
      </Field>
      <Field label="¿Qué te gustaría observar semana a semana?">
        <textarea
          style={textareaStyle}
          value={e.weeklyObserve}
          onChange={(ev) => updE({ weeklyObserve: ev.target.value })}
          placeholder="Ej: Si practica con entusiasmo, si recuerda lo aprendido o si se atreve a tocar algo nuevo."
        />
      </Field>
      <Field label="¿Qué te preocupa del proceso?">
        <textarea
          style={textareaStyle}
          value={e.worry}
          onChange={(ev) => updE({ worry: ev.target.value })}
          placeholder="Ej: Que se frustre rápido, que no practique en casa o que pierda la motivación."
        />
      </Field>
      <Field label="¿Cuánto tiempo realista podría practicar en casa?">
        <OptionList
          options={[
            "5 minutos, 1 o 2 veces por semana",
            "5 minutos, 3 veces por semana",
            "10 minutos, 2 o 3 veces por semana",
            "No lo sé todavía",
          ]}
          value={pr.homePractice}
          onChange={(v) => updP({ homePractice: v as string })}
        />
      </Field>
      <Field label="¿Quién podría acompañar la práctica en casa?">
        <OptionList
          options={["Mamá", "Papá", "Otro familiar", "Practicaría sola/o", "Depende de la semana"]}
          value={pr.companion}
          onChange={(v) => updP({ companion: v as string })}
        />
      </Field>
    </div>
  );
}
