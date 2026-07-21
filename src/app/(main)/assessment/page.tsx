"use client";

import AssessmentPage from "@/components/AssessmentPage";
import { useFullscreen } from "@/contexts/FullscreenContext";

export default function AssessmentRoutePage() {
  const { setFullscreen } = useFullscreen();
  return <AssessmentPage onFullscreenChange={setFullscreen} />;
}
