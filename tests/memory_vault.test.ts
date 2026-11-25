import { describe, it, expect } from 'vitest';
import { MemoryVault } from '../src/core/memory_vault';

describe('MemoryVault', () => {
  it('extracts potential user preferences requiring explicit approval', () => {
    const text = 'I prefer dark mode and high contrast themes.';
    const potentials = MemoryVault.extractPotentialMemories(text);

    expect(potentials.length).toBeGreaterThan(0);
    const pref = potentials[0];
    expect(pref.category).toBe('PREFERENCE');
    expect(pref.isApproved).toBe(false); // MUST be false initially!
    expect(pref.content).toContain('dark mode');
  });

  it('extracts pending tasks from conversational input', () => {
    const text = 'Remember to submit the quarterly audit report.';
    const potentials = MemoryVault.extractPotentialMemories(text);

    expect(potentials.length).toBeGreaterThan(0);
    const task = potentials[0];
    expect(task.category).toBe('TASK');
    expect(task.isApproved).toBe(false);
  });

  it('queries relevant approved memories while omitting unapproved ones', () => {
    const mem1 = MemoryVault.createMemory('theme', 'User likes dark themes', 'PREFERENCE', true);
    const mem2 = MemoryVault.createMemory('editor', 'User uses VS Code', 'PREFERENCE', false); // unapproved

    const results = MemoryVault.queryRelevantMemories([mem1, mem2], 'dark');
    expect(results.length).toBe(1);
    expect(results[0].key).toBe('theme');

    const unapprovedResults = MemoryVault.queryRelevantMemories([mem1, mem2], 'VS Code');
    expect(unapprovedResults.length).toBe(0);
  });
});
