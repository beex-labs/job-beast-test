import { navigate } from "@/app/router";

const PRIVACY_POINTS = [
  {
    title: "本地计算优先",
    text: "你的收入、工时等所有输入数据在浏览器本地完成计算，不会上传到服务器。",
  },
  {
    title: "仅上传评级",
    text: "服务器只接收最终的评级名称（如\"牛马\"），用于聚合统计，不接收任何输入数据。",
  },
  {
    title: "不上传原始数据",
    text: "月收入、工时、通勤等敏感数字永远不会离开你的设备。",
  },
  {
    title: "无第三方追踪",
    text: "页面不嵌入 Google Analytics、百度统计等第三方追踪脚本。",
  },
  {
    title: "无 Cookie 追踪",
    text: "除了主题偏好（明/暗模式）外，不设置任何追踪 Cookie。",
  },
  {
    title: "草稿本地保存",
    text: "填写中的草稿保存在 sessionStorage，关闭标签页即清除。",
  },
  {
    title: "结果可分享但不泄露",
    text: "分享链接只编码评级结果和分数，不包含任何原始输入。",
  },
  {
    title: "统计数据聚合展示",
    text: "全站评级分布只显示聚合数字，无法回溯到个人。",
  },
  {
    title: "开源可审计",
    text: "前端代码和评分逻辑完全开源，可以自行审计数据处理流程。",
  },
  {
    title: "随时可删除",
    text: "你可以随时清除本地存储的数据，无需通知我们。",
  },
];

export default function PrivacyPage() {
  return (
    <main
      className="page-main"
      id="main"
      data-qoder-id="qel-main-825d47d7"
      data-qoder-source='{"qoderId":"qel-main-825d47d7","filePath":"react-vite/src/App.jsx","componentName":"App","elementRole":"main","loc":{"line":1271,"column":5}}'
    >
      <div
        className="container page-section"
        data-component="PrivacyPage"
        data-qoder-id="qel-privacypage-37ca44b0"
        data-qoder-source='{"qoderId":"qel-privacypage-37ca44b0","filePath":"react-vite/src/App.jsx","componentName":"PrivacyPage","elementRole":"privacypage","loc":{"line":1156,"column":7}}'
      >
        <section
          className="about-section"
          data-qoder-id="qel-about-section-4d055e5d"
          data-qoder-source='{"qoderId":"qel-about-section-4d055e5d","filePath":"react-vite/src/App.jsx","componentName":"PrivacyPage","elementRole":"about-section","loc":{"line":1157,"column":9}}'
        >
          <h2
            data-qoder-id="qel-h2-4bcd447e"
            data-qoder-source='{"qoderId":"qel-h2-4bcd447e","filePath":"react-vite/src/App.jsx","componentName":"PrivacyPage","elementRole":"h2","loc":{"line":1158,"column":11}}'
          >
            隐私宣言
          </h2>
          <p
            data-qoder-id="qel-p-dab9caaa"
            data-qoder-source='{"qoderId":"qel-p-dab9caaa","filePath":"react-vite/src/App.jsx","componentName":"PrivacyPage","elementRole":"p","loc":{"line":1159,"column":11}}'
          >
            我们对待你的数据有 10 条原则，从设计层面确保隐私优先。
          </p>
        </section>

        <section
          className="about-section"
          data-qoder-id="qel-about-section-d3fde41d"
          data-qoder-source='{"qoderId":"qel-about-section-d3fde41d","filePath":"react-vite/src/App.jsx","componentName":"PrivacyPage","elementRole":"about-section","loc":{"line":1162,"column":9}}'
        >
          <ol
            className="privacy-list"
            data-qoder-id="qel-privacy-list-391cd8da"
            data-qoder-source='{"qoderId":"qel-privacy-list-391cd8da","filePath":"react-vite/src/App.jsx","componentName":"PrivacyPage","elementRole":"privacy-list","loc":{"line":1163,"column":11}}'
          >
            {PRIVACY_POINTS.map((p, i) => (
              <li
                key={i}
                data-qoder-id="qel-li-063fd2b5"
                data-qoder-source='{"qoderId":"qel-li-063fd2b5","filePath":"react-vite/src/App.jsx","componentName":"PrivacyPage","elementRole":"li","loc":{"line":1165,"column":15}}'
              >
                <strong
                  data-qoder-id="qel-strong-93e3a134"
                  data-qoder-source='{"qoderId":"qel-strong-93e3a134","filePath":"react-vite/src/App.jsx","componentName":"PrivacyPage","elementRole":"strong","loc":{"line":1166,"column":17}}'
                >
                  {p.title}
                </strong>
                {p.text}
              </li>
            ))}
          </ol>
        </section>

        <section
          className="about-section"
          data-qoder-id="qel-about-section-cffdddd1"
          data-qoder-source='{"qoderId":"qel-about-section-cffdddd1","filePath":"react-vite/src/App.jsx","componentName":"PrivacyPage","elementRole":"about-section","loc":{"line":1173,"column":9}}'
        >
          <button
            className="btn btn-primary"
            onClick={() => navigate("/score")}
            data-qoder-id="qel-btn-c7cadc14"
            data-qoder-source='{"qoderId":"qel-btn-c7cadc14","filePath":"react-vite/src/App.jsx","componentName":"PrivacyPage","elementRole":"btn","loc":{"line":1174,"column":11}}'
          >
            放心开始鉴定
          </button>
        </section>
      </div>
    </main>
  );
}
