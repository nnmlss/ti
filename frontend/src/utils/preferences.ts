/**
 * Direct localStorage utilities for user preferences
 * Simple, reliable preference storage without Redux complexity
 */

const STORAGE_KEYS = {
  HOME_VIEW: 'homeView',
  WIND_FILTER: 'windDirectionFilter', 
  LANGUAGE: 'language',
  THEME: 'theme',
  FORM_DRAFTS: 'formDrafts',
  MAP_ZOOM: 'mapZoom',
  MAP_CENTER: 'mapCenter',
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
 * Theme preference (light/dark)
 */
export function getTheme(): 'light' | 'dark' | 'system' {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    return stored === 'light' || stored === 'dark' ? stored : 'system'; // default to 'system'
  } catch {
    return 'system';
  }
}

export function setTheme(theme: 'light' | 'dark' | 'system'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
  }
}

/**
 * Form draft persistence
 */
export function getFormDraft(formName: string): Record<string, unknown> | null {
  try {
    const drafts = localStorage.getItem(STORAGE_KEYS.FORM_DRAFTS);
    if (!drafts) return null;
    
    const parsed = JSON.parse(drafts);
    return parsed[formName] || null;
  } catch {
    return null;
  }
}

export function setFormDraft(formName: string, data: Record<string, unknown>): void {
  try {
    const drafts = localStorage.getItem(STORAGE_KEYS.FORM_DRAFTS);
    const parsed = drafts ? JSON.parse(drafts) : {};
    
    parsed[formName] = data;
    localStorage.setItem(STORAGE_KEYS.FORM_DRAFTS, JSON.stringify(parsed));
  } catch (error) {
    console.warn('Failed to save form draft:', error);
  }
}

export function clearFormDraft(formName: string): void {
  try {
    const drafts = localStorage.getItem(STORAGE_KEYS.FORM_DRAFTS);
    if (!drafts) return;
    
    const parsed = JSON.parse(drafts);
    delete parsed[formName];
    
    if (Object.keys(parsed).length === 0) {
      localStorage.removeItem(STORAGE_KEYS.FORM_DRAFTS);
    } else {
      localStorage.setItem(STORAGE_KEYS.FORM_DRAFTS, JSON.stringify(parsed));
    }
  } catch (error) {
    console.warn('Failed to clear form draft:', error);
  }
}

/**
 * Map state persistence
 */
export function getMapZoom(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MAP_ZOOM);
    return stored ? parseInt(stored, 10) : 8; // default zoom
  } catch {
    return 8;
  }
}

export function setMapZoom(zoom: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MAP_ZOOM, zoom.toString());
  } catch (error) {
    console.warn('Failed to save map zoom:', error);
  }
}

export function getMapCenter(): [number, number] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MAP_CENTER);
    return stored ? JSON.parse(stored) : [42.7, 25.5]; // Bulgaria center
  } catch {
    return [42.7, 25.5];
  }
}

export function setMapCenter(center: [number, number]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MAP_CENTER, JSON.stringify(center));
  } catch (error) {
    console.warn('Failed to save map center:', error);
  }
}

/**
 * Get all preferences as a summary object
 */
export function getAllPreferences() {
  return {
    homeView: getHomeView(),
    windFilter: getWindDirectionFilter(),
    language: getLanguage(),
    theme: getTheme(),
    mapZoom: getMapZoom(),
    mapCenter: getMapCenter(),
  };
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