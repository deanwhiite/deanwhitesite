# deanwhite-portfolio

Source for [deanwhite.netlify.app](https://deanwhite.netlify.app/), Dean White's portfolio.

Vite + React + TypeScript + Tailwind CSS v4. Hash routes (`#/about`, `#/work/snapstore`, …), no router library.

```sh
npm install
npm run dev       # local dev server
npm run build     # type-check, then build to dist/
npm run preview   # serve dist/
```

- Content (bio, experience, case studies, links) lives in `src/content.ts`.
- Screens are in `src/components/screens.tsx`; routing is in `src/App.tsx`.
- Styles are in `src/index.css`. Tailwind's theme and utilities are loaded, but not its preflight reset.
- `netlify.toml` builds with `npm run build` and publishes `dist/`. `public/_headers` sets the security and caching headers.

## Images

Source images live in `images/` (not deployed). `npm run images` turns them into AVIF and WebP
files at several widths in `public/img/`, with a content hash in each name, and writes
`src/image-manifest.json`. Pages use `<Picture src="/projects/flyfair.png" …>`, which picks the
smallest file that's sharp on the visitor's screen.

To add or replace an image: put it in `images/`, run `npm run images`, and commit the results.
The Netlify build doesn't run this step.
