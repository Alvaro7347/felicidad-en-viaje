export type Screen = 'welcome' | 'onboarding' | 'diagnosis' | 'diagnosis-result' | 'route' | 'mission' | 'mission-guide' | 'mission-two' | 'mission-three' | 'mission-four' | 'mission-seven' | 'mission-eight' | 'celebration';

export type NodeStatus = 'done' | 'current' | 'locked' | 'achievement';

export interface RouteNode {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  status: NodeStatus;
  time?: string;
  type?: string;
}

export interface DiagQuestion {
  id: number;
  question: string;
  subtitle?: string;
  options: string[];
  multi?: boolean;
}

export type DiagAnswers = Record<number, string | string[]>;
