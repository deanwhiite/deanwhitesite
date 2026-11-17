// Types for Dither.jsx (React Bits, JavaScript + CSS variant), from its props table.
import type { CSSProperties, FC } from "react";

type Color = string | [number, number, number];

export interface DitherProps {
  /** Colour of the waves: any CSS colour, or a linear RGB array from 0 to 1. */
  waveColor?: Color;
  /** Colour behind the waves. 'transparent' dithers the waves over your own background. */
  backgroundColor?: Color | "transparent";
  ditherMode?: "bayer" | "bayer4" | "bayer2" | "halftone" | "lines" | "crosshatch" | "noise" | "none";
  /** Two to eight colours from dark to light; replaces waveColor and backgroundColor. */
  palette?: string[];
  /** Shades per colour channel. */
  colorNum?: number;
  /** Size of each dither pixel, in CSS px. */
  pixelSize?: number;
  scale?: number;
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  contrast?: number;
  brightness?: number;
  enableMouseInteraction?: boolean;
  mouseEffect?: "erase" | "reveal" | "ripple";
  mouseRadius?: number;
  mouseStrength?: number;
  /** How long the cursor leaves a fading trail, from 0 to 1. */
  trail?: number;
  clickRipple?: boolean;
  /** Resolves from chunky pixels to full detail on mount. */
  intro?: boolean;
  disableAnimation?: boolean;
  /** Maximum device pixel ratio, capped at 2. */
  dpr?: number;
  className?: string;
  style?: CSSProperties;
}

declare const Dither: FC<DitherProps>;
export default Dither;
