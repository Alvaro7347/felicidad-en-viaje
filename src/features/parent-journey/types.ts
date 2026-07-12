// Tipos compartidos del onboarding acompañado (María José).
// Módulo neutral: no depende de React ni de pantallas. Puede ser importado
// tanto por componentes UI como por servicios de datos sin generar ciclos
// screens → services → screens.

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
