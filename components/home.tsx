import { Tiro_Devanagari_Hindi } from "next/font/google";
import BlurText from "./BlurText";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const tiroDevanagari = Tiro_Devanagari_Hindi({
  weight: ["400"],
  subsets: ["devanagari"],
});

export const Home = () => {
  const [showSecondText, setShowSecondText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondText(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full bg-background min-h-screen">
      {/* SVG Mask Definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="home-mask" clipPathUnits="objectBoundingBox">
            <path d="M0 0 H1 V0.88 C1 0.88 0.99 0.93 0.95 0.96 C0.91 1 0.93 0.91 0.88 0.98 C0.82 1.06 0.77 0.84 0.67 0.91 C0.56 0.97 0.54 0.87 0.49 0.88 C0.44 0.89 0.40 0.97 0.36 0.98 C0.31 1 0.27 0.88 0.21 0.88 C0.16 0.88 0.13 0.92 0.10 0.93 C0.07 0.94 0.09 0.89 0.05 0.92 C0.004 0.94 0 0.88 0 0.88 V0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Masked Image */}
      <div
        className="relative w-full h-screen overflow-hidden"
        style={{
          clipPath: "url(#home-mask)",
          WebkitClipPath: "url(#home-mask)",
        }}
      >
        <video autoPlay muted loop className="h-full w-full object-cover brightness-50">
          <source src="/Ayurveda.mp4" type="video/mp4" />
        </video>
        {/* Text Overlay */}
        {!showSecondText ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <BlurText
              text="जीवनामृत"
              delay={500}
              animateBy="words"
              direction="top"
              className={`${tiroDevanagari.className} md:text-9xl text-6xl  font-extrabold italic text-white drop-shadow-2xl`}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            <BlurText
              text="प्रकृति | प्रज्ञा | आयुर्वेद"
              delay={500}
              animateBy="words"
              direction="top"
              className={`${tiroDevanagari.className} md:text-6xl text-4xl  font-extrabold italic text-white drop-shadow-2xl`}
            />

            <p className="px-4 md:px-0 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white md:text-xl text-center">
              From the Himalayas to the Western Ghats, India is a treasure trove
              of medicinal plants 
              <span className="font-extrabold text-primary">
                {" "}
                जीवनामृत 
              </span>{" "}
              helps you identify local herbs and unlock the ancient Ayurvedic
              wisdom hidden in your own backyard.
            </p>

            <Button className="text-lg mt-8 px-6 py-3" size="lg">
              Explore the आयुर्वेद World
            </Button>

            {/* Sub subtle tag */}
            <p className="mt-4 text-sm text-white">
              🌿 Powered by आयुर्वेद · Inspired by भारत
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
