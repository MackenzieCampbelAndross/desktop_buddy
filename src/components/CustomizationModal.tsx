import React, { useState } from 'react';
import { useBuddyStore } from '../core/buddy_store';
import { BuddySpecies, PersonalityType, AccessoryType, HabitatTheme } from '../types';
import { X, Palette, Sparkles } from 'lucide-react';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SPECIES_OPTIONS: Array<{ value: BuddySpecies; label: string; icon: string }> = [
  { value: 'CYBER_CAT', label: 'Cyber Cat', icon: '🐱' },
  { value: 'COSMIC_OWL', label: 'Cosmic Owl', icon: '🦉' },
  { value: 'STAR_SPRITE', label: 'Star Sprite', icon: '✨' },
  { value: 'ROBO_PUP', label: 'Robo Pup', icon: '🐶' }
];

const PERSONALITY_OPTIONS: Array<{ value: PersonalityType; label: string; desc: string }> = [
  { value: 'SAGE', label: 'Zen Sage', desc: 'Mindful, tranquil, and philosophical guide' },
  { value: 'COACH', label: 'Sprint Coach', desc: 'Energetic, discipline-focused, high accountability' },
  { value: 'PLAYFUL', label: 'Playful Jester', desc: 'Humorous, witty banter, cheerful micro-breaks' },
  { value: 'CYBERPUNK', label: 'Netrunner AI', desc: 'Tech-savvy hacker familiar with terminal telemetry' }
];

const ACCESSORIES: AccessoryType[] = ['NONE', 'TOP_HAT', 'HEADPHONES', 'SUNGLASSES', 'BOWTIE'];
const HABITATS: Array<{ value: HabitatTheme; label: string }> = [
  { value: 'CYBER_ROOM', label: 'Cyber Room' },
  { value: 'COZY_CAFE', label: 'Cozy Cafe' },
  { value: 'STARLIT_MEADOW', label: 'Starlit Meadow' },
  { value: 'ZEN_GARDEN', label: 'Zen Garden' }
];

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#3b82f6'];

export const CustomizationModal: React.FC<CustomizationModalProps> = ({ isOpen, onClose }) => {
  const { customization, personality, updateCustomization, setPersonality } = useBuddyStore();
  const [name, setName] = useState(customization.name);
  const [species, setSpecies] = useState<BuddySpecies>(customization.species);
  const [pers, setPers] = useState<PersonalityType>(personality);
  const [accessory, setAccessory] = useState<AccessoryType>(customization.accessory);
  const [habitat, setHabitat] = useState<HabitatTheme>(customization.habitat);
  const [color, setColor] = useState(customization.primaryColor);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomization({
      name: name.trim() || 'Sparky',
      species,
      accessory,
      habitat,
      primaryColor: color
    });
    setPersonality(pers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-6">
          <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Customize Desktop Buddy</h2>
            <p className="text-xs text-slate-400">Tailor companion personality, visuals, and habitat</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Companion Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Species */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Species</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SPECIES_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setSpecies(opt.value)}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    species === opt.value
                      ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Personality */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Personality Matrix</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PERSONALITY_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setPers(opt.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    pers === opt.value
                      ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Habitat & Accessory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Habitat Theme</label>
              <select
                value={habitat}
                onChange={(e) => setHabitat(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-purple-500"
              >
                {HABITATS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Accessory</label>
              <select
                value={accessory}
                onChange={(e) => setAccessory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-purple-500"
              >
                {ACCESSORIES.map((a) => (
                  <option key={a} value={a}>
                    {a.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Color Hue</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-600/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
