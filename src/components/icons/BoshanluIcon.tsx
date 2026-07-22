"use client";

/**
 * 博山炉 icon — 汉代香文化经典器型
 * 简化为线条：山峦形炉盖 + 炉身 + 三足 + 一缕香云
 */
export default function BoshanluIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 一缕香云 */}
      <path d="M24 5c-1.8-1.2-1.8-3.2 0-4.5s1.5-3.5-0.3-4.8" />
      {/* 外层山峦 */}
      <path d="M12 32c0-7.5 5-14.5 12-18.5 7 4 12 11 12 18.5" />
      {/* 内层山峰 */}
      <path d="M18 32c0-4.8 2.8-9 6-12 3.2 3 6 7.2 6 12" />
      {/* 炉身 */}
      <path d="M10 32c0 6.8 6.5 10.8 14 10.8s14-4 14-10.8" />
      {/* 炉口 */}
      <ellipse cx="24" cy="32" rx="14" ry="3.6" />
      {/* 三足 */}
      <path d="M17 42.5l-2 4.5M31 42.5l2 4.5M24 42.5v4.5" />
    </svg>
  );
}
