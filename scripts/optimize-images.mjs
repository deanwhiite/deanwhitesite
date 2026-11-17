// Turns the source images in images/ into responsive AVIF + WebP files in public/img/,
// named <name>-<hash>-<width>, and writes src/image-manifest.json so <Picture> can build srcsets.
//
//   npm run images
//
// Add or replace a file in images/, run this, and commit the results. The build doesn't run
// it, so Netlify never needs sharp.

import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, relative, dirname, extname } from "node:path";
import sharp from "sharp";

const SRC = "images";
const OUT = "public/img";
const MANIFEST = "src/image-manifest.json";

// Widths to generate (never wider than the original). Images show at up to ~1000 CSS px
// on 4K screens and ~320 CSS px on phones (x2–3 for Retina), so this covers both.
const DEFAULT_WIDTHS = [480, 800, 1200, 1600];
const WIDTHS = {
  "about/dean.jpg": [240, 480, 800], // the portrait is at most 200px (500px on 4K)
};

const AVIF = { quality: 55, effort: 6, chromaSubsampling: "4:4:4" }; // 4:4:4 keeps coloured UI text crisp
const WEBP = { quality: 80, effort: 6, smartSubsample: true };

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(png|jpe?g)$/i.test(entry.name)) yield path;
  }
}

await rm(OUT, { recursive: true, force: true });
const manifest = {};
let before = 0;
let after = 0;

for await (const file of walk(SRC)) {
  const key = relative(SRC, file).split("\\").join("/");
  const source = await readFile(file);
  const { width, height } = await sharp(source).metadata();
  before += source.length;
  // A fingerprint of the source in the filename, so the files can be cached forever and a
  // replaced image always gets a new URL.
  const hash = createHash("sha1").update(source).digest("hex").slice(0, 8);

  const widths = [...new Set([...(WIDTHS[key] ?? DEFAULT_WIDTHS).filter((w) => w < width), Math.min(width, 1600)])];
  const base = `${key.slice(0, -extname(key).length)}-${hash}`;
  await mkdir(join(OUT, dirname(key)), { recursive: true });

  for (const w of widths) {
    const resized = sharp(source).resize({ width: w, withoutEnlargement: true });
    const avif = await resized.clone().avif(AVIF).toBuffer();
    const webp = await resized.clone().webp(WEBP).toBuffer();
    await writeFile(join(OUT, `${base}-${w}.avif`), avif);
    await writeFile(join(OUT, `${base}-${w}.webp`), webp);
    if (w === widths.at(-1)) after += webp.length;
  }

  manifest[`/${key}`] = { base: `/img/${base}`, width, height, widths };
  console.log(`${key.padEnd(28)} ${widths.join(", ")}`);
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `\nLargest WebP of each image: ${(after / 1024).toFixed(0)} KB total (originals ${(before / 1024).toFixed(0)} KB).`,
);
