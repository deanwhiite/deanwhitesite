import { useEffect, useLayoutEffect, useRef, useState, type ReactElement } from "react";
import { projects, work } from "@/content";
import { segmentsOf, useHashRoute } from "@/router";
import {
  About,
  Contact,
  Education,
  EntryDetail,
  EntryList,
  Experience,
  Home,
} from "@/components/screens";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

const sections = {
  work: { title: "Work", intro: "Product design case studies.", entries: work },
  projects: { title: "Projects", intro: "Things I make after hours.", entries: projects },
};

function resolve([first, second]: string[]): { view: ReactElement; name: string } {
  if (first === "about" && !second) return { view: <About />, name: "About" };
  if (first === "about" && second === "experience") return { view: <Experience />, name: "Experience" };
  if (first === "about" && second === "education") return { view: <Education />, name: "Education" };
  if (first === "contact" && !second) return { view: <Contact />, name: "Contact" };

  const section = first && first in sections ? sections[first as keyof typeof sections] : undefined;
  if (section && !second) return { view: <EntryList section={first} {...section} />, name: section.title };

  const entry = section?.entries.find((e) => e.id === second);
  if (entry) return { view: <EntryDetail section={first} entry={entry} />, name: entry.title };

  return { view: <Home />, name: "" };
}

/** How much the layout is scaled up (root font size / 16px). 1 on phones, tablets and laptops. */
function useLayoutScale() {
  const read = () => parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
  const [scale, setScale] = useState(read);
  useEffect(() => {
    const onResize = () => setScale(read());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return scale;
}

// The page on screen now, as opposed to one that's animating out.
const CURRENT = ".stage:not(.stage--leaving)";
const LEAVE_MS = 160; // matches the page-out animation in index.css

export default function App() {
  const { path, dir, leaving, clearLeaving } = useHashRoute();
  const { view, name } = resolve(segmentsOf(path));
  const firstRender = useRef(true);
  const scale = useLayoutScale();

  // Drop the old page once it has animated out.
  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(clearLeaving, LEAVE_MS);
    return () => window.clearTimeout(t);
  }, [leaving, clearLeaving]);

  // Title, scroll reset and focus on each route change. A layout effect, so the new page
  // never paints at the old page's scroll position.
  useLayoutEffect(() => {
    document.title = name ? `${name} — Dean White` : "Dean White — designer of web things";
    window.scrollTo(0, 0);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document.querySelector<HTMLElement>(`${CURRENT} h1`)?.focus({ preventScroll: true });
  }, [path, name]);

  // Escape goes back; arrow keys move between menu buttons.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "Escape") {
        document.querySelector<HTMLElement>(`${CURRENT} [data-back]`)?.click();
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const buttons = Array.from(document.querySelectorAll<HTMLElement>(`${CURRENT} .menu .btn`));
      if (!buttons.length) return;
      const current = buttons.indexOf(document.activeElement as HTMLElement);
      if (current === -1 && document.activeElement instanceof HTMLButtonElement) return;
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next =
        current === -1 ? (dir === 1 ? 0 : buttons.length - 1) : (current + dir + buttons.length) % buttons.length;
      e.preventDefault();
      buttons[next].focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      {/* Fixed to the viewport: shooting stars move in window coordinates, and long pages
          don't need a page-tall canvas. */}
      {/* On big screens the stars scale with the layout: faster shooting stars (so they still
          cross in the same time), bigger dots, and fewer per pixel, so a 4K screen looks
          like a larger 1080p one rather than a denser one. */}
      <ShootingStars
        className="fixed"
        minSpeed={10 * scale}
        maxSpeed={30 * scale}
        starHeight={Math.max(1, Math.round(scale))}
      />
      <StarsBackground className="fixed" starSize={scale} starDensity={0.00015 / (scale * scale)} />
      {/* Both pages share one keyed list, so the old page keeps its state while it leaves. */}
      <div className="stage" key={path} data-dir={dir ?? undefined}>
        {view}
      </div>
      {leaving && (
        <div
          className="stage stage--leaving"
          key={leaving.path}
          data-dir={leaving.dir}
          style={{ top: leaving.top }}
          inert
        >
          {resolve(segmentsOf(leaving.path)).view}
        </div>
      )}
    </div>
  );
}
