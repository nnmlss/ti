// Bulgarian error message mappings for user-friendly localized errors

export const errorMessages = {
  // Operation names mapping (from thunk action types to Bulgarian)
  operationNames: {
    loadSingleSite: 'Зареждане на мястото за летене',
    loadSites: 'Зареждането на информация',
    addSite: 'Добавянето на място',
    updateSite: 'Обновяването на място',
    deleteSite: 'Изтриването на място',
  },

  // Error messages mapping (from technical to user-friendly Bulgarian)
  messages: {
    'Network error: Unable to connect to server': 'Няма интернет връзка със сървъра',
    'CSRF token error: Failed to fetch CSRF token': 'Проблем със сигурността. CSRF защитата не е активна.',
    'Failed to fetch CSRF token': 'Проблем със сигурността. CSRF защитата не е активна.',
    'Route GET /api/csrf-token not found': 'CSRF защитата не е активна на сървъра.',
    'CSRF token error: Route GET /api/csrf-token not found': 'CSRF защитата не е активна на сървъра.',
    'Failed to load site': 'Неуспешно зареждане на сайта',
    'Failed to load sites': 'Не може да се заредят местата',
    'Failed to add site': 'Не може да се добави мястото',
    'Failed to update site': 'Не може да се обнови мястото',
    'Failed to delete site': 'Не може да се изтрие мястото',
    'An unexpected error occurred': 'Възникна неочаквана грешка',
    'Site not found': 'Мястото не е намерено',
    'Invalid request': 'Неvalidна заявка',
    'Server error': 'Грешка в сървъра',
  },

  // Default messages
  defaults: {
    operationName: 'Операцията',
    errorMessage: 'Възникна грешка',
  },
};

/**
 * Get localized operation name in Bulgarian
 */
export function getLocalizedOperationName(actionType: string): string {
  const operationKey = actionType.split('/').pop();
  if (
    operationKey &&
    errorMessages.operationNames[operationKey as keyof typeof errorMessages.operationNames]
  ) {
    return errorMessages.operationNames[
      operationKey as keyof typeof errorMessages.operationNames
    ];
  }

  // Fallback to English conversion for unmapped operations
  const fallback = actionType
    .split('/')
    .pop()
    ?.replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str: string) => str.toUpperCase())
    .trim();

  return fallback || errorMessages.defaults.operationName;
}

/**
 * Get localized error message in Bulgarian
 */
export function getLocalizedErrorMessage(errorMessage: string): string {
  // Check for exact matches first
  if (errorMessages.messages[errorMessage as keyof typeof errorMessages.messages]) {
    return errorMessages.messages[errorMessage as keyof typeof errorMessages.messages];
  }

  // Check for partial matches (e.g., "Failed to load site (404)")
  for (const [key, value] of Object.entries(errorMessages.messages)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  // Return original message if no translation found
  return errorMessage || errorMessages.defaults.errorMessage;
}
