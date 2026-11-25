import React from 'react';
import { useBuddyStore } from '../core/buddy_store';
import { Heart, Utensils, Gamepad2, Moon, Zap, FastForward } from 'lucide-react';

export const CompanionControls: React.FC = () => {
  const {
    energyLevel,
    hungerLevel,
    affectionScore,
    mood,
    petBuddy,
    feedBuddy,
    playMinigame,
    tickSimulation
  } = useBuddyStore();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Vitals Summary */}
      <div className="grid grid-cols-3 gap-3">
        {/* Energy */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Energy
            </span>
            <span className="text-amber-400">{energyLevel}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${energyLevel}%` }}
            />
          </div>
        </div>

        {/* Hunger */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-emerald-400" /> Fullness
            </span>
            <span className="text-emerald-400">{100 - hungerLevel}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, 100 - hungerLevel)}%` }}
            />
          </div>
        </div>

        {/* Affection */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> Affection
            </span>
            <span className="text-rose-400">{affectionScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-400 rounded-full transition-all duration-300"
              style={{ width: `${affectionScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mood Badge */}
      <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-slate-950/60 rounded-xl border border-slate-800">
        <span className="text-slate-400">Current Companion Mood:</span>
        <span className="font-bold uppercase tracking-wider text-purple-400">{mood}</span>
      </div>

      {/* Interactive Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <button
          onClick={petBuddy}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-950/40 border border-purple-700/50 hover:bg-purple-900/60 text-purple-200 text-xs font-semibold shadow-sm active:scale-95 transition-all"
        >
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Pet (+Affection)</span>
        </button>

        <button
          onClick={feedBuddy}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 hover:bg-emerald-900/60 text-emerald-200 text-xs font-semibold shadow-sm active:scale-95 transition-all"
        >
          <Utensils className="w-4 h-4 text-emerald-400" />
          <span>Feed Snack</span>
        </button>

        <button
          onClick={() => playMinigame(60)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-950/40 border border-indigo-700/50 hover:bg-indigo-900/60 text-indigo-200 text-xs font-semibold shadow-sm active:scale-95 transition-all"
        >
          <Gamepad2 className="w-4 h-4 text-indigo-400" />
          <span>Play Fetch</span>
        </button>

        <button
          onClick={() => tickSimulation(15)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-semibold shadow-sm active:scale-95 transition-all"
          title="Advance 15 minutes of desktop activity"
        >
          <FastForward className="w-4 h-4 text-amber-400" />
          <span>+15m Time</span>
        </button>
      </div>
    </div>
  );
};
