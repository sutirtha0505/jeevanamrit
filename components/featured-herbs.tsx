import ChromaGrid from "./ChromaGrid";
import { herbItems } from "@/constants/layout";
import SplitText from "./SplitText";

export default function FeaturedHerbs() {
  return (
    <div
      id="featured-herbs"
      className="min-h-screen gap-8 flex flex-col items-center justify-center bg-color-background"
    >
      <div className="text-4xl text-center md:text-6xl font-bold mb-6 px-6 md:px-10">
        <SplitText
          text="Special"
          className="inline px-2"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="100px"
          textAlign="center"
        />
        <SplitText
          text="भारतीय"
          className="text-primary inline pt-2 px-2"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="100px"
          textAlign="center"
        />
        <SplitText
          text=" Ayurvedic "
          className="inline px-2"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="100px"
          textAlign="center"
        />
        <SplitText
          text=" वनौषधि"
          className="text-primary inline pt-2"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="100px"
          textAlign="center"
        />
      </div>
      <p className="text-lg text-center max-w-2xl px-4 md:px-0">
        Explore some of the fascinating medicinal herbs our users have
        discovered and shared through the{" "}
        <span className="font-extrabold text-primary">जीवनामृत</span> platform.
      </p>
      <div style={{ position: "relative" }}>
        <ChromaGrid
          items={herbItems}
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </div>
    </div>
  );
}
