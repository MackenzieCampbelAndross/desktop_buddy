import { create } from 'zustand';
import {
  BuddyState,
  BuddyCustomization,
  PersonalityType,
  BuddyMood,
  AmbientContext,
  UserMemory,
  ChatMessage,
  ProactiveAlert
} from '../types';
import { MoodEngine } from './mood_engine';
import { ContextMonitor } from './context_monitor';
import { MemoryVault } from './memory_vault';
import { CompanionAI } from './companion_ai';

interface BuddyStore extends BuddyState {
  // Pet Interactions
  petBuddy: () => void;
  feedBuddy: () => void;
  playMinigame: (score?: number) => void;

  // Chat Operations
  sendChatMessage: (text: string) => Promise<void>;
  clearChat: () => void;

  // Customization & Personality
  updateCustomization: (updates: Partial<BuddyCustomization>) => void;
  setPersonality: (personality: PersonalityType) => void;

  // Context & Simulation
  switchActiveApp: (appName: string) => void;
  tickSimulation: (minutes?: number) => void;

  // Memory Operations
  approveMemory: (id: string) => void;
  rejectMemory: (id: string) => void;
  deleteMemory: (id: string) => void;

  // Alert Operations
  dismissAlert: (id: string) => void;

  // Overlay Mode
  toggleFloatingOverlay: () => void;
}

const INITIAL_MEMORIES: UserMemory[] = [
  {
    id: 'mem-1',
    key: 'dark_mode_preference',
    content: 'User prefers dark mode interfaces with high contrast.',
    category: 'PREFERENCE',
    confidence: 1.0,
    isApproved: true,
    createdAt: Date.now() - 36000000
  },
  {
    id: 'mem-2',
    key: 'hydration_goal',
    content: 'Target hydration: at least 2.5 liters of water daily.',
    category: 'TASK',
    confidence: 0.95,
    isApproved: true,
    createdAt: Date.now() - 18000000
  }
];

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-init',
    sender: 'BUDDY',
    text: 'Hello human! I am Sparky, your desktop companion. I am right here beside your workspace!',
    timestamp: Date.now() - 5000,
    moodReaction: 'HAPPY'
  }
];

export const useBuddyStore = create<BuddyStore>((set, get) => ({
  customization: {
    species: 'CYBER_CAT',
    name: 'Sparky',
    primaryColor: '#8b5cf6',
    accessory: 'HEADPHONES',
    habitat: 'CYBER_ROOM'
  },
  personality: 'PLAYFUL',
  mood: 'HAPPY',
  energyLevel: 85,
  affectionScore: 70,
  hungerLevel: 20,
  context: ContextMonitor.getInitialContext(),
  memories: INITIAL_MEMORIES,
  chatHistory: INITIAL_CHAT,
  pendingAlerts: [],
  isFloatingOverlay: false,

  petBuddy: () => {
    const { energyLevel, hungerLevel, affectionScore } = get();
    const result = MoodEngine.handlePetting(energyLevel, hungerLevel, affectionScore);
    set({
      mood: result.mood,
      energyLevel: result.energyLevel,
      hungerLevel: result.hungerLevel,
      affectionScore: result.affectionScore
    });
  },

  feedBuddy: () => {
    const { energyLevel, hungerLevel, affectionScore } = get();
    const result = MoodEngine.handleFeeding(energyLevel, hungerLevel, affectionScore);
    set({
      mood: result.mood,
      energyLevel: result.energyLevel,
      hungerLevel: result.hungerLevel,
      affectionScore: result.affectionScore
    });
  },

  playMinigame: (score = 50) => {
    const { energyLevel, hungerLevel, affectionScore } = get();
    const result = MoodEngine.handlePlaying(energyLevel, hungerLevel, affectionScore, score);
    set({
      mood: result.mood,
      energyLevel: result.energyLevel,
      hungerLevel: result.hungerLevel,
      affectionScore: result.affectionScore
    });
  },

  sendChatMessage: async (text: string) => {
    if (!text.trim()) return;
    const now = Date.now();
    const userMsg: ChatMessage = {
      id: `user-${now}`,
      sender: 'USER',
      text,
      timestamp: now
    };

    set((state) => ({ chatHistory: [...state.chatHistory, userMsg] }));

    // Extract potential memories from user message
    const potentials = MemoryVault.extractPotentialMemories(text);
    if (potentials.length > 0) {
      const newMems = potentials.map((p) =>
        MemoryVault.createMemory(p.key, p.content, p.category, false)
      );
      set((state) => ({ memories: [...state.memories, ...newMems] }));
    }

    const { personality, mood, context, memories } = get();
    const aiResponse = await CompanionAI.generateReply(
      text,
      personality,
      mood,
      context,
      memories
    );

    const buddyMsg: ChatMessage = {
      id: `buddy-${Date.now()}`,
      sender: 'BUDDY',
      text: aiResponse.reply,
      timestamp: Date.now(),
      moodReaction: aiResponse.moodReaction
    };

    set((state) => ({
      chatHistory: [...state.chatHistory, buddyMsg],
      mood: aiResponse.moodReaction
    }));
  },

  clearChat: () => set({ chatHistory: [] }),

  updateCustomization: (updates) =>
    set((state) => ({
      customization: { ...state.customization, ...updates }
    })),

  setPersonality: (personality) => set({ personality }),

  switchActiveApp: (appName: string) => {
    const currentActivity = ContextMonitor.mapAppToActivity(appName);
    set((state) => ({
      context: {
        ...state.context,
        activeApp: appName,
        currentActivity,
        sessionMinutes: state.context.sessionMinutes + 5
      }
    }));
    // Check for proactive health alerts
    const alerts = ContextMonitor.checkProactiveAlerts(get().context);
    if (alerts.length > 0) {
      set((state) => ({ pendingAlerts: [...alerts, ...state.pendingAlerts] }));
    }
  },

  tickSimulation: (minutes = 10) => {
    const { energyLevel, hungerLevel, affectionScore, context } = get();
    const result = MoodEngine.handleTimeTick(
      energyLevel,
      hungerLevel,
      affectionScore,
      minutes,
      context
    );
    const updatedContext: AmbientContext = {
      ...context,
      sessionMinutes: context.sessionMinutes + minutes
    };
    const alerts = ContextMonitor.checkProactiveAlerts(updatedContext);

    set((state) => ({
      mood: result.mood,
      energyLevel: result.energyLevel,
      hungerLevel: result.hungerLevel,
      affectionScore: result.affectionScore,
      context: updatedContext,
      pendingAlerts: alerts.length > 0 ? [...alerts, ...state.pendingAlerts] : state.pendingAlerts
    }));
  },

  approveMemory: (id: string) => {
    set((state) => ({
      memories: state.memories.map((m) =>
        m.id === id ? { ...m, isApproved: true } : m
      )
    }));
  },

  rejectMemory: (id: string) => {
    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id)
    }));
  },

  deleteMemory: (id: string) => {
    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id)
    }));
  },

  dismissAlert: (id: string) => {
    set((state) => ({
      pendingAlerts: state.pendingAlerts.filter((a) => a.id !== id)
    }));
  },

  toggleFloatingOverlay: () => {
    set((state) => ({ isFloatingOverlay: !state.isFloatingOverlay }));
  }
}));
