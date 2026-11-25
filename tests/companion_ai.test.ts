import { describe, it, expect } from 'vitest';
import { CompanionAI } from '../src/core/companion_ai';
import { AmbientContext, UserMemory } from '../src/types';

describe('CompanionAI', () => {
  const dummyContext: AmbientContext = {
    activeApp: 'VS Code',
    isIdle: false,
    idleDurationMinutes: 0,
    currentActivity: 'CODING',
    timeOfDay: 'AFTERNOON',
    sessionMinutes: 30
  };

  const sampleMemories: UserMemory[] = [
    {
      id: 'm1',
      key: 'tea_preference',
      content: 'User drinks green tea during coding',
      category: 'PREFERENCE',
      confidence: 1.0,
      isApproved: true,
      createdAt: 1000
    }
  ];

  it('generates personality-conditioned responses for greetings', async () => {
    const resSage = await CompanionAI.generateReply('hello buddy', 'SAGE', 'HAPPY', dummyContext, sampleMemories);
    const resCoach = await CompanionAI.generateReply('hello buddy', 'COACH', 'HAPPY', dummyContext, sampleMemories);

    expect(resSage.reply).toContain('🌿');
    expect(resCoach.reply).toContain('⚡');
  });

  it('recalls approved memories when queried', async () => {
    const res = await CompanionAI.generateReply('what do you remember about me?', 'SAGE', 'HAPPY', dummyContext, sampleMemories);
    expect(res.reply).toContain('green tea');
  });

  it('provides supportive responses when user expresses exhaustion', async () => {
    const res = await CompanionAI.generateReply('I feel so tired and stressed today', 'SAGE', 'HAPPY', dummyContext, sampleMemories);
    expect(res.moodReaction).toBe('SLEEPY');
  });
});
