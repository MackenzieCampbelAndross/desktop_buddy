import { describe, it, expect } from 'vitest';
import { ContextMonitor } from '../src/core/context_monitor';
import { AmbientContext } from '../src/types';

describe('ContextMonitor', () => {
  it('maps desktop application names to activity categories', () => {
    expect(ContextMonitor.mapAppToActivity('VS Code')).toBe('CODING');
    expect(ContextMonitor.mapAppToActivity('Figma')).toBe('DESIGNING');
    expect(ContextMonitor.mapAppToActivity('Google Chrome')).toBe('BROWSING');
    expect(ContextMonitor.mapAppToActivity('Steam - Cyberpunk 2077')).toBe('GAMING');
  });

  it('triggers proactive health reminders when session thresholds are met', () => {
    const testContext: AmbientContext = {
      activeApp: 'VS Code',
      isIdle: false,
      idleDurationMinutes: 0,
      currentActivity: 'CODING',
      timeOfDay: 'AFTERNOON',
      sessionMinutes: 45 // 45m threshold
    };

    const alerts = ContextMonitor.checkProactiveAlerts(testContext);
    expect(alerts.length).toBeGreaterThan(0);
    const hydration = alerts.find((a) => a.type === 'HYDRATION');
    expect(hydration).toBeDefined();
    expect(hydration?.message).toContain('water');
  });

  it('triggers 20-20-20 eye rest alert every 20 minutes', () => {
    const testContext: AmbientContext = {
      activeApp: 'Figma',
      isIdle: false,
      idleDurationMinutes: 0,
      currentActivity: 'DESIGNING',
      timeOfDay: 'MORNING',
      sessionMinutes: 20
    };

    const alerts = ContextMonitor.checkProactiveAlerts(testContext);
    const eyeRest = alerts.find((a) => a.type === 'EYE_REST');
    expect(eyeRest).toBeDefined();
  });
});
