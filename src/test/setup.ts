import { vi } from 'vitest';

// Mock environment variables
process.env['NODE_ENV'] = 'test';

// Mock mongoose connection
vi.mock('mongoose', () => ({
  default: {
    connect: vi.fn(),
    connection: {
      readyState: 1,
      on: vi.fn(),
      once: vi.fn(),
    },
  },
  Schema: vi.fn(),
  model: vi.fn(),
}));

// Global test utilities
global.console = {
  ...console,
  // Suppress console.error in tests unless needed
  error: vi.fn(),
  log: vi.fn(),
};