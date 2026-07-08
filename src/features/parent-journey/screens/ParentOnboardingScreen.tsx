import { useState } from "react";
import { B } from "@/features/archipielago/data/brand";

export type ParentOnboardingAnswers = {
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
  student: { name: "Lucía", age: "", experience: "", hasUkulele: "", likes: "" },
  learning: { reactions: [], noteForTeacher: "" },
  expectations: { goal: "", weeklyObserve: "", worry: "", goodExperience: [] },
  practice: { homePractice: "", companion: "", taskType: [] },
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
            {submitting ? "Guardando…" : "Crear viaje de Lucía"}
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
  const s = ans.student;
  const upd = (patch: Partial<typeof s>) => setAns({ ...ans, student: { ...s, ...patch } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader title="Cuéntanos sobre Lucía" subtitle="Con esto Álvaro puede preparar mejor la primera clase." />
      <Field label="Nombre de la alumna">
        <input style={inputStyle} value={s.name} onChange={(e) => upd({ name: e.target.value })} />
      </Field>
      <Field label="Edad">
        <input style={inputStyle} value={s.age} onChange={(e) => upd({ age: e.target.value })} placeholder="Ej: 9 años" />
      </Field>
      <Field label="¿Ha tocado ukelele o algún instrumento antes?">
        <OptionList
          options={["No, comienza desde cero", "Ha probado un poco", "Ya ha tenido clases antes", "No estoy segura"]}
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

function Step2({ ans, setAns }: StepProps) {
  const s = ans.learning;
  const upd = (patch: Partial<typeof s>) => setAns({ ...ans, learning: { ...s, ...patch } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader title="Cómo aprende Lucía" subtitle="¿Cómo suele reaccionar cuando aprende algo nuevo? (puedes elegir varias)" />
      <OptionList
        multi
        options={[
          "Se entusiasma rápido",
          "Le da vergüenza al inicio",
          "Se frustra si no le resulta",
          "Necesita tiempo para tomar confianza",
          "Le gusta mostrar lo que aprende",
          "Prefiere practicar acompañada",
          "Prefiere probar sola primero",
        ]}
        value={s.reactions}
        onChange={(v) => upd({ reactions: v as string[] })}
      />
      <Field label="¿Hay algo que Álvaro debería saber para acompañarla mejor?">
        <textarea style={textareaStyle} value={s.noteForTeacher} onChange={(e) => upd({ noteForTeacher: e.target.value })} />
      </Field>
    </div>
  );
}

function Step3({ ans, setAns }: StepProps) {
  const s = ans.expectations;
  const upd = (patch: Partial<typeof s>) => setAns({ ...ans, expectations: { ...s, ...patch } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader title="Tus expectativas" subtitle="Carolina, cuéntanos qué esperas de este viaje." />
      <Field label="¿Qué esperas que Lucía logre con las clases de ukelele?">
        <textarea style={textareaStyle} value={s.goal} onChange={(e) => upd({ goal: e.target.value })} />
      </Field>
      <Field label="¿Qué te gustaría observar semana a semana?">
        <textarea style={textareaStyle} value={s.weeklyObserve} onChange={(e) => upd({ weeklyObserve: e.target.value })} />
      </Field>
      <Field label="¿Qué te preocupa del proceso?">
        <textarea style={textareaStyle} value={s.worry} onChange={(e) => upd({ worry: e.target.value })} />
      </Field>
      <Field label="Para ti, una buena experiencia sería que Lucía… (puedes elegir varias)">
        <OptionList
          multi
          options={[
            "Disfrute la música",
            "Gane confianza",
            "Aprenda canciones",
            "Sea constante",
            "Se exprese mejor",
            "Tenga una actividad significativa",
            "Comparta algo bonito en familia",
          ]}
          value={s.goodExperience}
          onChange={(v) => upd({ goodExperience: v as string[] })}
        />
      </Field>
    </div>
  );
}

function Step4({ ans, setAns }: StepProps) {
  const s = ans.practice;
  const upd = (patch: Partial<typeof s>) => setAns({ ...ans, practice: { ...s, ...patch } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader title="Plan y práctica en casa" />
      <div
        style={{
          background: B.greenLight,
          border: `1px solid ${B.green}`,
          borderRadius: 14,
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, color: B.dark }}>Plan Semanal Presencial</div>
        <div style={{ fontSize: 13, color: "#4a4a48" }}>1 clase por semana · Profesor guía: Álvaro</div>
      </div>
      <Field label="¿Cuánto tiempo realista podría practicar Lucía en casa?">
        <OptionList
          options={[
            "5 minutos, 1 o 2 veces por semana",
            "5 minutos, 3 veces por semana",
            "10 minutos, 2 o 3 veces por semana",
            "No lo sé todavía",
          ]}
          value={s.homePractice}
          onChange={(v) => upd({ homePractice: v as string })}
        />
      </Field>
      <Field label="¿Quién podría acompañarla en casa?">
        <OptionList
          options={["Mamá", "Papá", "Otro familiar", "Practicaría sola", "Depende de la semana"]}
          value={s.companion}
          onChange={(v) => upd({ companion: v as string })}
        />
      </Field>
      <Field label="¿Qué tipo de tareas prefieres para Lucía? (puedes elegir varias)">
        <OptionList
          multi
          options={[
            "Muy simples y cortas",
            "Desafíos entretenidos",
            "Canciones conocidas",
            "Ejercicios paso a paso",
            "Actividades para hacer en familia",
          ]}
          value={s.taskType}
          onChange={(v) => upd({ taskType: v as string[] })}
        />
      </Field>
    </div>
  );
}

function Step5({ ans, setAns }: StepProps) {
  const s = ans.accompaniment;
  const upd = (patch: Partial<typeof s>) => setAns({ ...ans, accompaniment: { ...s, ...patch } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader title="Cómo quieres acompañar el viaje" subtitle="Elige el tipo de información que te gustaría recibir después de cada clase." />
      <OptionList
        multi
        options={[
          "Reporte breve",
          "Reporte detallado",
          "Tareas semanales",
          "Recomendaciones para acompañarla",
          "Hitos importantes",
          "Alertas si algo le está costando",
        ]}
        value={s.reportPrefs}
        onChange={(v) => upd({ reportPrefs: v as string[] })}
      />
      <Field label="¿Qué te gustaría contarle a Álvaro antes de la primera clase?">
        <textarea style={textareaStyle} value={s.messageForTeacher} onChange={(e) => upd({ messageForTeacher: e.target.value })} />
      </Field>
    </div>
  );
}
