import React from 'react';
import { useBuddyStore } from '../core/buddy_store';
import { Monitor, Clock, X, Bell } from 'lucide-react';

const APPS = ['VS Code', 'Figma', 'Chrome', 'Spotify', 'Terminal', 'Discord'];

export const ContextBar: React.FC = () => {
  const { context, switchActiveApp, pendingAlerts, dismissAlert } = useBuddyStore();

  return (
    <div className="space-y-3">
      {/* Active App & Activity Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="p-2 rounded-xl bg-indigo-900/40 border border-indigo-500/30 text-indigo-300">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-400 font-medium">Simulated Active Window</div>
            <div className="font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
              <span>{context.activeApp}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/40 uppercase">
                {context.currentActivity}
              </span>
            </div>
          </div>
        </div>

        {/* Quick App Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          <span className="text-slate-500 mr-1 hidden sm:inline">Switch:</span>
          {APPS.map((app) => (
            <button
              key={app}
              onClick={() => switchActiveApp(app)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                context.activeApp === app
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {app}
            </button>
          ))}
        </div>

        {/* Session Time & Time of Day */}
        <div className="flex items-center gap-4 text-slate-400 shrink-0">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Session: <strong className="text-slate-200">{context.sessionMinutes}m</strong></span>
          </div>
          <span className="text-indigo-400 font-semibold">{context.timeOfDay}</span>
        </div>
      </div>

      {/* Proactive Health / Ambient Alerts */}
      {pendingAlerts.length > 0 && (
        <div className="space-y-2">
          {pendingAlerts.slice(0, 2).map((alert) => (
            <div
              key={alert.id}
              className="px-4 py-3 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 rounded-xl flex items-center justify-between text-xs shadow-lg animate-pulse"
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="font-bold text-purple-200">{alert.message}</span>
                  <p className="text-[11px] text-slate-300 mt-0.5">{alert.suggestedAction}</p>
                </div>
              </div>

              <button
                onClick={() => dismissAlert(alert.id)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-purple-900/50 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
