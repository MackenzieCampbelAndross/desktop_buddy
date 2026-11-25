import { describe, it, expect } from 'vitest';
import { PersonalityEngine } from '../src/core/personality_engine';
import { MoodEngine } from '../src/core/mood_engine';
import { ContextMonitor } from '../src/core/context_monitor';
import { MemoryVault } from '../src/core/memory_vault';
import { CompanionAI } from '../src/core/companion_ai';

describe('Desktop Buddy End-to-End System Integration', () => {
  it('executes full interaction cycle: chat, memory extraction, mood shift, and proactive alerts', async () => {
    // 1. Initial desktop context
    const context = ContextMonitor.getInitialContext();
    context.activeApp = 'VS Code';
    context.sessionMinutes = 60; // Triggers posture check

    // 2. Check proactive alerts
    const alerts = ContextMonitor.checkProactiveAlerts(context);
    expect(alerts.some((a) => a.type === 'POSTURE')).toBe(true);

    // 3. User chat with memory intention
    const userUtterance = 'I prefer working with TypeScript and React.';
    const potentialMemories = MemoryVault.extractPotentialMemories(userUtterance);
    expect(potentialMemories.length).toBeGreaterThan(0);
    expect(potentialMemories[0].isApproved).toBe(false);

    // Approve the memory
    const approvedMemory = MemoryVault.createMemory(
      potentialMemories[0].key,
      potentialMemories[0].content,
      potentialMemories[0].category,
      true
    );

    // 4. Conversational AI response with personality alignment
    const aiResponse = await CompanionAI.generateReply(
      userUtterance,
      'COACH',
      'FOCUSED',
      context,
      [approvedMemory]
    );

    expect(aiResponse.reply).toContain('⚡');

    // 5. Physical interaction: Petting boosts affection and mood
    const petResult = MoodEngine.handlePetting(70, 30, 80);
    expect(petResult.affectionScore).toBe(92);
    expect(petResult.mood).toBe('EXCITED');
  });
});
