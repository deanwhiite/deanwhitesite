"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

interface ShootingStarsProps {
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  className?: string;
}

// Changed from the source: the left and right edges pick a point along the screen's height.
// The source used the width for every edge, so on wide screens many stars started below the
// bottom of the screen and never appeared.
const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4);
  const alongWidth = Math.random() * window.innerWidth;
  const alongHeight = Math.random() * window.innerHeight;

  switch (side) {
    case 0:
      return { x: alongWidth, y: 0, angle: 45 };
    case 1:
      return { x: window.innerWidth, y: alongHeight, angle: 135 };
    case 2:
      return { x: alongWidth, y: window.innerHeight, angle: 225 };
    case 3:
      return { x: 0, y: alongHeight, angle: 315 };
    default:
      return { x: 0, y: 0, angle: 45 };
  }
};
export const ShootingStars: React.FC<ShootingStarsProps> = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = 10,
  starHeight = 1,
  className,
}) => {
  const [star, setStar] = useState<ShootingStar | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // Changed from the source: speeds are per 60 fps frame, scaled by the real time between
  // frames, so stars move at the same speed on 60, 120 and 144 Hz screens.
  const lastFrame = useRef<number | null>(null);

  useEffect(() => {
    // Changed from the source: keep the timer so cleanup can cancel it. Without this,
    // every remount (and React StrictMode in dev) starts another endless star loop.
    let timeout: number;

    const createStar = () => {
      const { x, y, angle } = getRandomStartPoint();
      const newStar: ShootingStar = {
        id: Date.now(),
        x,
        y,
        angle,
        scale: 1,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0,
      };
      lastFrame.current = null;
      setStar(newStar);

      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      timeout = window.setTimeout(createStar, randomDelay);
    };

    createStar();

    return () => window.clearTimeout(timeout);
  }, [minSpeed, maxSpeed, minDelay, maxDelay]);

  useEffect(() => {
    const moveStar = (now: number) => {
      if (star) {
        const frames =
          lastFrame.current === null
            ? 1
            : Math.min((now - lastFrame.current) / (1000 / 60), 4);
        lastFrame.current = now;
        setStar((prevStar) => {
          if (!prevStar) return null;
          const step = prevStar.speed * frames;
          const newX =
            prevStar.x + step * Math.cos((prevStar.angle * Math.PI) / 180);
          const newY =
            prevStar.y + step * Math.sin((prevStar.angle * Math.PI) / 180);
          const newDistance = prevStar.distance + step;
          const newScale = 1 + newDistance / 100;
          if (
            newX < -20 ||
            newX > window.innerWidth + 20 ||
            newY < -20 ||
            newY > window.innerHeight + 20
          ) {
            return null;
          }
          return {
            ...prevStar,
            x: newX,
            y: newY,
            distance: newDistance,
            scale: newScale,
          };
        });
      }
    };

    const animationFrame = requestAnimationFrame(moveStar);
    return () => cancelAnimationFrame(animationFrame);
  }, [star]);

  return (
    <svg
      ref={svgRef}
      className={cn("w-full h-full absolute inset-0", className)}
    >
      {star && (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill="url(#gradient)"
          transform={`rotate(${star.angle}, ${
            star.x + (starWidth * star.scale) / 2
          }, ${star.y + starHeight / 2})`}
        />
      )}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop
            offset="100%"
            style={{ stopColor: starColor, stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
    </svg>
  );
};
