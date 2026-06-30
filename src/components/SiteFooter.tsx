import { SITE } from "@/lib/site";
import { navigate } from "@/app/router";

export interface SiteFooterProps {
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export function SiteFooter({
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: SiteFooterProps) {
  const handleNavigate = (e: Event, href: string) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <footer
      className={["app-footer", className].filter(Boolean).join(" ")}
      data-component="SiteFooter"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      <div
        className="footer-inner"
        data-qoder-id="qel-footer-inner-67aff85f"
        data-qoder-source='{"qoderId":"qel-footer-inner-67aff85f","filePath":"react-vite/src/App.jsx","componentName":"SiteFooter","elementRole":"footer-inner","loc":{"line":471,"column":7}}'
      >
        <p
          data-qoder-id="qel-p-9d3f2057"
          data-qoder-source='{"qoderId":"qel-p-9d3f2057","filePath":"react-vite/src/App.jsx","componentName":"SiteFooter","elementRole":"p","loc":{"line":472,"column":9}}'
        >
          {SITE.name} · {SITE.nameEn} v{SITE.version}
        </p>
        <p
          data-qoder-id="qel-p-9e3f21ea"
          data-qoder-source='{"qoderId":"qel-p-9e3f21ea","filePath":"react-vite/src/App.jsx","componentName":"SiteFooter","elementRole":"p","loc":{"line":473,"column":9}}'
        >
          <a
            href="/privacy"
            onClick={(e) => handleNavigate(e, "/privacy")}
            data-qoder-id="qel-a-02ed0cad"
            data-qoder-source='{"qoderId":"qel-a-02ed0cad","filePath":"react-vite/src/App.jsx","componentName":"SiteFooter","elementRole":"a","loc":{"line":474,"column":11}}'
          >
            隐私说明
          </a>
          {" · "}
          <a
            href={SITE.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-qoder-id="qel-a-fbed01a8"
            data-qoder-source='{"qoderId":"qel-a-fbed01a8","filePath":"react-vite/src/App.jsx","componentName":"SiteFooter","elementRole":"a","loc":{"line":476,"column":11}}'
          >
            GitHub
          </a>
          {" · "}
          <a
            href="/about"
            onClick={(e) => handleNavigate(e, "/about")}
            data-qoder-id="qel-a-fced033b"
            data-qoder-source='{"qoderId":"qel-a-fced033b","filePath":"react-vite/src/App.jsx","componentName":"SiteFooter","elementRole":"a","loc":{"line":478,"column":11}}'
          >
            关于
          </a>
        </p>
        <p
          data-qoder-id="qel-p-9a3f1b9e"
          data-qoder-source='{"qoderId":"qel-p-9a3f1b9e","filePath":"react-vite/src/App.jsx","componentName":"SiteFooter","elementRole":"p","loc":{"line":480,"column":9}}'
        >
          BeeX Labs · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
