import { useEffect, useState, useRef } from "preact/hooks";
import type { DimensionScores } from "@/core/types";
import { getRatingRule, type RatingRule } from "@/core/rating";
import { readResult } from "@/infra/result-storage";
import { navigate } from "@/app/router";
import { ScoreBars } from "@/components/ScoreBars";
import { ScoreSummary } from "@/components/ScoreSummary";
// @ts-ignore
import html2canvas from "html2canvas-pro";
// @ts-ignore
import QRCode from "qrcode";

interface ResultView {
  source: "new-assessment" | "share";
  score: number;
  rating: RatingRule;
  modifierId: string | null;
  modifierLabel: string | null;
  dimensions: DimensionScores;
  advantages: string[];
  losses: string[];
  annualCash?: number;
  annualLoadHours?: number;
  effectiveHourlyPay?: number;
  statsConsent: boolean;
}

function resolveResultView(): ResultView | null {
  const r = readResult();
  if (!r) return null;
  const rule = getRatingRule(r.rating);
  return {
    source: "new-assessment",
    score: r.score,
    rating: rule,
    modifierId: r.modifierId,
    modifierLabel: r.modifierLabel,
    dimensions: r.dimensions,
    advantages: r.advantages,
    losses: r.losses,
    annualCash: r.annualCash,
    annualLoadHours: r.annualLoadHours,
    effectiveHourlyPay: r.effectiveHourlyPay,
    statsConsent: r.statsConsent,
  };
}

// Inline Icon components matching the design draft
const IconChart = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "1.2em", height: "1.2em", marginRight: "6px", verticalAlign: "middle" }}
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconShare = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "1.2em", height: "1.2em", marginRight: "6px", verticalAlign: "middle" }}
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  score: number;
  rating: RatingRule;
  dimensions: DimensionScores;
}

function ShareModal({ open, onClose, score, rating, dimensions }: ShareModalProps) {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        window.location.origin + "/",
        {
          width: 60,
          margin: 0,
          color: {
            dark: "#1d1d1f",
            light: "#ffffff",
          },
        },
        (err: any) => {
          if (err) console.error(err);
        }
      );
    }
  }, [open]);

  if (!open) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + "/").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveImage = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `job-beast-test-rating-${rating.label.toLowerCase()}.png`;
      a.click();
    } catch (err) {
      console.error("生成图片失败", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>分享我的评级</h3>
          <button className="share-modal-close-btn" onClick={onClose} aria-label="关闭弹窗">
            ✕
          </button>
        </div>
        <div className="share-modal-body">
          <div className="share-card-container">
            {/* The premium share card itself */}
            <div className="share-card" ref={cardRef} id="share-card-element">
              <div className="share-card-header">
                <div className="share-card-brand">
                  <img src="/favicon.svg" alt="" aria-hidden="true" className="share-card-brand-icon" />
                  <span>牛马检测器</span>
                </div>
                <div className="share-card-score">
                  <span className="share-card-score-num">{Math.round(score)}</span>
                  <span className="share-card-score-unit">分</span>
                </div>
              </div>
              
              <div className="share-card-hero">
                <span className={`sticker sticker-${rating.id}`}>
                  {rating.label}
                </span>
                <p>{rating.summary}</p>
              </div>

              <div className="share-card-bars">
                <ScoreBars dimensions={dimensions} />
              </div>

              <div className="share-card-footer">
                <div className="share-card-footer-info">
                  <div className="share-card-footer-title">长按扫码，测测你的岗位</div>
                  <div className="share-card-footer-desc">本地安全计算 · 隐私保护</div>
                </div>
                <div className="share-card-qr-wrapper">
                  <canvas ref={qrCanvasRef} className="share-card-qr-canvas" />
                </div>
              </div>
            </div>
          </div>

          <div className="share-modal-actions">
            <button className="btn btn-secondary" onClick={handleCopyLink}>
              {copied ? "已复制链接" : "复制链接"}
            </button>
            <button className="btn btn-primary" onClick={handleSaveImage} disabled={saving}>
              {saving ? "正在生成..." : "保存图片"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResultPage() {
  const [data] = useState<ResultView | null>(resolveResultView);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (!data) {
      navigate("/score", true);
    }
  }, [data]);

  const onShare = () => {
    setShareModalOpen(true);
  };

  const handleViewReport = () => {
    navigate("/report");
  };

  if (!data) {
    return (
      <main
        className="page-main"
        id="main"
        data-qoder-id="qel-main-825d47d7"
        data-qoder-source='{"qoderId":"qel-main-825d47d7","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"main","loc":{"line":991,"column":5}}'
      >
        <div
          className="container page-section"
          data-component="ResultPage"
          data-qoder-id="qel-resultpage-2daf0831"
          data-qoder-source='{"qoderId":"qel-resultpage-2daf0831","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"resultpage","loc":{"line":992,"column":7}}'
        >
          <div
            className="empty"
            data-qoder-id="qel-empty-b6a0c1da"
            data-qoder-source='{"qoderId":"qel-empty-b6a0c1da","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"empty","loc":{"line":981,"column":11}}'
          >
            <h2
              data-qoder-id="qel-h2-f23e71db"
              data-qoder-source='{"qoderId":"qel-h2-f23e71db","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"h2","loc":{"line":982,"column":13}}'
            >
              正在计算结果
            </h2>
            <p
              className="muted"
              data-qoder-id="qel-muted-32cd3b35"
              data-qoder-source='{"qoderId":"qel-muted-32cd3b35","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"muted","loc":{"line":983,"column":13}}'
            >
              请稍候……
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="page-main"
      id="main"
      data-qoder-id="qel-main-825d47d7"
      data-qoder-source='{"qoderId":"qel-main-825d47d7","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"main","loc":{"line":991,"column":5}}'
    >
      <div
        className="container page-section"
        data-component="ResultPage"
        data-qoder-id="qel-resultpage-2daf0831"
        data-qoder-source='{"qoderId":"qel-resultpage-2daf0831","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"resultpage","loc":{"line":992,"column":7}}'
      >
        <ScoreSummary
          score={data.score}
          rating={data.rating}
          modifierLabel={data.modifierLabel}
          data-qoder-id="qel-scoresummary-4d35147f"
          data-qoder-source='{"qoderId":"qel-scoresummary-4d35147f","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"scoresummary","loc":{"line":993,"column":9}}'
        />

        <section
          className="result-section"
          data-qoder-id="qel-result-section-c92d1c6e"
          data-qoder-source='{"qoderId":"qel-result-section-c92d1c6e","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"result-section","loc":{"line":995,"column":9}}'
        >
          <h3
            data-qoder-id="qel-h3-27a4bceb"
            data-qoder-source='{"qoderId":"qel-h3-27a4bceb","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"h3","loc":{"line":996,"column":11}}'
          >
            评级解读
          </h3>
          <p
            className="muted"
            style={{ lineHeight: "1.65", fontSize: "var(--fs-base)" }}
            data-qoder-id="qel-muted-28caece0"
            data-qoder-source='{"qoderId":"qel-muted-28caece0","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"muted","loc":{"line":997,"column":11}}'
          >
            {data.rating.mainCopy}
          </p>
        </section>

        <section
          className="result-section"
          data-qoder-id="qel-result-section-c62f564c"
          data-qoder-source='{"qoderId":"qel-result-section-c62f564c","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"result-section","loc":{"line":1002,"column":9}}'
        >
          <h3
            data-qoder-id="qel-h3-a2a7bd23"
            data-qoder-source='{"qoderId":"qel-h3-a2a7bd23","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"h3","loc":{"line":1003,"column":11}}'
          >
            七维度得分
          </h3>
          <ScoreBars
            dimensions={data.dimensions}
            data-qoder-id="qel-scorebars-ecc17f32"
            data-qoder-source='{"qoderId":"qel-scorebars-ecc17f32","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"scorebars","loc":{"line":1004,"column":11}}'
          />
        </section>

        {(data.advantages.length > 0 || data.losses.length > 0) && (
          <section
            className="result-section"
            data-qoder-id="qel-result-section-c32f5193"
            data-qoder-source='{"qoderId":"qel-result-section-c32f5193","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"result-section","loc":{"line":1007,"column":9}}'
          >
            <h3
              data-qoder-id="qel-h3-a7a7c502"
              data-qoder-source='{"qoderId":"qel-h3-a7a7c502","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"h3","loc":{"line":1008,"column":11}}'
            >
              关键发现
            </h3>
            {data.advantages.length > 0 && (
              <ul
                className="advantage-list"
                data-qoder-id="qel-advantage-list-582c95b6"
                data-qoder-source='{"qoderId":"qel-advantage-list-582c95b6","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"advantage-list","loc":{"line":1010,"column":13}}'
              >
                {data.advantages.map((a, i) => (
                  <li
                    key={i}
                    data-qoder-id="qel-li-26ee8f40"
                    data-qoder-source='{"qoderId":"qel-li-26ee8f40","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"li","loc":{"line":1011,"column":48}}'
                  >
                    {a}
                  </li>
                ))}
              </ul>
            )}
            {data.losses.length > 0 && (
              <ul
                className="loss-list"
                style={{ marginTop: "8px" }}
                data-qoder-id="qel-loss-list-66231cf2"
                data-qoder-source='{"qoderId":"qel-loss-list-66231cf2","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"loss-list","loc":{"line":1015,"column":13}}'
              >
                {data.losses.map((l, i) => (
                  <li
                    key={i}
                    data-qoder-id="qel-li-34eea54a"
                    data-qoder-source='{"qoderId":"qel-li-34eea54a","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"li","loc":{"line":1016,"column":44}}'
                  >
                    {l}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {data.source !== "share" && typeof data.annualCash === "number" && (
          <section
            className="result-section"
            data-qoder-id="qel-result-section-4d326968"
            data-qoder-source='{"qoderId":"qel-result-section-4d326968","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"result-section","loc":{"line":1021,"column":9}}'
          >
            <h3
              data-qoder-id="qel-h3-33c76211"
              data-qoder-source='{"qoderId":"qel-h3-33c76211","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"h3","loc":{"line":1022,"column":11}}'
            >
              经济换算
            </h3>
            <div
              className="dim-grid"
              data-qoder-id="qel-dim-grid-4444b3d8"
              data-qoder-source='{"qoderId":"qel-dim-grid-4444b3d8","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"dim-grid","loc":{"line":1023,"column":11}}'
            >
              <div
                className="dim-row"
                data-qoder-id="qel-dim-row-0dbe55e9"
                data-qoder-source='{"qoderId":"qel-dim-row-0dbe55e9","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"dim-row","loc":{"line":1024,"column":13}}'
              >
                <span
                  className="dim-name"
                  data-qoder-id="qel-dim-name-f230242e"
                  data-qoder-source='{"qoderId":"qel-dim-name-f230242e","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"dim-name","loc":{"line":1025,"column":15}}'
                >
                  年现金总收入
                </span>
                <span
                  className="dim-weight"
                  data-qoder-id="qel-dim-weight-db82103a"
                  data-qoder-source='{"qoderId":"qel-dim-weight-db82103a","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"dim-weight","loc":{"line":1026,"column":15}}'
                >
                  {data.annualCash.toLocaleString()} 元
                </span>
              </div>
              <div
                className="dim-row"
                data-qoder-id="qel-dim-row-10be5aa2"
                data-qoder-source='{"qoderId":"qel-dim-row-10be5aa2","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"dim-row","loc":{"line":1028,"column":13}}'
              >
                <span
                  className="dim-name"
                  data-qoder-id="qel-dim-name-f130229b"
                  data-qoder-source='{"qoderId":"qel-dim-name-f130229b","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"dim-name","loc":{"line":1029,"column":15}}'
                >
                  年总工时（含通勤+待命）
                </span>
                <span
                  className="dim-weight"
                  data-qoder-id="qel-dim-weight-d081fee9"
                  data-qoder-source='{"qoderId":"qel-dim-weight-d081fee9","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"dim-weight","loc":{"line":1030,"column":15}}'
                >
                  {data.annualLoadHours?.toLocaleString()} 小时
                </span>
              </div>
              <div
                className="dim-row"
                data-qoder-id="qel-dim-row-13be5f5b"
                data-qoder-source='{"qoderId":"qel-dim-row-13be5f5b","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"dim-row","loc":{"line":1032,"column":13}}'
              >
                <span
                  className="dim-name"
                  data-qoder-id="qel-dim-name-5c3309a3"
                  data-qoder-source='{"qoderId":"qel-dim-name-5c3309a3","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"dim-name","loc":{"line":1033,"column":15}}'
                >
                  等效时薪
                </span>
                <span
                  className="dim-weight"
                  data-qoder-id="qel-dim-weight-d37fc50b"
                  data-qoder-source='{"qoderId":"qel-dim-weight-d37fc50b","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"dim-weight","loc":{"line":1034,"column":15}}'
                >
                  {data.effectiveHourlyPay?.toLocaleString()} 元/时
                </span>
              </div>
            </div>
          </section>
        )}

        <section
          className="result-section"
          data-qoder-id="qel-result-section-5134ae4b"
          data-qoder-source='{"qoderId":"qel-result-section-5134ae4b","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"result-section","loc":{"line":1039,"column":9}}'
        >
          <h3
            data-qoder-id="qel-h3-b9ca739a"
            data-qoder-source='{"qoderId":"qel-h3-b9ca739a","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"h3","loc":{"line":1040,"column":11}}'
          >
            分享你的评级
          </h3>
          <div
            className="share-buttons"
            data-qoder-id="qel-share-buttons-a2f1b761"
            data-qoder-source='{"qoderId":"qel-share-buttons-a2f1b761","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"share-buttons","loc":{"line":1041,"column":11}}'
          >
            <button
              className="btn btn-primary"
              onClick={onShare}
              data-qoder-id="qel-btn-4b730074"
              data-qoder-source='{"qoderId":"qel-btn-4b730074","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"btn","loc":{"line":1042,"column":13}}'
            >
              <IconShare />
              分享
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleViewReport}
              data-qoder-id="qel-btn-4d73039a"
              data-qoder-source='{"qoderId":"qel-btn-4d73039a","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"btn","loc":{"line":1046,"column":13}}'
            >
              <IconChart />
              查看全站分布
            </button>
          </div>
        </section>

        <section
          className="result-section"
          data-qoder-id="qel-result-section-4a34a346"
          data-qoder-source='{"qoderId":"qel-result-section-4a34a346","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"result-section","loc":{"line":1053,"column":9}}'
        >
          <button
            className="btn btn-ghost btn-block"
            onClick={() => navigate("/score")}
            data-qoder-id="qel-btn-d2afb9ef"
            data-qoder-source='{"qoderId":"qel-btn-d2afb9ef","filePath":"react-vite/src/App.jsx","componentName":"ResultPage","elementRole":"btn","loc":{"line":1054,"column":11}}'
          >
            重新鉴定
          </button>
        </section>

        {shareModalOpen && (
          <ShareModal
            open={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            score={data.score}
            rating={data.rating}
            dimensions={data.dimensions}
          />
        )}
      </div>
    </main>
  );
}
