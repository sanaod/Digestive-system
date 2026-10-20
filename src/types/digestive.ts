export type CategoryType = 'canal' | 'accessories';

export interface OrganInfo {
  id: string;
  name: string;
  englishName: string;
  category: CategoryType;
  categoryLabel: string;
  orderInCanal?: number; // 1..8 for GI canal route
  shortDesc: string;
  detailedFunction: string;
  foodProcess: string; // What happens to food here
  colorHex: string;
  highlightHex: string;
  funFact: string;
  iconName: string;
  threeCoordinates: { x: number; y: number; z: number };
  cameraTarget: { x: number; y: number; z: number };
  cameraPosition: { x: number; y: number; z: number };
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedOrganId?: string;
}

export type ActiveTabType = 'all' | 'canal' | 'accessories';

export type GameMode = 'explore' | 'journey' | 'identify' | 'classify' | 'order' | 'quiz' | 'license';
