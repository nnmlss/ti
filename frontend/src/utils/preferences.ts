/**
 * Direct localStorage utilities for user preferences
 * Simple, reliable preference storage without Redux complexity
 */

const STORAGE_KEYS = {
  HOME_VIEW: 'homeView',
  WIND_FILTER: 'windDirectionFilter',
  LANGUAGE: 'language',
} as const;

/**
 * Home view preference (map/list)
 */
export function getHomeView(): 'map' | 'list' {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HOME_VIEW);
    return stored === 'list' ? 'list' : 'map'; // default to 'map'
  } catch {
    return 'map';
  }
}

export function setHomeView(view: 'map' | 'list'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HOME_VIEW, view);
  } catch (error) {
    console.warn('Failed to save home view preference:', error);
  }
}

/**
 * Wind direction filter preference
 */
export function getWindDirectionFilter(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.WIND_FILTER);
  } catch {
    return null;
  }
}

export function setWindDirectionFilter(direction: string | null): void {
  try {
    if (direction === null) {
      localStorage.removeItem(STORAGE_KEYS.WIND_FILTER);
    } else {
      localStorage.setItem(STORAGE_KEYS.WIND_FILTER, direction);
    }
  } catch (error) {
    console.warn('Failed to save wind filter preference:', error);
  }
}

/**
 * Language preference
 */
export function getLanguage(): 'en' | 'bg' {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return stored === 'bg' ? 'bg' : 'en'; // default to 'en'
  } catch {
    return 'en';
  }
}

export function setLanguage(language: 'en' | 'bg'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  } catch (error) {
    console.warn('Failed to save language preference:', error);
  }
}

/**
 * Clear all preferences (reset to defaults)
 */
export function clearAllPreferences(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear preferences:', error);
  }
}