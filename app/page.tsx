"use client"
import { Home } from "@/components/home";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FeaturedHerbs from "@/components/featured-herbs";
import HowItWorks from "@/components/howitworks";
import FAQ from "@/components/faq";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
    const smoothScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Setup smooth scrolling
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.smooth-scroll-section');
      
      sections.forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0.8, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 20%",
              scrub: 1,
            }
          }
        );
      });
    }, smoothScrollRef);

    return () => ctx.revert();
  }, []);

return (
    <div ref={smoothScrollRef} className="relative">
    <div className="smooth-scroll-section flex flex-col gap-8">
      <Home />
      <FeaturedHerbs />
      <HowItWorks />
      <FAQ />
    </div>
    </div>
);
}