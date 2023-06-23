import { expect, afterEach, vi, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';
import { connectAuthEmulator } from "firebase/auth"
import { firebase } from "./src/firebase/config"

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
beforeAll(() => {
  connectAuthEmulator(firebase.auth, "http://127.0.0.1:9099")
})

afterEach(() => {
  cleanup();
  vi.resetAllMocks()
});