import { BuddyMood, AmbientContext } from '../types';

export interface MoodCalculationResult {
  mood: BuddyMood;
  energyLevel: number;
  hungerLevel: number;
  affectionScore: number;
}

export class MoodEngine {
  /**
   * Determine the current mood of the companion based on physiological states and context.
   */
  static evaluateMood(
    currentEnergy: number,
    currentHunger: number,
    currentAffection: number,
    context?: AmbientContext
  ): BuddyMood {
    // Check sleepiness first
    if (currentEnergy <= 25 || (context && context.timeOfDay === 'NIGHT' && context.isIdle)) {
      return 'SLEEPY';
    }

    // Check boredom
    if (currentHunger >= 75 || (context && context.isIdle && context.idleDurationMinutes > 20)) {
      return 'BORED';
    }

    // High energy and affection triggers excitement
    if (currentEnergy >= 75 && currentAffection >= 70) {
      return 'EXCITED';
    }

    // Active coding or designing fosters focused mood
    if (context && (context.currentActivity === 'CODING' || context.currentActivity === 'DESIGNING')) {
      return 'FOCUSED';
    }

    // High affection creates playful or happy state
    if (currentAffection >= 50) {
      return 'HAPPY';
    }

    return 'PLAYFUL';
  }

  /**
   * React to petting the buddy.
   */
  static handlePetting(
    energy: number,
    hunger: number,
    affection: number
  ): MoodCalculationResult {
    const newAffection = Math.min(100, affection + 12);
    const newEnergy = Math.min(100, energy + 5);
    const newMood = newAffection > 80 ? 'EXCITED' : 'HAPPY';
    return {
      mood: newMood,
      energyLevel: newEnergy,
      hungerLevel: hunger,
      affectionScore: newAffection
    };
  }

  /**
   * React to feeding the buddy.
   */
  static handleFeeding(
    energy: number,
    hunger: number,
    affection: number,
    treatQuality = 25
  ): MoodCalculationResult {
    const newHunger = Math.max(0, hunger - treatQuality);
    const newEnergy = Math.min(100, energy + 15);
    const newAffection = Math.min(100, affection + 8);
    const newMood = newHunger <= 20 ? 'HAPPY' : 'PLAYFUL';
    return {
      mood: newMood,
      energyLevel: newEnergy,
      hungerLevel: newHunger,
      affectionScore: newAffection
    };
  }

  /**
   * React to playing a minigame.
   */
  static handlePlaying(
    energy: number,
    hunger: number,
    affection: number,
    score: number
  ): MoodCalculationResult {
    const energyCost = 15;
    const affectionGain = Math.min(25, 10 + Math.floor(score / 10));
    const newEnergy = Math.max(10, energy - energyCost);
    const newHunger = Math.min(100, hunger + 10);
    const newAffection = Math.min(100, affection + affectionGain);
    const newMood = newEnergy <= 25 ? 'SLEEPY' : 'EXCITED';
    return {
      mood: newMood,
      energyLevel: newEnergy,
      hungerLevel: newHunger,
      affectionScore: newAffection
    };
  }

  /**
   * Advance biological time simulation (decay energy and increase hunger).
   */
  static handleTimeTick(
    energy: number,
    hunger: number,
    affection: number,
    elapsedMinutes: number,
    context?: AmbientContext
  ): MoodCalculationResult {
    const energyDecay = elapsedMinutes * 0.5;
    const hungerIncrease = elapsedMinutes * 0.4;
    const affectionDecay = elapsedMinutes * 0.1;

    const newEnergy = Math.max(5, energy - energyDecay);
    const newHunger = Math.min(100, hunger + hungerIncrease);
    const newAffection = Math.max(0, affection - affectionDecay);
    const mood = this.evaluateMood(newEnergy, newHunger, newAffection, context);

    return {
      mood,
      energyLevel: Math.round(newEnergy),
      hungerLevel: Math.round(newHunger),
      affectionScore: Math.round(newAffection)
    };
  }
}
