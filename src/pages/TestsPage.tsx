import { useState, useEffect } from "preact/hooks";
import { runAllSuites, type SuiteResult } from "@/lib/tests/index";
import { clearLocalRatingSubmission } from "@/infra/rating-submission-storage";

export default function TestsPage() {
  const [results, setResults] = useState<SuiteResult[] | null>(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      clearLocalRatingSubmission();
      const r = await runAllSuites();
      if (!cancelled) {
        setResults(r);
        setRunning(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (running || results === null) {
    return (
      <main
        className="page-main"
        id="main"
        data-qoder-id="qel-main-825d47d7"
        data-qoder-source='{"qoderId":"qel-main-825d47d7","filePath":"react-vite/src/App.jsx","componentName":"App","elementRole":"main","loc":{"line":1271,"column":5}}'
      >
        <div
          className="container page-section"
          data-component="TestsPage"
          data-qoder-id="qel-testspage-89bdd6be"
          data-qoder-source='{"qoderId":"qel-testspage-89bdd6be","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"testspage","loc":{"line":1186,"column":7}}'
        >
          <section
            className="about-section"
            data-qoder-id="qel-about-section-233b6f1c"
            data-qoder-source='{"qoderId":"qel-about-section-233b6f1c","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"about-section","loc":{"line":1187,"column":9}}'
          >
            <h2
              data-qoder-id="qel-h2-26653962"
              data-qoder-source='{"qoderId":"qel-h2-26653962","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"h2","loc":{"line":1188,"column":11}}'
            >
              浏览器内测试
            </h2>
            <p className="muted">运行中…</p>
          </section>
        </div>
      </main>
    );
  }

  const all = results.flatMap((r) => r.results);
  const total = all.length;
  const passed = all.filter((r) => r.passed).length;
  const isOk = passed === total;

  return (
    <main
      className="page-main"
      id="main"
      data-qoder-id="qel-main-825d47d7"
      data-qoder-source='{"qoderId":"qel-main-825d47d7","filePath":"react-vite/src/App.jsx","componentName":"App","elementRole":"main","loc":{"line":1271,"column":5}}'
    >
      <div
        className="container page-section"
        data-component="TestsPage"
        data-qoder-id="qel-testspage-89bdd6be"
        data-qoder-source='{"qoderId":"qel-testspage-89bdd6be","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"testspage","loc":{"line":1186,"column":7}}'
      >
        <section
          className="about-section"
          data-qoder-id="qel-about-section-233b6f1c"
          data-qoder-source='{"qoderId":"qel-about-section-233b6f1c","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"about-section","loc":{"line":1187,"column":9}}'
        >
          <h2
            data-qoder-id="qel-h2-26653962"
            data-qoder-source='{"qoderId":"qel-h2-26653962","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"h2","loc":{"line":1188,"column":11}}'
          >
            浏览器内测试
          </h2>
          <p
            className={`tests-summary ${isOk ? "is-ok" : "is-fail"}`}
            data-qoder-id="qel-tests-summary-806b5fa1"
            data-qoder-source='{"qoderId":"qel-tests-summary-806b5fa1","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"tests-summary","loc":{"line":1189,"column":11}}'
          >
            {passed} / {total} 通过
          </p>
        </section>

        {results.map((suite, idx) => (
          <section
            key={idx}
            className="tests-suite"
            data-qoder-id="qel-tests-suite-cf0d87ab"
            data-qoder-source='{"qoderId":"qel-tests-suite-cf0d87ab","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"tests-suite","loc":{"line":1191,"column":9}}'
          >
            <h3
              data-qoder-id="qel-h3-5a184385"
              data-qoder-source='{"qoderId":"qel-h3-5a184385","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"h3","loc":{"line":1192,"column":11}}'
            >
              {suite.name}
            </h3>
            <ul
              data-qoder-id="qel-ul-09063dc8"
              data-qoder-source='{"qoderId":"qel-ul-09063dc8","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"ul","loc":{"line":1193,"column":11}}'
            >
              {suite.results.map((r, itemIdx) => (
                <li
                  key={itemIdx}
                  className={r.passed ? "pass" : "fail"}
                  data-qoder-id="qel-pass-9855bbfd"
                  data-qoder-source='{"qoderId":"qel-pass-9855bbfd","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"pass","loc":{"line":1194,"column":13}}'
                >
                  <span
                    className="mark"
                    data-qoder-id="qel-mark-b4ec1071"
                    data-qoder-source='{"qoderId":"qel-mark-b4ec1071","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"mark","loc":{"line":1194,"column":34}}'
                  >
                    {r.passed ? "✓" : "✗"}
                  </span>
                  <span
                    className="name"
                    data-qoder-id="qel-name-1ddc7f54"
                    data-qoder-source='{"qoderId":"qel-name-1ddc7f54","filePath":"react-vite/src/App.jsx","componentName":"TestsPage","elementRole":"name","loc":{"line":1194,"column":65}}'
                  >
                    {r.name}
                  </span>
                  {r.error ? <span className="muted"> — {r.error}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
