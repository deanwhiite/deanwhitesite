import { useEffect, useState, type ReactNode } from "react";
import {
  about,
  contactIntro,
  contactLinks,
  education,
  experience,
  profile,
  socials,
  type Entry,
  type Link,
} from "@/content";
import { BackIcon, ExternalIcon, socialPaths } from "@/components/icons";
import { href, prefersReducedMotion } from "@/router";
import { TypedText, useTypewriter } from "@/typewriter";

function NavButton({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a className="btn" href={to}>
      {children}
    </a>
  );
}

function LinkButton({ link }: { link: Link }) {
  const external = !link.href.startsWith("mailto:");
  return (
    <a className="btn" href={link.href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {link.label}
      {external && <ExternalIcon />}
    </a>
  );
}

function Screen({
  title,
  back,
  long,
  children,
}: {
  title: string;
  back: string;
  long?: boolean;
  children: ReactNode;
}) {
  return (
    <main className="screen">
      <h1 className={long ? "heading heading--long" : "heading"} tabIndex={-1}>
        {title}
      </h1>
      <div className="body">{children}</div>
      <div className="foot">
        <a className="btn btn--wide" href={back} data-back>
          <BackIcon />
          Back
        </a>
      </div>
    </main>
  );
}

export function Home() {
  return (
    <main className="screen screen--home">
      <header className="masthead">
        <h1 className="title" tabIndex={-1}>
          <span>Dean</span> <span>White</span>
        </h1>
        <p className="tagline">{profile.tagline}</p>
      </header>
      <nav className="menu" aria-label="Main">
        <NavButton to={href("about")}>About</NavButton>
        <NavButton to={href("work")}>Work</NavButton>
        <NavButton to={href("projects")}>Projects</NavButton>
        <NavButton to={href("contact")}>Contact</NavButton>
      </nav>
    </main>
  );
}

// The bio types out once per visit to the site; after that it shows straight away.
let aboutTyped = false;
const aboutTexts = [...about, profile.location];

export function About() {
  const [animate] = useState(() => !aboutTyped && !prefersReducedMotion());
  const { counts, caretAt, done, started } = useTypewriter(aboutTexts, animate);

  useEffect(() => {
    if (done) aboutTyped = true;
  }, [done]);
  // Leaving partway through also counts as seen.
  useEffect(
    () => () => {
      if (started.current) aboutTyped = true;
    },
    [started],
  );

  const typed = (i: number) => (
    <TypedText text={aboutTexts[i]} count={counts[i]} caret={caretAt === i} blinking={done} />
  );

  return (
    <Screen title="About" back={href()}>
      <img
        className="portrait"
        src="/about/dean.jpg"
        alt="Dean White smiling, sitting on pale sandstone in the sun"
        width={800}
        height={800}
        decoding="async"
      />
      {about.map((p, i) => (
        <p key={p}>{typed(i)}</p>
      ))}
      <p className="dim">{typed(about.length)}</p>
      <nav className="menu menu--list" aria-label="More about me">
        <NavButton to={href("about", "experience")}>Experience</NavButton>
        <NavButton to={href("about", "education")}>Education</NavButton>
      </nav>
    </Screen>
  );
}

export function Experience() {
  return (
    <Screen title="Experience" back={href("about")} long>
      {experience.map((role) => (
        <section className="role" key={role.title + role.dates}>
          <h2>{role.title}</h2>
          <p className="dim">{[role.company, role.dates].filter(Boolean).join(" · ")}</p>
          {role.summary && <p>{role.summary}</p>}
          <ul className="points">
            {role.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      ))}
    </Screen>
  );
}

export function Education() {
  return (
    <Screen title="Education" back={href("about")} long>
      {education.map((course) => (
        <section className="role" key={course.title}>
          <h2>{course.title}</h2>
          <p className="dim">
            {course.school} · {course.dates}
          </p>
        </section>
      ))}
    </Screen>
  );
}

export function EntryList({
  title,
  section,
  intro,
  entries,
}: {
  title: string;
  section: string;
  intro: string;
  entries: Entry[];
}) {
  return (
    <Screen title={title} back={href()}>
      <p>{intro}</p>
      <nav className="menu menu--list" aria-label={title}>
        {entries.map((entry) => (
          <a className="btn btn--row" href={href(section, entry.id)} key={entry.id}>
            <span>{entry.title}</span>
            <small>{entry.subtitle}</small>
          </a>
        ))}
      </nav>
    </Screen>
  );
}

function CopyCommand({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="command">
      <code>{text}</code>
      <button
        type="button"
        className="btn btn--small"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          } catch {
            // Clipboard can be blocked; the command stays selectable.
          }
        }}
      >
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

export function EntryDetail({ section, entry }: { section: string; entry: Entry }) {
  const single = entry.pictures.length === 1;
  return (
    <Screen title={entry.title} back={href(section)} long>
      <p className="dim kicker">{entry.subtitle}</p>
      <div className={single ? "shots" : "shots shots--strip"}>
        {entry.pictures.map((pic, i) => (
          <img
            key={pic.src}
            src={pic.src}
            alt={pic.alt}
            width={pic.width}
            height={pic.height}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
      </div>
      <p>{entry.description}</p>
      {entry.results && (
        <ul className="points">
          {entry.results.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
      <p className="dim">{entry.tags.join(" / ")}</p>
      {entry.command && <CopyCommand text={entry.command} />}
      <div className="menu menu--list">
        {entry.links.map((link) => (
          <LinkButton link={link} key={link.href} />
        ))}
      </div>
    </Screen>
  );
}

export function Contact() {
  return (
    <Screen title="Contact" back={href()}>
      <p>{contactIntro}</p>
      <p className="dim">{profile.email}</p>
      <nav className="menu menu--list" aria-label="Contact">
        {contactLinks.map((link) => (
          <LinkButton link={link} key={link.href} />
        ))}
      </nav>
      <ul className="socials" aria-label="Elsewhere">
        {socials.map((s) => (
          <li key={s.href}>
            <a
              className="btn btn--icon"
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              title={s.label}
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d={socialPaths[s.icon]} fill="currentColor" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </Screen>
  );
}
