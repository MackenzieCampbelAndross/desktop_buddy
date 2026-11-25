/**
 * Domain types and models for Desktop Buddy.
 */

export type BuddySpecies = 'CYBER_CAT' | 'COSMIC_OWL' | 'STAR_SPRITE' | 'ROBO_PUP';

export type PersonalityType = 'SAGE' | 'COACH' | 'PLAYFUL' | 'CYBERPUNK';

export type BuddyMood = 'HAPPY' | 'FOCUSED' | 'SLEEPY' | 'BORED' | 'EXCITED' | 'PLAYFUL';

export type AccessoryType = 'NONE' | 'TOP_HAT' | 'WIZARD_HAT' | 'SUNGLASSES' | 'HEADPHONES' | 'BOWTIE' | 'BANDANA';

export type HabitatTheme = 'CYBER_ROOM' | 'COZY_CAFE' | 'STARLIT_MEADOW' | 'ZEN_GARDEN';

export interface BuddyCustomization {
  species: BuddySpecies;
  name: string;
  primaryColor: string;
  accessory: AccessoryType;
  habitat: HabitatTheme;
}

export interface UserMemory {
  id: string;
  key: string;
  content: string;
  category: 'PREFERENCE' | 'TASK' | 'NOTE' | 'INSIGHT';
  confidence: number;
  isApproved: boolean;
  createdAt: number;
  lastRecalledAt?: number;
}

export interface AmbientContext {
  activeApp: string; // e.g. "VS Code", "Chrome", "Figma", "Spotify", "Terminal"
  isIdle: boolean;
  idleDurationMinutes: number;
  currentActivity: 'CODING' | 'DESIGNING' | 'BROWSING' | 'GAMING' | 'IDLE';
  timeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  sessionMinutes: number;
}

export interface ProactiveAlert {
  id: string;
  type: 'HYDRATION' | 'POSTURE' | 'EYE_REST' | 'STRETCH' | 'FOCUS_PRAISE' | 'WIND_DOWN';
  message: string;
  suggestedAction: string;
  timestamp: number;
  dismissed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'BUDDY';
  text: string;
  timestamp: number;
  moodReaction?: BuddyMood;
}

export interface BuddyState {
  customization: BuddyCustomization;
  personality: PersonalityType;
  mood: BuddyMood;
  energyLevel: number; // 0 - 100
  affectionScore: number; // 0 - 100
  hungerLevel: number; // 0 - 100 (0 = full, 100 = starving)
  context: AmbientContext;
  memories: UserMemory[];
  chatHistory: ChatMessage[];
  pendingAlerts: ProactiveAlert[];
  isFloatingOverlay: boolean;
}
