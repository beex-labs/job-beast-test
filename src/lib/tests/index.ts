import { runSuite, type Suite, type TestResult } from "./runner";
import { scoreSuite } from "./score-tests";
import { ratingSuite } from "./rating-tests";
import { statsSuite } from "./stats-tests";
import { networkSuite, shareSuite, storageSuite } from "./client-tests";

export const SUITES: Suite[] = [
  scoreSuite,
  ratingSuite,
  statsSuite,
  shareSuite,
  storageSuite,
  networkSuite,
];

export interface SuiteResult {
  name: string;
  results: TestResult[];
}

export async function runAllSuites(
  onProgress?: (done: number, total: number) => void
): Promise<SuiteResult[]> {
  const out: SuiteResult[] = [];
  let done = 0;
  const total = SUITES.reduce((n, s) => n + s.tests.length, 0);
  for (const suite of SUITES) {
    const results = await runSuite(suite);
    out.push({ name: suite.name, results });
    done += suite.tests.length;
    onProgress?.(done, total);
  }
  return out;
}
