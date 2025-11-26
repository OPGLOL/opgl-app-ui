// Test setup file for Vitest with React Testing Library
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock fetch globally
global.fetch = vi.fn();

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
