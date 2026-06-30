import { navigate } from "@/app/router";
import { SITE } from "@/lib/site";

const DIMENSION_WEIGHTS = [
  { name: "收入回报", weight: "25%" },
  { name: "时间消耗", weight: "20%" },
  { name: "工作边界", weight: "15%" },
  { name: "成长价值", weight: "15%" },
  { name: "稳定程度", weight: "10%" },
  { name: "自由程度", weight: "10%" },
  { name: "福利体验", weight: "5%" },
];

export default function AboutPage() {
  return (
    <main
      className="page-main"
      id="main"
      data-qoder-id="qel-main-825d47d7"
      data-qoder-source='{"qoderId":"qel-main-825d47d7","filePath":"react-vite/src/App.jsx","componentName":"App","elementRole":"main","loc":{"line":1271,"column":5}}'
    >
      <div
        className="container page-section"
        data-component="AboutPage"
        data-qoder-id="qel-aboutpage-c537ae65"
        data-qoder-source='{"qoderId":"qel-aboutpage-c537ae65","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"aboutpage","loc":{"line":1106,"column":7}}'
      >
        <section
          className="about-section"
          data-qoder-id="qel-about-section-d6ffabcb"
          data-qoder-source='{"qoderId":"qel-about-section-d6ffabcb","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"about-section","loc":{"line":1107,"column":9}}'
        >
          <h2
            data-qoder-id="qel-h2-d6966dfe"
            data-qoder-source='{"qoderId":"qel-h2-d6966dfe","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"h2","loc":{"line":1108,"column":11}}'
          >
            关于{SITE.name}
          </h2>
          <p
            data-qoder-id="qel-p-6cf5a969"
            data-qoder-source='{"qoderId":"qel-p-6cf5a969","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"p","loc":{"line":1109,"column":11}}'
          >
            {SITE.description}
          </p>
          <p
            data-qoder-id="qel-p-69f5a4b0"
            data-qoder-source='{"qoderId":"qel-p-69f5a4b0","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"p","loc":{"line":1110,"column":11}}'
          >
            评级从「Shareholder」到「Loser」共 8 档，覆盖了从理想岗位到极端牛马的全光谱。无论你是想认真评估一份 Offer，还是想确认自己是不是该跑路了，都可以来测一测。
          </p>
        </section>

        <section
          className="about-section"
          data-qoder-id="qel-about-section-daffb217"
          data-qoder-source='{"qoderId":"qel-about-section-daffb217","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"about-section","loc":{"line":1113,"column":9}}'
        >
          <h2
            data-qoder-id="qel-h2-d29667b2"
            data-qoder-source='{"qoderId":"qel-h2-d29667b2","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"h2","loc":{"line":1114,"column":11}}'
          >
            七维度与权重
          </h2>
          <p
            data-qoder-id="qel-p-78f5bc4d"
            data-qoder-source='{"qoderId":"qel-p-78f5bc4d","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"p","loc":{"line":1115,"column":11}}'
          >
            评分基于七个维度的加权计算。每个维度有独立的计算逻辑，最终按权重汇总为 0-100 的总分。
          </p>
          <div
            className="dim-grid"
            data-qoder-id="qel-dim-grid-4b3da6d7"
            data-qoder-source='{"qoderId":"qel-dim-grid-4b3da6d7","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"dim-grid","loc":{"line":1116,"column":11}}'
          >
            {DIMENSION_WEIGHTS.map((d) => (
              <div
                className="dim-row"
                key={d.name}
                data-qoder-id="qel-dim-row-0670d716"
                data-qoder-source='{"qoderId":"qel-dim-row-0670d716","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"dim-row","loc":{"line":1118,"column":15}}'
              >
                <span
                  className="dim-name"
                  data-qoder-id="qel-dim-name-c636a62d"
                  data-qoder-source='{"qoderId":"qel-dim-name-c636a62d","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"dim-name","loc":{"line":1119,"column":17}}'
                >
                  {d.name}
                </span>
                <span
                  className="dim-weight"
                  data-qoder-id="qel-dim-weight-0e171c29"
                  data-qoder-source='{"qoderId":"qel-dim-weight-0e171c29","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"dim-weight","loc":{"line":1120,"column":17}}'
                >
                  {d.weight}
                </span>
              </div>
            ))}
          </div>
        </section>



        <section
          className="about-section"
          data-qoder-id="qel-about-section-4cfa555f"
          data-qoder-source='{"qoderId":"qel-about-section-4cfa555f","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"about-section","loc":{"line":1141,"column":9}}'
        >

          <img src="/beex-logo.svg" alt="BeeX Labs" className="about-beex-logo" />
          <p
            data-qoder-id="qel-p-66f122c9"
            data-qoder-source='{"qoderId":"qel-p-66f122c9","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"p","loc":{"line":1143,"column":11}}'
          >
            BeeX Labs 是一个由独立开发者用业余时间折腾出来的小项目。
          </p>
          <p
            data-qoder-id="qel-p-67f1245c"
            data-qoder-source='{"qoderId":"qel-p-67f1245c","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"p","loc":{"line":1144,"column":11}}'
          >
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/privacy")}
              data-qoder-id="qel-btn-dc1de511"
              data-qoder-source='{"qoderId":"qel-btn-dc1de511","filePath":"react-vite/src/App.jsx","componentName":"AboutPage","elementRole":"btn","loc":{"line":1145,"column":13}}'
            >
              查看隐私说明
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}
