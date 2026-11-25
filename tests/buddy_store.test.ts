import { describe, it, expect, beforeEach } from 'vitest';
import { useBuddyStore } from '../src/core/buddy_store';

describe('useBuddyStore', () => {
  beforeEach(() => {
    useBuddyStore.setState({
      energyLevel: 80,
      hungerLevel: 30,
      affectionScore: 60,
      mood: 'HAPPY',
      memories: [],
      chatHistory: [],
      pendingAlerts: []
    });
  });

  it('handles petting interaction and boosts affection', () => {
    const initialAffection = useBuddyStore.getState().affectionScore;
    useBuddyStore.getState().petBuddy();

    expect(useBuddyStore.getState().affectionScore).toBeGreaterThan(initialAffection);
  });

  it('handles feeding interaction and reduces hunger', () => {
    useBuddyStore.setState({ hungerLevel: 50 });
    useBuddyStore.getState().feedBuddy();

    expect(useBuddyStore.getState().hungerLevel).toBeLessThan(50);
  });

  it('manages user memory approval workflow', () => {
    useBuddyStore.setState({
      memories: [
        {
          id: 'mem-test',
          key: 'test_key',
          content: 'Test content',
          category: 'PREFERENCE',
          confidence: 0.9,
          isApproved: false,
          createdAt: 1000
        }
      ]
    });

    expect(useBuddyStore.getState().memories[0].isApproved).toBe(false);
    useBuddyStore.getState().approveMemory('mem-test');
    expect(useBuddyStore.getState().memories[0].isApproved).toBe(true);
  });

  it('toggles floating overlay widget mode', () => {
    expect(useBuddyStore.getState().isFloatingOverlay).toBe(false);
    useBuddyStore.getState().toggleFloatingOverlay();
    expect(useBuddyStore.getState().isFloatingOverlay).toBe(true);
  });
});
