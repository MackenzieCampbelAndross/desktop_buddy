import { PersonalityType, BuddyMood, AmbientContext, UserMemory } from '../types';
import { PersonalityEngine } from './personality_engine';

export interface AIProviderConfig {
  providerName: 'LOCAL_RULE_ENGINE' | 'OPENAI_COMPATIBLE' | 'ANTHROPIC';
  apiKey?: string;
  endpointUrl?: string;
}

export class CompanionAI {
  /**
   * Generates a personality-aligned conversational response using local domain intelligence
   * augmented with user-approved memories and contextual telemetry.
   */
  static async generateReply(
    userText: string,
    personality: PersonalityType,
    mood: BuddyMood,
    context: AmbientContext,
    memories: UserMemory[],
    config: AIProviderConfig = { providerName: 'LOCAL_RULE_ENGINE' }
  ): Promise<{ reply: string; moodReaction: BuddyMood }> {
    // If an external provider is configured, handle abstraction
    if (config.providerName !== 'LOCAL_RULE_ENGINE' && config.apiKey) {
      // Fallback-safe external caller mock/bridge
    }

    const lower = userText.toLowerCase().trim();
    let reply = '';
    let moodReaction: BuddyMood = mood;

    // 1. Check for memory queries ("what do you remember?", "what are my tasks?")
    if (lower.includes('what do you remember') || lower.includes('my memories') || lower.includes('my tasks')) {
      const approved = memories.filter((m) => m.isApproved);
      if (approved.length === 0) {
        reply = "I don't have any approved memories stored yet! Feel free to tell me things like 'I prefer dark mode' or 'remember to commit code'.";
      } else {
        const memList = approved.slice(0, 3).map((m) => `• ${m.content}`).join('\n');
        reply = `Here is what I currently hold in my memory vault for you:\n${memList}`;
      }
      return { reply: PersonalityEngine.formatResponse(reply, personality), moodReaction: 'HAPPY' };
    }

    // 2. Greetings
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower === 'sup') {
      const profile = PersonalityEngine.getProfile(personality);
      reply = `${profile.greeting} How is your ${context.activeApp} session going?`;
      moodReaction = 'HAPPY';
    }
    // 3. Stressed / Tired
    else if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('stress') || lower.includes('burnout')) {
      if (personality === 'SAGE') {
        reply = 'Release the tension in your shoulders. Even the grandest mountain rests beneath the stars. Step away for 5 minutes.';
      } else if (personality === 'COACH') {
        reply = 'You have pushed hard! Champions know when to strategically recover. Hydrate, walk around the room, and reset!';
      } else if (personality === 'PLAYFUL') {
        reply = 'Quick! Drop what you are doing and stretch like a cat! 🐾 Better now?';
      } else {
        reply = 'System thermal load high. Recommend initiating a 5-minute standby cooldown cycle.';
      }
      moodReaction = 'SLEEPY';
    }
    // 4. Focus / Productive
    else if (lower.includes('coding') || lower.includes('focus') || lower.includes('work') || lower.includes('feature')) {
      if (personality === 'COACH') {
        reply = `Lock in on ${context.activeApp}! 25-minute sprint starting now. No distractions, pure execution!`;
      } else if (personality === 'SAGE') {
        reply = `Immerse your attention fully into your craft. When the mind is undivided, work becomes effortless.`;
      } else if (personality === 'CYBERPUNK') {
        reply = `Compiling productivity sequence. Memory bandwidth dedicated to active workspace: ${context.activeApp}.`;
      } else {
        reply = `Woohoo! I will silently cheer you on while you build something awesome!`;
      }
      moodReaction = 'FOCUSED';
    }
    // 5. Tell a joke or fun quote
    else if (lower.includes('joke') || lower.includes('quote') || lower.includes('proverb') || lower.includes('bored')) {
      reply = PersonalityEngine.getRandomProverb(personality);
      moodReaction = 'EXCITED';
    }
    // 6. Food / Feeding
    else if (lower.includes('snack') || lower.includes('hungry') || lower.includes('feed') || lower.includes('treat')) {
      reply = 'Did someone say treats?! I love virtual treats! Feed me using the treat button in the dashboard! 🍪';
      moodReaction = 'PLAYFUL';
    }
    // 7. General fallback with context awareness
    else {
      const relevantMemory = memories.find((m) => m.isApproved && lower.includes(m.key.toLowerCase()));
      const memBonus = relevantMemory ? ` (Remembering: ${relevantMemory.content})` : '';

      switch (personality) {
        case 'SAGE':
          reply = `I hear you regarding "${userText}". Keep your mind calm and your focus steady.${memBonus}`;
          break;
        case 'COACH':
          reply = `Acknowledged on "${userText}"! Stay hungry, keep disciplined, and let's get results!${memBonus}`;
          break;
        case 'PLAYFUL':
          reply = `Interesting thoughts! Talking with you is way more fun than chasing laser pointers!${memBonus}`;
          break;
        case 'CYBERPUNK':
          reply = `Packet parsed: "${userText}". Telemetry synced with current session in ${context.activeApp}.${memBonus}`;
          break;
      }
      moodReaction = 'HAPPY';
    }

    return {
      reply: PersonalityEngine.formatResponse(reply, personality),
      moodReaction
    };
  }
}
