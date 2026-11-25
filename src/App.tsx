import React, { useState } from 'react';
import { useBuddyStore } from './core/buddy_store';
import { BuddyCanvas } from './components/BuddyCanvas';
import { CompanionControls } from './components/CompanionControls';
import { ChatPanel } from './components/ChatPanel';
import { MemoryManager } from './components/MemoryManager';
import { ContextBar } from './components/ContextBar';
import { CustomizationModal } from './components/CustomizationModal';
import { FloatingWidget } from './components/FloatingWidget';
import { Bot, Palette, Minimize2, Brain, MessageSquare } from 'lucide-react';

export const App: React.FC = () => {
  const {
    customization,
    personality,
    mood,
    petBuddy,
    isFloatingOverlay,
    toggleFloatingOverlay
  } = useBuddyStore();

  const [activeTab, setActiveTab] = useState<'chat' | 'memories'>('chat');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  if (isFloatingOverlay) {
    return <FloatingWidget />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-purple-900/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                  Desktop Buddy
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Interactive Desktop Companion with Ambient Intelligence</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCustomizeOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Customize</span>
            </button>

            <button
              onClick={toggleFloatingOverlay}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 flex items-center gap-1.5 transition-all"
              title="Switch to compact floating desktop overlay"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Widget Mode</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        {/* Context & Telemetry Bar */}
        <ContextBar />

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Canvas & Physical Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center relative overflow-hidden group">
              <div className="w-full flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-slate-200">{customization.name}</span>
                <span className="text-purple-400 font-semibold uppercase">{personality}</span>
              </div>

              <BuddyCanvas
                species={customization.species}
                mood={mood}
                primaryColor={customization.primaryColor}
                accessory={customization.accessory}
                habitat={customization.habitat}
                width={300}
                height={280}
                onClick={petBuddy}
              />

              <div className="mt-3 text-center text-xs text-slate-400">
                Click character to pet • Reacts dynamically to your workflow
              </div>
            </div>

            {/* Companion Controls & Vitals */}
            <CompanionControls />
          </div>

          {/* Right Column: Chat Panel & User-Approved Memory Vault */}
          <div className="lg:col-span-7 space-y-4">
            {/* Tab Switcher */}
            <div className="flex space-x-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'chat'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Companion Chat</span>
              </button>

              <button
                onClick={() => setActiveTab('memories')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'memories'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>Memory Vault</span>
              </button>
            </div>

            {/* Active Tab View */}
            {activeTab === 'chat' ? <ChatPanel /> : <MemoryManager />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-5 text-center text-xs text-slate-600 bg-slate-950/80">
        <p>Desktop Buddy • AI Desktop Companion with Ambient Intelligence • Autonomous Software Production Pipeline</p>
      </footer>

      {/* Customization Modal */}
      <CustomizationModal isOpen={isCustomizeOpen} onClose={() => setIsCustomizeOpen(false)} />
    </div>
  );
};

export default App;
