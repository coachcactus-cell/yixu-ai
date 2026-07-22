"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { Home, BookOpen, ClipboardList, User, Compass, Music2, Cookie, Store } from "lucide-react";
import { FullscreenProvider, useFullscreen } from "@/contexts/FullscreenContext";

const TABS = [
  { key: "/", label: "首页", icon: Home },
  { key: "/yijing", label: "易卦", icon: Compass },
  { key: "/tianlai", label: "天籁", icon: Music2 },
  { key: "/dict", label: "辞典", icon: BookOpen },
  { key: "/assessment", label: "测评", icon: ClipboardList },
  { key: "/dianxin", label: "点心", icon: Cookie },
  { key: "/shop", label: "香舖", icon: Store },
];

const TAB_REDIRECTS: Record<string, string> = {
  home: "/",
  yijing: "/yijing",
  tianlai: "/tianlai",
  dictionary: "/dict",
  assessment: "/assessment",
  dianxin: "/dianxin",
  shop: "/shop",
  profile: "/profile",
};

function MainLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isFullscreen } = useFullscreen();

  return (
    <div className="page-container">
      {/* 右上角「我的」入口按钮 */}
      {!isFullscreen && (
        <Link
          href="/profile"
          className="fixed z-40 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-[#c9a84c]/30 shadow-sm flex items-center justify-center active:scale-95 transition-transform"
          aria-label="我的"
          style={{ top: "14px", right: "14px" }}
        >
          <User size={16} className={pathname === "/profile" ? "text-[#c9a84c]" : "text-[#999]"} strokeWidth={2} />
        </Link>
      )}

      {/* Page Content */}
      {children}

      {/* Bottom Tab Bar — 全屏模式隐藏 */}
      {!isFullscreen && (
        <nav className="tab-bar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.key;
            return (
              <Link
                key={tab.key}
                href={tab.key}
                className={`tab-item ${isActive ? "active" : ""}`}
              >
                <Icon strokeWidth={isActive ? 2.5 : 2} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

// 处理旧 ?tab=xxx 连结重定向
function LegacyTabRedirect({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");

  useEffect(() => {
    if (tabParam && TAB_REDIRECTS[tabParam]) {
      router.replace(TAB_REDIRECTS[tabParam]);
    }
  }, [tabParam, router]);

  return <>{children}</>;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FullscreenProvider>
      <Suspense>
        <LegacyTabRedirect>
          <MainLayoutInner>{children}</MainLayoutInner>
        </LegacyTabRedirect>
      </Suspense>
    </FullscreenProvider>
  );
}
