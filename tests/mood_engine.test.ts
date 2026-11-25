import { describe, it, expect } from 'vitest';
import { MoodEngine } from '../src/core/mood_engine';

describe('MoodEngine', () => {
  it('evaluates mood based on biological metrics and context', () => {
    // Low energy -> SLEEPY
    const sleepy = MoodEngine.evaluateMood(15, 20, 50);
    expect(sleepy).toBe('SLEEPY');

    // High hunger -> BORED
    const bored = MoodEngine.evaluateMood(60, 85, 30);
    expect(bored).toBe('BORED');

    // High energy and affection -> EXCITED
    const excited = MoodEngine.evaluateMood(85, 20, 85);
    expect(excited).toBe('EXCITED');
  });

  it('adjusts stats when petting buddy', () => {
    const res = MoodEngine.handlePetting(50, 40, 40);
    expect(res.affectionScore).toBe(52);
    expect(res.energyLevel).toBe(55);
    expect(res.mood).toBe('HAPPY');
  });

  it('adjusts stats when feeding buddy', () => {
    const res = MoodEngine.handleFeeding(40, 50, 40, 25);
    expect(res.hungerLevel).toBe(25);
    expect(res.energyLevel).toBe(55);
  });

  it('simulates time decay accurately', () => {
    const res = MoodEngine.handleTimeTick(80, 20, 70, 30);
    // 30 min: energy -15, hunger +12, affection -3
    expect(res.energyLevel).toBe(65);
    expect(res.hungerLevel).toBe(32);
    expect(res.affectionScore).toBe(67);
  });
});
