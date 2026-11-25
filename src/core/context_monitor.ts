import { AmbientContext, ProactiveAlert } from '../types';

export class ContextMonitor {
  static getInitialContext(): AmbientContext {
    const hour = new Date().getHours();
    let timeOfDay: AmbientContext['timeOfDay'] = 'AFTERNOON';
    if (hour >= 5 && hour < 12) timeOfDay = 'MORNING';
    else if (hour >= 12 && hour < 17) timeOfDay = 'AFTERNOON';
    else if (hour >= 17 && hour < 22) timeOfDay = 'EVENING';
    else timeOfDay = 'NIGHT';

    return {
      activeApp: 'VS Code',
      isIdle: false,
      idleDurationMinutes: 0,
      currentActivity: 'CODING',
      timeOfDay,
      sessionMinutes: 25
    };
  }

  static mapAppToActivity(appName: string): AmbientContext['currentActivity'] {
    const lower = appName.toLowerCase();
    if (lower.includes('code') || lower.includes('studio') || lower.includes('terminal') || lower.includes('git')) {
      return 'CODING';
    }
    if (lower.includes('figma') || lower.includes('photoshop') || lower.includes('blender') || lower.includes('canva')) {
      return 'DESIGNING';
    }
    if (lower.includes('chrome') || lower.includes('firefox') || lower.includes('edge') || lower.includes('safari')) {
      return 'BROWSING';
    }
    if (lower.includes('steam') || lower.includes('game') || lower.includes('minecraft') || lower.includes('discord')) {
      return 'GAMING';
    }
    return 'BROWSING';
  }

  static checkProactiveAlerts(context: AmbientContext): ProactiveAlert[] {
    const alerts: ProactiveAlert[] = [];
    const now = Date.now();

    // 1. Hydration Alert (every 45 minutes)
    if (context.sessionMinutes >= 45 && context.sessionMinutes % 45 < 5) {
      alerts.push({
        id: `alert-hydration-${now}`,
        type: 'HYDRATION',
        message: '💧 Time for a water break! Your brain thrives on hydration.',
        suggestedAction: 'Take a sip of fresh water.',
        timestamp: now,
        dismissed: false
      });
    }

    // 2. Posture Check (every 60 minutes)
    if (context.sessionMinutes >= 60 && context.sessionMinutes % 60 < 5) {
      alerts.push({
        id: `alert-posture-${now}`,
        type: 'POSTURE',
        message: '🧘 Posture Check! Relax your shoulders, uncross your legs, and straighten your spine.',
        suggestedAction: 'Roll shoulders backward and align head with spine.',
        timestamp: now,
        dismissed: false
      });
    }

    // 3. Eye Rest: 20-20-20 Rule (every 20 minutes)
    if (context.sessionMinutes >= 20 && context.sessionMinutes % 20 < 3) {
      alerts.push({
        id: `alert-eyerest-${now}`,
        type: 'EYE_REST',
        message: '👀 20-20-20 Rule: Look at an object 20 feet away for 20 seconds to soothe your eyes.',
        suggestedAction: 'Gaze out a window or into the distance.',
        timestamp: now,
        dismissed: false
      });
    }

    // 4. Stretch Alert (over 90 minutes)
    if (context.sessionMinutes >= 90 && context.sessionMinutes % 90 < 5) {
      alerts.push({
        id: `alert-stretch-${now}`,
        type: 'STRETCH',
        message: '🤸 You have been crushing work for over 90 minutes! Stand up and do a quick 2-minute stretch.',
        suggestedAction: 'Stand up, shake out your arms, and take a brief walk.',
        timestamp: now,
        dismissed: false
      });
    }

    // 5. Late Night Wind-down Alert
    if (context.timeOfDay === 'NIGHT' && context.sessionMinutes > 30) {
      alerts.push({
        id: `alert-winddown-${now}`,
        type: 'WIND_DOWN',
        message: '🌙 It is late at night. Consider winding down soon to recharge for tomorrow.',
        suggestedAction: 'Wrap up your current branch and save your work.',
        timestamp: now,
        dismissed: false
      });
    }

    return alerts;
  }
}
