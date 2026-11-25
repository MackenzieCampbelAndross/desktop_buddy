import { describe, it, expect } from 'vitest';
import { PersonalityEngine, PERSONALITY_PROFILES } from '../src/core/personality_engine';

describe('PersonalityEngine', () => {
  it('loads distinct profiles for all personalities', () => {
    const sage = PersonalityEngine.getProfile('SAGE');
    const coach = PersonalityEngine.getProfile('COACH');
    const playful = PersonalityEngine.getProfile('PLAYFUL');
    const cyberpunk = PersonalityEngine.getProfile('CYBERPUNK');

    expect(sage.title).toContain('Zen');
    expect(coach.title).toContain('Coach');
    expect(playful.title).toContain('Jester');
    expect(cyberpunk.title).toContain('Netrunner');
  });

  it('formats text according to personality styles', () => {
    const text = 'Keep moving forward';
    const sageText = PersonalityEngine.formatResponse(text, 'SAGE');
    const coachText = PersonalityEngine.formatResponse(text, 'COACH');
    const cyberText = PersonalityEngine.formatResponse(text, 'CYBERPUNK');

    expect(sageText).toContain('🌿');
    expect(coachText).toContain('KEEP MOVING FORWARD');
    expect(cyberText).toContain('[SYS.AI]');
  });

  it('retrieves quotes accurately', () => {
    const quote = PersonalityEngine.getRandomProverb('SAGE');
    expect(typeof quote).toBe('string');
    expect(quote.length).toBeGreaterThan(10);
  });
});
