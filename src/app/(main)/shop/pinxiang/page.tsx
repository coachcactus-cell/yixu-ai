"use client";

import { useEffect } from "react";
import { useFullscreen } from "@/contexts/FullscreenContext";
import PinXiangGame from "@/components/PinXiangGame";

export default function Page() {
  const { setFullscreen } = useFullscreen();

  useEffect(() => {
    setFullscreen(true);
    return () => setFullscreen(false);
  }, [setFullscreen]);

  return <PinXiangGame />;
}
