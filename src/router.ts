import { useEffect, useState } from "react";

function readHash() {
  return window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
}

/** Current hash route as path segments, e.g. "#/work/snapstore" -> ["work", "snapstore"]. */
export function useHashRoute() {
  const [segments, setSegments] = useState(readHash);
  useEffect(() => {
    const onChange = () => setSegments(readHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return segments;
}

export const href = (...segments: string[]) => (segments.length ? `#/${segments.join("/")}` : "#/");
