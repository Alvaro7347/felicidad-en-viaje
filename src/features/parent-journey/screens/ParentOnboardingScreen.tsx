import { useState } from "react";
import { B } from "@/features/archipielago/data/brand";

export type ParentOnboardingAnswers = {
  parent: {
    name: string;
    relationship: string;
    email?: string;
    motivation: string;
  };
  student: {
    name: string;
    age: string;
    experience: string;
    hasUkulele: string;
    likes: string;
  };
  learning: {
    reactions: string[];
    noteForTeacher: string;
  };
  expectations: {
    goal: string;
    weeklyObserve: string;
    worry: string;
    goodExperience: string[];
  };
  practice: {
    planName: string;
    homePractice: string;
    companion: string;
    taskType: string[];
  };
  accompaniment: {
    reportPrefs: string[];
    messageForTeacher: string;
  };
};

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

const TOTAL = 5;

export function ParentOnboardingScreen({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(1);
  const [ans, setAns] = useState<ParentOnboardingAnswers>(empty);
  const [submitting, setSubmitting] = useState(false);

  const next = () => setStep((s) => Math.min(TOTAL, s + 1));
  const back = () => (step === 1 ? onCancel() : setStep((s) => s - 1));

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onComplete(ans);
    } finally {
      setSubmitting(false);
    }
  };

  const studentLabel = ans.student.name.trim() || "tu hijo/a";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 8 }}>
      <Progress step={step} total={TOTAL} />

      {step === 1 && <Step1 ans={ans} setAns={setAns} />}
      {step === 2 && <Step2 ans={ans} setAns={setAns} />}
      {step === 3 && <Step3 ans={ans} setAns={setAns} />}
      {step === 4 && <Step4 ans={ans} setAns={setAns} />}
      {step === 5 && <Step5 ans={ans} setAns={setAns} />}

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
            {submitting ? "Guardando…" : `Crear viaje de ${studentLabel}`}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── UI helpers ──────────────────────────────────────────────────────────
function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.5px", color: B.grayText, textTransform: "uppercase" }}>
        Paso {step} de {total}
      </div>
      <div style={{ height: 6, borderRadius: 999, background: B.grayBorder, overflow: "hidden" }}>
        <div style={{ width: `${(step / total) * 100}%`, height: "100%", background: B.green, transition: "width 0.25s ease" }} />
      </div>
    </div>
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
        <textarea style={textareaStyle} value={p.motivation} onChange={(e) => upd({ motivation: e.target.value })} placeholder="Escribe libremente…" />
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
        <textarea style={textareaStyle} value={e.goal} onChange={(ev) => updE({ goal: ev.target.value })} />
      </Field>
      <Field label="¿Qué te gustaría observar semana a semana?">
        <textarea style={textareaStyle} value={e.weeklyObserve} onChange={(ev) => updE({ weeklyObserve: ev.target.value })} />
      </Field>
      <Field label="¿Qué te preocupa del proceso?">
        <textarea style={textareaStyle} value={e.worry} onChange={(ev) => updE({ worry: ev.target.value })} />
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

function Step5({ ans, setAns }: StepProps) {
  const a = ans.accompaniment;
  const pr = ans.practice;
  const updA = (patch: Partial<typeof a>) => setAns({ ...ans, accompaniment: { ...a, ...patch } });
  const updP = (patch: Partial<typeof pr>) => setAns({ ...ans, practice: { ...pr, ...patch } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader title="¿Cómo quieres acompañar?" subtitle="Elige qué información te gustaría recibir después de cada clase." />
      <OptionList
        multi
        options={[
          "Reporte breve",
          "Reporte detallado",
          "Tareas semanales",
          "Recomendaciones para acompañar en casa",
          "Hitos importantes",
          "Alertas si algo le está costando",
        ]}
        value={a.reportPrefs}
        onChange={(v) => updA({ reportPrefs: v as string[] })}
      />
      <Field label="¿Qué tipo de tareas prefieres? (puedes elegir varias)">
        <OptionList
          multi
          options={[
            "Muy simples y cortas",
            "Desafíos entretenidos",
            "Canciones conocidas",
            "Ejercicios paso a paso",
            "Actividades para hacer en familia",
          ]}
          value={pr.taskType}
          onChange={(v) => updP({ taskType: v as string[] })}
        />
      </Field>
      <Field label="¿Qué te gustaría contarle al profesor antes de la primera clase?">
        <textarea style={textareaStyle} value={a.messageForTeacher} onChange={(ev) => updA({ messageForTeacher: ev.target.value })} />
      </Field>
    </div>
  );
}
