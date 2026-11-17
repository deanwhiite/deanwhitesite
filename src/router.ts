import { useCallback, useEffect, useState } from "react";

export type Direction = "forward" | "back";

/** The page that's animating out: its path, where it sat on screen, and which way to slide. */
export type Leaving = { path: string; top: number; dir: Direction };

type RouteState = { path: string; dir: Direction | null; leaving: Leaving | null };

const readPath = () => window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).join("/");
const depth = (path: string) => (path ? path.split("/").length : 0);

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Splits a route path into segments, e.g. "work/snapstore" -> ["work", "snapstore"]. */
export const segmentsOf = (path: string) => (path ? path.split("/") : []);

/**
 * Current hash route, plus the previous page while it animates out.
 * Going deeper (home -> about -> experience) is "forward"; going up is "back".
 */
export function useHashRoute() {
  const [state, setState] = useState<RouteState>(() => ({ path: readPath(), dir: null, leaving: null }));

  useEffect(() => {
    const onChange = () => {
      const next = readPath();
      // Read the scroll position before the new page resets it, so the old page can stay put.
      const top = -window.scrollY;
      setState((s) => {
        if (next === s.path) return s;
        if (prefersReducedMotion()) return { path: next, dir: null, leaving: null };
        const dir: Direction = depth(next) >= depth(s.path) ? "forward" : "back";
        // Navigating back to the page that's still leaving: just keep it.
        const leaving = next === s.leaving?.path ? null : { path: s.path, top, dir };
        return { path: next, dir, leaving };
      });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const clearLeaving = useCallback(() => setState((s) => (s.leaving ? { ...s, leaving: null } : s)), []);

  return { ...state, clearLeaving };
}

export const href = (...segments: string[]) => (segments.length ? `#/${segments.join("/")}` : "#/");
