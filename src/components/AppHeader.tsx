import { IS_DEV, NAV_LINKS, SITE } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navigate as routerNavigate } from "@/app/router";

export interface AppHeaderProps {
  currentPath: string;
  theme?: string;
  onThemeToggle?: () => void;
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export function AppHeader({
  currentPath,
  theme,
  onThemeToggle,
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: AppHeaderProps) {
  const links = NAV_LINKS.filter((link) => !link.devOnly || IS_DEV);

  const handleNavigate = (href: string) => {
    routerNavigate(href);
  };

  return (
    <header
      className={["app-header", className].filter(Boolean).join(" ")}
      data-component="AppHeader"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      <div
        className="header-inner"
        data-qoder-id="qel-header-inner-08422d36"
        data-qoder-source='{"qoderId":"qel-header-inner-08422d36","filePath":"react-vite/src/App.jsx","componentName":"AppHeader","elementRole":"header-inner","loc":{"line":441,"column":7}}'
      >
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate("/");
          }}
          data-qoder-id="qel-brand-df264cfe"
          data-qoder-source='{"qoderId":"qel-brand-df264cfe","filePath":"react-vite/src/App.jsx","componentName":"AppHeader","elementRole":"brand","loc":{"line":442,"column":9}}'
        >
          <span
            className="brand-paw"
            data-qoder-id="qel-brand-paw-0b9ea563"
            data-qoder-source='{"qoderId":"qel-brand-paw-0b9ea563","filePath":"react-vite/src/App.jsx","componentName":"AppHeader","elementRole":"brand-paw","loc":{"line":447,"column":11}}'
          >
            <img src="/favicon.svg" alt="" aria-hidden="true" />
          </span>
          <span
            data-qoder-id="qel-span-8f55f776"
            data-qoder-source='{"qoderId":"qel-span-8f55f776","filePath":"react-vite/src/App.jsx","componentName":"AppHeader","elementRole":"span","loc":{"line":448,"column":11}}'
          >
            {SITE.name}
          </span>
        </a>
        <nav
          aria-label="主导航"
          data-qoder-id="qel-nav-0d0ffe33"
          data-qoder-source='{"qoderId":"qel-nav-0d0ffe33","filePath":"react-vite/src/App.jsx","componentName":"AppHeader","elementRole":"nav","loc":{"line":450,"column":9}}'
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={currentPath === link.href ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(link.href);
              }}
              data-qoder-id="qel-a-557e6568"
              data-qoder-source='{"qoderId":"qel-a-557e6568","filePath":"react-vite/src/App.jsx","componentName":"AppHeader","elementRole":"a","loc":{"line":452,"column":13}}'
            >
              {link.label}
            </a>
          ))}
        </nav>
        <ThemeToggle
          theme={theme}
          onToggle={onThemeToggle}
          data-qoder-id="qel-themetoggle-76550951"
          data-qoder-source='{"qoderId":"qel-themetoggle-76550951","filePath":"react-vite/src/App.jsx","componentName":"AppHeader","elementRole":"themetoggle","loc":{"line":462,"column":9}}'
        />
      </div>
    </header>
  );
}
