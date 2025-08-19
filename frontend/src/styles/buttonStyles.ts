// Reusable button styles for consistent UI across the app

export const compactButton = {
  mb: 4,
  ml: { xs: 0 },
  minWidth: { xs: 'auto!important', sm: '64px!important' },
  width: { xs: '64px', sm: 'auto' },
  height: { xs: '50px', sm: '64px' },
};

// Add more button styles as needed
export const smallIconButton = {
  minWidth: { xs: 'auto', sm: '40px' },
  width: { xs: '32px', sm: '40px' },
  height: { xs: '32px', sm: '40px' },
  p: { xs: 0.5, sm: 1 },
};

// Utility function to extend button styles
export const extendButton = (baseStyle: object, overrides: object) => ({
  ...baseStyle,
  ...overrides,
});
