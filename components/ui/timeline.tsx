"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [trackHeight, setTrackHeight] = useState(0);

  useEffect(() => {
    if (!trackRef.current) return;
    setTrackHeight(trackRef.current.getBoundingClientRect().height);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, trackHeight]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-5xl px-4 md:px-8"
    >
      <div ref={trackRef} className="relative">

        {/* --- Vertical Center Line --- */}
        <div
          style={{ height: trackHeight }}
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px]
          bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))]
          from-transparent via-neutral-200 dark:via-neutral-700 to-transparent
          [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full
            bg-gradient-to-t from-emerald-500 via-green-500 to-transparent"
          />
        </div>

        {/* --- Timeline Items --- */}
        {data.map((item, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div
              key={index}
              className="relative flex items-start pt-10 md:pt-32"
            >
              {/* Left Side Content */}
              <div className={`w-full md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-8 md:text-right' : 'md:invisible'}`}>
                {isLeft && (
                  <>
                    <h3 className="text-2xl md:text-4xl font-bold text-neutral-600 dark:text-neutral-400 mb-4">
                      {item.title}
                    </h3>
                    <div className="text-neutral-700 dark:text-neutral-300 flex justify-center md:justify-end">
                      {item.content}
                    </div>
                  </>
                )}
              </div>

              {/* Center Dot */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-12 h-6 w-6 rounded-full items-center justify-center bg-white dark:bg-black border-2 border-emerald-500 dark:border-green-500 z-10">
                <div className="h-3 w-3 rounded-full bg-emerald-500 dark:bg-green-500" />
              </div>

              {/* Right Side Content */}
              <div className={`w-full md:w-[calc(50%-0.3rem)] ${!isLeft ? 'md:pl-16 md:text-left' : 'md:invisible'}`}>
                {!isLeft && (
                  <>
                    <h3 className="text-2xl md:text-4xl font-bold text-neutral-600 dark:text-neutral-400 mb-4">
                      {item.title}
                    </h3>
                    <div className="text-neutral-700 dark:text-neutral-300 flex justify-center md:justify-start">
                      {item.content}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
