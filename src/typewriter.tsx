import { useEffect, useMemo, useRef, useState } from "react";

const START_DELAY = 350; // ms, lets the page transition settle first
const CHAR_MS = 3; // average time per character
const PARAGRAPH_PAUSE = 100;
const SENTENCE_PAUSE = 50;
const CLAUSE_PAUSE = 20;
const END_CARET_MS = 2400; // how long the caret blinks after the last character

/** When each character appears, in ms from the start, with a little human unevenness. */
function buildSchedule(texts: string[]) {
  let seed = 7;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let t = START_DELAY;
  return texts.map((text, i) => {
    if (i > 0) t += PARAGRAPH_PAUSE;
    const times: number[] = [];
    for (const ch of text) {
      t += CHAR_MS * (0.45 + random() * 1.1);
      times.push(t);
      if (/[.!?]/.test(ch)) t += SENTENCE_PAUSE;
      else if (/[,;:]/.test(ch)) t += CLAUSE_PAUSE;
    }
    return times;
  });
}

/**
 * Types `texts` out one after another. Returns how many characters of each are showing,
 * which one has the caret, and whether it's finished. Any click or key press skips to the end.
 */
export function useTypewriter(texts: string[], enabled: boolean) {
  const schedule = useMemo(() => buildSchedule(texts), [texts]);
  const full = useMemo(() => texts.map((t) => [...t].length), [texts]);
  const [counts, setCounts] = useState<number[]>(() => (enabled ? texts.map(() => 0) : full));
  const [endCaret, setEndCaret] = useState(enabled);
  const started = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const startAt = performance.now();

    const stop = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
    const skip = () => {
      stop();
      setCounts(full);
    };
    const tick = (now: number) => {
      started.current = true;
      const elapsed = now - startAt;
      const next = schedule.map((times) => {
        let n = 0;
        while (n < times.length && times[n] <= elapsed) n++;
        return n;
      });
      setCounts((prev) => (prev.every((c, i) => c === next[i]) ? prev : next));
      if (next.every((c, i) => c === full[i])) stop();
      else raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return stop;
  }, [enabled, schedule, full]);

  const done = counts.every((c, i) => c === full[i]);

  useEffect(() => {
    if (!done || !endCaret) return;
    const t = window.setTimeout(() => setEndCaret(false), END_CARET_MS);
    return () => window.clearTimeout(t);
  }, [done, endCaret]);

  const typing = counts.findIndex((c, i) => c < full[i]);
  const caretAt = typing !== -1 ? typing : endCaret ? texts.length - 1 : -1;

  return { counts, caretAt, done, started };
}

/**
 * One paragraph's worth of typed text. The untyped rest is laid out but hidden, so the page
 * doesn't reflow as it types. Screen readers get the whole sentence straight away.
 */
export function TypedText({
  text,
  count,
  caret,
  blinking,
}: {
  text: string;
  count: number;
  caret: boolean;
  blinking: boolean;
}) {
  const chars = useMemo(() => [...text], [text]);
  if (count >= chars.length && !caret) return <>{text}</>;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.slice(0, count).join("")}
        {caret && <span className={blinking ? "caret caret--blink" : "caret"} />}
        <span className="untyped">{chars.slice(count).join("")}</span>
      </span>
    </>
  );
}
