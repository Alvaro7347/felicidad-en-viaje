type Screen = 'welcome' | 'onboarding' | 'diagnosis' | 'diagnosis-result' | 'entry-moment' | 'route' | 'mission' | 'mission-guide' | 'mission-two' | 'mission-three' | 'mission-four' | 'celebration';

type NodeStatus = 'done' | 'current' | 'locked' | 'achievement';

interface RouteNode {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  status: NodeStatus;
  time?: string;
  type?: string;
}

interface DiagQuestion {
  id: number;
  question: string;
  subtitle?: string;
  options: string[];
  multi?: boolean;
}

type DiagAnswers = Record<number, string | string[]>;
