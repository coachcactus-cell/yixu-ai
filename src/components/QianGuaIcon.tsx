"use client";

import type { SVGProps } from "react";

/**
 * 謙卦卦象 SVG 圖標
 * 上坤（三陰）下艮（一陽在上，即九三）
 * 由頂到底：陰 陰 陰 陽 陰 陰
 */
export function QianGuaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {[
        // 上爻 → 初爻，true=陽（長條），false=陰（兩段）
        false, // 上六：陰
        false, // 六五：陰
        false, // 六四：陰
        true,  // 九三：陽
        false, // 六二：陰
        false, // 初六：陰
      ].map((isYang, i) => {
        const y = 2 + i * 3.5;
        const key = i;
        if (isYang) {
          return (
            <rect
              key={key}
              x="3"
              y={y}
              width="18"
              height="2.2"
              rx="1.1"
              fill="currentColor"
            />
          );
        }
        return (
          <g key={key}>
            <rect x="3" y={y} width="7.5" height="2.2" rx="1.1" fill="currentColor" />
            <rect x="13.5" y={y} width="7.5" height="2.2" rx="1.1" fill="currentColor" />
          </g>
        );
      })}
    </svg>
  );
}
