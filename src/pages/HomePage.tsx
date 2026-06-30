import { navigate } from "@/app/router";
import { SITE } from "@/lib/site";

export interface HomePageProps {
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export default function HomePage({
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: HomePageProps) {
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <main
      className={["page-main", className].filter(Boolean).join(" ")}
      id="main"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      <div
        className="container page-section"
        data-component="HomePage"
        data-qoder-id="qel-homepage-10c44c33"
        data-qoder-source='{"qoderId":"qel-homepage-10c44c33","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"homepage","loc":{"line":687,"column":7}}'
      >
        <section
          className="hero"
          data-qoder-id="qel-hero-092a0224"
          data-qoder-source='{"qoderId":"qel-hero-092a0224","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"hero","loc":{"line":688,"column":9}}'
        >
          <span
            className="eyebrow"
            data-qoder-id="qel-eyebrow-c99a98cb"
            data-qoder-source='{"qoderId":"qel-eyebrow-c99a98cb","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"eyebrow","loc":{"line":689,"column":11}}'
          >
            7 维度 · 本地计算 · 隐私优先
          </span>
          <h1
            data-qoder-id="qel-h1-34540607"
            data-qoder-source='{"qoderId":"qel-h1-34540607","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"h1","loc":{"line":690,"column":11}}'
          >
            测测你的岗位
            <br
              data-qoder-id="qel-br-2ed2b09c"
              data-qoder-source='{"qoderId":"qel-br-2ed2b09c","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"br","loc":{"line":690,"column":21}}'
            />
            到底是什么物种
          </h1>
          <p
            className="tagline"
            data-qoder-id="qel-tagline-0ddf4185"
            data-qoder-source='{"qoderId":"qel-tagline-0ddf4185","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"tagline","loc":{"line":691,"column":11}}'
          >
            {SITE.tagline}。从收入到自由，七个维度给岗位一个含金量评级。
          </p>
          <div
            className="cta-row"
            data-qoder-id="qel-cta-row-454e683e"
            data-qoder-source='{"qoderId":"qel-cta-row-454e683e","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"cta-row","loc":{"line":692,"column":11}}'
          >
            <button
              className="btn btn-primary btn-block"
              onClick={() => handleNavigate("/score")}
              data-qoder-id="qel-btn-24927dab"
              data-qoder-source='{"qoderId":"qel-btn-24927dab","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"btn","loc":{"line":693,"column":13}}'
            >
              开始鉴定
            </button>
            <button
              className="btn btn-secondary btn-block"
              onClick={() => handleNavigate("/about")}
              data-qoder-id="qel-btn-a1958109"
              data-qoder-source='{"qoderId":"qel-btn-a1958109","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"btn","loc":{"line":696,"column":13}}'
            >
              了解原理
            </button>
          </div>
        </section>

        <section
          className="feature-grid"
          data-qoder-id="qel-feature-grid-4d72dc62"
          data-qoder-source='{"qoderId":"qel-feature-grid-4d72dc62","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"feature-grid","loc":{"line":702,"column":9}}'
        >
          <div
            className="feature"
            data-qoder-id="qel-feature-fb3a2f38"
            data-qoder-source='{"qoderId":"qel-feature-fb3a2f38","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"feature","loc":{"line":703,"column":11}}'
          >
            <div
              className="feature-icon primary"
              data-qoder-id="qel-feature-icon-1d344845"
              data-qoder-source='{"qoderId":"qel-feature-icon-1d344845","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"feature-icon","loc":{"line":704,"column":13}}'
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" opacity="0.15" fill="currentColor" />
                <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
                <path d="M12 2v20M3.34 7l17.32 10M3.34 17L20.66 7" />
              </svg>
            </div>
            <h3
              data-qoder-id="qel-h3-c3fc119e"
              data-qoder-source='{"qoderId":"qel-h3-c3fc119e","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"h3","loc":{"line":705,"column":13}}'
            >
              七维度评估
            </h3>
            <p
              data-qoder-id="qel-p-f3fd18b9"
              data-qoder-source='{"qoderId":"qel-p-f3fd18b9","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"p","loc":{"line":706,"column":13}}'
            >
              收入、时间、边界、成长、稳定、自由、福利，全面量化你的岗位含金量。
            </p>
          </div>
          <div
            className="feature"
            data-qoder-id="qel-feature-003a3717"
            data-qoder-source='{"qoderId":"qel-feature-003a3717","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"feature","loc":{"line":708,"column":11}}'
          >
            <div
              className="feature-icon accent"
              data-qoder-id="qel-feature-icon-22345024"
              data-qoder-source='{"qoderId":"qel-feature-icon-22345024","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"feature-icon","loc":{"line":709,"column":13}}'
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" opacity="0.15" fill="currentColor" />
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
            </div>
            <h3
              data-qoder-id="qel-h3-aefe2f26"
              data-qoder-source='{"qoderId":"qel-h3-aefe2f26","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"h3","loc":{"line":710,"column":13}}'
            >
              本地计算
            </h3>
            <p
              data-qoder-id="qel-p-84f5ae37"
              data-qoder-source='{"qoderId":"qel-p-84f5ae37","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"p","loc":{"line":711,"column":13}}'
            >
              所有输入在浏览器本地完成计算，收入和工时等敏感数据不会上传到服务器。
            </p>
          </div>
          <div
            className="feature"
            data-qoder-id="qel-feature-f537e72f"
            data-qoder-source='{"qoderId":"qel-feature-f537e72f","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"feature","loc":{"line":713,"column":11}}'
          >
            <div
              className="feature-icon blue"
              data-qoder-id="qel-feature-icon-ad3be6ba"
              data-qoder-source='{"qoderId":"qel-feature-icon-ad3be6ba","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"feature-icon","loc":{"line":714,"column":13}}'
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
                <line x1="14" y1="4" x2="10" y2="20" />
              </svg>
            </div>
            <h3
              data-qoder-id="qel-h3-b3fe3705"
              data-qoder-source='{"qoderId":"qel-h3-b3fe3705","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"h3","loc":{"line":715,"column":13}}'
            >
              透明评分
            </h3>
            <p
              data-qoder-id="qel-p-81f5a97e"
              data-qoder-source='{"qoderId":"qel-p-81f5a97e","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"p","loc":{"line":716,"column":13}}'
            >
              评分逻辑完全开源，权重和公式公开透明，可以自行审计和验证。
            </p>
          </div>
        </section>
        <p
          className="home-disclaimer"
          data-qoder-id="qel-home-disclaimer-acfa67de"
          data-qoder-source='{"qoderId":"qel-home-disclaimer-acfa67de","filePath":"react-vite/src/App.jsx","componentName":"HomePage","elementRole":"home-disclaimer","loc":{"line":726,"column":9}}'
        >
          本工具仅供娱乐参考，不构成职业建议。评级基于你填写的数据，结果可能因主观判断而偏移。
        </p>
      </div>
    </main>
  );
}
