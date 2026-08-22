export type HealthAngle = 
  | 'tiroides_metabolismo'
  | 'desbalance_menopausia'
  | 'ciclos_spm'
  | 'digestion_detox';

export interface UserProfile {
  name: string;
  phone?: string;
  email?: string;
  accessCode?: string;
  ageGroup?: string;
  primaryAngle: HealthAngle;
  symptoms: string[];
  hasCompletedOnboarding: boolean;
  startDate: string;
  currentDay: number;
  unlockedBadges: string[];
}

export interface DayTask {
  id: string;
  label: string;
  category: 'tyruss' | 'water' | 'nutrition' | 'mindset';
}

export interface DayPlan {
  dayNumber: number;
  phaseNumber: 1 | 2 | 3 | 4;
  phaseName: string;
  phaseSubtitle: string;
  title: string;
  theme: string;
  nutritionalFocus: string;
  marieTip: string;
  tyrussDose: string;
  tyrussTime: string;
  tyrussPreparation: string;
  tasks: DayTask[];
  educationalSnippet: string;
  recipeSuggestionId?: string;
}

export interface DayProgress {
  dayNumber: number;
  tyrussTaken: boolean;
  water2L: boolean;
  antiinflammatoryMeal: boolean;
  extraHabit: boolean;
  energyLevel: number; // 1 to 5
  digestion: 'liviana' | 'normal' | 'pesada' | 'inflamada';
  mood: 'radiante' | 'tranquila' | 'sensible' | 'agotada' | 'enfocada';
  sleepStars: number; // 1 to 5
  notes: string;
  completedAt?: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: 'tiroides' | 'hormonas' | 'digestivo' | 'energia' | 'noche';
  categoryLabel: string;
  tag: string;
  prepTime: string;
  servings: string;
  description: string;
  tyrussDose: string;
  ingredients: string[];
  stepByStep: string[];
  clinicalBenefit: string;
  accentColor: string;
}

export interface ChatMessage {
  id: string;
  sender: 'marie' | 'user';
  text: string;
  timestamp: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  quickReplies?: string[];
  actionLink?: {
    text: string;
    url?: string;
    type: 'whatsapp' | 'order' | 'recipe' | 'recompra';
    targetId?: string;
  };
}

export interface ProductPackage {
  id: string;
  title: string;
  jars: number;
  price: number;
  regularPrice: number;
  tag?: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  freeGift: string;
  shipping: string;
  features: string[];
}

export interface OrderFormState {
  fullName: string;
  phone: string;
  city: string;
  department: string;
  address: string;
  packageId: string;
  addBatidoVerde: boolean;
  notes: string;
}
