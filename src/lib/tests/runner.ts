// Minimal browser test runner (guide §10.1–10.2).

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

export interface Suite {
  name: string;
  tests: { name: string; run: () => void | Promise<void> }[];
}

export type TestFn = () => void | Promise<void>;

export function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (!deepEqual(actual, expected)) {
    throw new Error(
      `${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ka = Object.keys(a as Record<string, unknown>);
    const kb = Object.keys(b as Record<string, unknown>);
    if (ka.length !== kb.length) return false;
    return ka.every(
      (k) =>
        k in (b as Record<string, unknown>) &&
        deepEqual(
          (a as Record<string, unknown>)[k],
          (b as Record<string, unknown>)[k]
        )
    );
  }
  // NaN-aware primitive fallback.
  return a !== a && b !== b;
}

export function assertTrue(value: boolean, message: string): void {
  if (!value) throw new Error(message);
}

export function assertApprox(
  actual: number,
  expected: number,
  eps: number,
  message: string
): void {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > eps) {
    throw new Error(
      `${message}: expected ~${expected} (±${eps}), got ${actual}`
    );
  }
}

export function assertLessEqual(actual: number, bound: number, message: string): void {
  if (!(actual <= bound)) {
    throw new Error(`${message}: expected <= ${bound}, got ${actual}`);
  }
}

export function assertGreaterEqual(
  actual: number,
  bound: number,
  message: string
): void {
  if (!(actual >= bound)) {
    throw new Error(`${message}: expected >= ${bound}, got ${actual}`);
  }
}

export async function runSuite(suite: Suite): Promise<TestResult[]> {
  const results: TestResult[] = [];
  for (const t of suite.tests) {
    try {
      await t.run();
      results.push({ name: t.name, passed: true });
    } catch (error) {
      results.push({
        name: t.name,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return results;
}
