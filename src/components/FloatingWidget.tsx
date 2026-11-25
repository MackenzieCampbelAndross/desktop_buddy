import React, { useState } from 'react';
import { useBuddyStore } from '../core/buddy_store';
import { BuddyCanvas } from './BuddyCanvas';
import { Maximize2, Heart, MessageSquare } from 'lucide-react';

export const FloatingWidget: React.FC = () => {
  const {
    customization,
    mood,
    petBuddy,
    toggleFloatingOverlay,
    chatHistory
  } = useBuddyStore();

  const [position, setPosition] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const lastBuddyMsg = [...chatHistory].reverse().find((m) => m.sender === 'BUDDY');

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 220, e.clientX - dragStart.x)),
      y: Math.max(10, Math.min(window.innerHeight - 240, e.clientY - dragStart.y))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ right: `${position.x}px`, bottom: `${position.y}px` }}
      className="fixed z-50 flex flex-col items-end select-none cursor-grab active:cursor-grabbing animate-fade-in"
    >
      {/* Speech Bubble */}
      {lastBuddyMsg && (
        <div className="mb-2 max-w-xs bg-slate-900/95 border border-purple-500/40 text-slate-100 text-xs px-3.5 py-2 rounded-2xl rounded-br-none shadow-2xl backdrop-blur-md">
          <div className="font-bold text-purple-300 text-[10px] mb-0.5">{customization.name}:</div>
          <p className="line-clamp-2 leading-relaxed">{lastBuddyMsg.text}</p>
        </div>
      )}

      {/* Mini Companion Shell */}
      <div
        onMouseDown={handleMouseDown}
        className="w-48 bg-slate-950/90 border border-slate-800 rounded-3xl p-3 shadow-2xl backdrop-blur-lg flex flex-col items-center group relative hover:border-purple-500/50 transition-colors"
      >
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          <button
            onClick={toggleFloatingOverlay}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            title="Expand to Full Dashboard"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <BuddyCanvas
          species={customization.species}
          mood={mood}
          primaryColor={customization.primaryColor}
          accessory={customization.accessory}
          habitat={customization.habitat}
          width={150}
          height={150}
          className="rounded-2xl"
          onClick={petBuddy}
        />

        <div className="mt-2 flex items-center justify-between w-full px-1">
          <span className="text-xs font-bold text-slate-200">{customization.name}</span>
          <div className="flex gap-1">
            <button
              onClick={petBuddy}
              className="p-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-700/40"
              title="Pet buddy"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
            </button>
            <button
              onClick={toggleFloatingOverlay}
              className="p-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/40"
              title="Open Chat"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
