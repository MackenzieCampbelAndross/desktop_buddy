import React, { useState } from 'react';
import { useBuddyStore } from '../core/buddy_store';
import { MemoryVault } from '../core/memory_vault';
import { Brain, Check, X, Trash2, Plus, ShieldCheck, AlertCircle } from 'lucide-react';

export const MemoryManager: React.FC = () => {
  const { memories, approveMemory, rejectMemory, deleteMemory } = useBuddyStore();
  const [newKey, setNewKey] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'PREFERENCE' | 'TASK' | 'NOTE' | 'INSIGHT'>('PREFERENCE');
  const [isCreating, setIsCreating] = useState(false);

  const approvedMemories = memories.filter((m) => m.isApproved);
  const pendingMemories = memories.filter((m) => !m.isApproved);

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newContent.trim()) return;

    const mem = MemoryVault.createMemory(newKey.trim(), newContent.trim(), newCategory, true);
    useBuddyStore.setState((state) => ({ memories: [mem, ...state.memories] }));
    setNewKey('');
    setNewContent('');
    setIsCreating(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              <span>User-Approved Memory Vault</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Zero unwanted memory: memories are only retained with your explicit consent
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/50 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isCreating ? 'Cancel' : 'Add Memory'}</span>
        </button>
      </div>

      {/* Manual Memory Form */}
      {isCreating && (
        <form onSubmit={handleCreateMemory} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Memory Key / Identifier</label>
              <input
                type="text"
                required
                placeholder="e.g. coffee_order"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:ring-2 focus:ring-purple-500"
              >
                <option value="PREFERENCE">Preference</option>
                <option value="TASK">Task</option>
                <option value="NOTE">Note</option>
                <option value="INSIGHT">Insight</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Memory Content</label>
            <input
              type="text"
              required
              placeholder="e.g. Prefers oat milk flat white with no sugar"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold"
            >
              Save Approved Memory
            </button>
          </div>
        </form>
      )}

      {/* Pending User Approval Section */}
      {pendingMemories.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <span>Memories Suggested from Chat (Awaiting Your Approval)</span>
          </div>
          <div className="space-y-2">
            {pendingMemories.map((m) => (
              <div
                key={m.id}
                className="p-3 bg-amber-950/20 border border-amber-700/40 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{m.content}</div>
                  <div className="text-[10px] text-amber-400/80 mt-0.5">
                    Category: {m.category} • Confidence: {(m.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => approveMemory(m.id)}
                    className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-600/50 flex items-center gap-1 font-semibold"
                    title="Approve Memory"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => rejectMemory(m.id)}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-700/50"
                    title="Reject Memory"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Memories List */}
      <div className="space-y-2.5">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Approved Memories ({approvedMemories.length})
        </div>

        {approvedMemories.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No approved memories currently stored.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {approvedMemories.map((m) => (
              <div
                key={m.id}
                className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start justify-between gap-3 text-xs group hover:border-purple-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                      {m.category}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{m.key}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{m.content}</p>
                </div>

                <button
                  onClick={() => deleteMemory(m.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors shrink-0"
                  title="Delete memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
