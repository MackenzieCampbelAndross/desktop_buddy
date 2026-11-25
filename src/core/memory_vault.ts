import { UserMemory } from '../types';

export class MemoryVault {
  /**
   * Scan conversational input for potential facts, preferences, or tasks to propose for memory storage.
   */
  static extractPotentialMemories(input: string): Array<Omit<UserMemory, 'id' | 'createdAt'>> {
    const memories: Array<Omit<UserMemory, 'id' | 'createdAt'>> = [];
    const lower = input.toLowerCase();

    // 1. Detect preferences ("I like", "I prefer", "my favorite is")
    const prefRegex = /(?:i prefer|i love|i like|my favorite is|my preferred) (.+?)(?:\.|$)/i;
    const prefMatch = input.match(prefRegex);
    if (prefMatch && prefMatch[1]) {
      memories.push({
        key: 'preference_' + Date.now(),
        content: `User prefers: ${prefMatch[1].trim()}`,
        category: 'PREFERENCE',
        confidence: 0.9,
        isApproved: false // Needs explicit user approval!
      });
    }

    // 2. Detect tasks ("remember to", "need to", "todo:")
    const taskRegex = /(?:remember to|i need to|todo:|don't forget to) (.+?)(?:\.|$)/i;
    const taskMatch = input.match(taskRegex);
    if (taskMatch && taskMatch[1]) {
      memories.push({
        key: 'task_' + Date.now(),
        content: `Pending task: ${taskMatch[1].trim()}`,
        category: 'TASK',
        confidence: 0.85,
        isApproved: false
      });
    }

    // 3. Detect notes ("note that", "important:")
    const noteRegex = /(?:note that|keep in mind that|important:) (.+?)(?:\.|$)/i;
    const noteMatch = input.match(noteRegex);
    if (noteMatch && noteMatch[1]) {
      memories.push({
        key: 'note_' + Date.now(),
        content: `Note: ${noteMatch[1].trim()}`,
        category: 'NOTE',
        confidence: 0.8,
        isApproved: false
      });
    }

    return memories;
  }

  static createMemory(
    key: string,
    content: string,
    category: UserMemory['category'],
    isApproved = false
  ): UserMemory {
    return {
      id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      key,
      content,
      category,
      confidence: 1.0,
      isApproved,
      createdAt: Date.now()
    };
  }

  static queryRelevantMemories(memories: UserMemory[], query: string): UserMemory[] {
    const q = query.toLowerCase();
    return memories
      .filter((m) => m.isApproved)
      .filter((m) => m.content.toLowerCase().includes(q) || m.key.toLowerCase().includes(q));
  }
}
