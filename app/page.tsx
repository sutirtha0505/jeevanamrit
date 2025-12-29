"use client"
import { Navbar } from "@/components/ui/navbar";
import { createClient } from "@/lib/supabase/client";
import { Home } from "@/components/home";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FeaturedHerbs from "@/components/featured-herbs";
import HowItWorks from "@/components/howitworks";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
    const supabase = createClient();
    const [user, setUser] = useState<string | null>(null);
    const smoothScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error(error)
        return
      }
      setUser(data.user?.email ?? null)
    }

    getUser()
  }, [supabase])

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
    <Navbar user={user}/>
    <div className="smooth-scroll-section flex flex-col gap-8">
      <Home />
      <FeaturedHerbs />
      <HowItWorks />
    </div>
    </div>
);
}