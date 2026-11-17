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
- `netlify.toml` builds with `npm run build` and publishes `dist/`. `public/_headers` sets the security headers.
