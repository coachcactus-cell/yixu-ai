"use client";

import PinXiangGame from "@/components/PinXiangGame";
import { useFullscreen } from "@/contexts/FullscreenContext";
import { useEffect } from "react";

export default function Page() {
  const { setFullscreen } = useFullscreen();

  useEffect(() => {
    setFullscreen(true);
    return () => setFullscreen(false);
  }, [setFullscreen]);

  return <PinXiangGame />;
}
