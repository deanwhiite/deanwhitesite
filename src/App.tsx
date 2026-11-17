import { useEffect, useRef, useState, type ReactElement } from "react";
import { projects, work } from "@/content";
import { useHashRoute } from "@/router";
import {
  About,
  Contact,
  Education,
  EntryDetail,
  EntryList,
  Experience,
  Home,
} from "@/components/screens";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

const CELL = 56;

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

export default function App() {
  const route = useHashRoute();
  const path = route.join("/");
  const { view, name } = resolve(route);
  const firstRender = useRef(true);
  const appRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ rows: 16, cols: 27 });

  // Size the background grid to cover the whole page.
  useEffect(() => {
    const el = appRef.current;
    if (!el) return;
    const measure = () => {
      const rows = Math.ceil(el.offsetHeight / CELL);
      const cols = Math.ceil(el.offsetWidth / CELL);
      setGrid((g) => (g.rows === rows && g.cols === cols ? g : { rows, cols }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Title, scroll reset and focus on each route change.
  useEffect(() => {
    document.title = name ? `${name} — Dean White` : "Dean White — designer of web things";
    window.scrollTo(0, 0);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
  }, [path, name]);

  // Escape goes back; arrow keys move between menu buttons.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "Escape") {
        document.querySelector<HTMLElement>("[data-back]")?.click();
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const buttons = Array.from(document.querySelectorAll<HTMLElement>(".menu .btn"));
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
    <div className="app" ref={appRef}>
      <BackgroundRippleEffect rows={grid.rows} cols={grid.cols} cellSize={CELL} gridClassName="" />
      <div className="stage" key={path}>
        {view}
      </div>
    </div>
  );
}
