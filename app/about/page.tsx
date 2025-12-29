import WaterRippleEffect from "@/components/ui/water-ripple-effect";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 px-4 flex flex-col justify-center items-center w-full overflow-hidden">
      <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold italic text-center mb-6 md:mb-8">
        About <span className="text-primary">जीवनामृत</span>
      </h1>
      <div className="flex flex-col lg:flex-row md:gap-12 items-center justify-between px-16">
        <div className="w-full px-12 md:px-0 lg:w-1/2 flex flex-col justify-center items-center">
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-center">
            <span className="text-primary font-semibold">जीवनामृत</span> is an
            innovative platform dedicated to the identification and exploration
            of medicinal herbs native to India. By leveraging advanced AI
            technology, we aim to bridge the gap between ancient Ayurvedic
            wisdom and modern-day accessibility. Our mission is to empower
            individuals to discover the healing properties of local flora,
            fostering a deeper connection with nature and promoting holistic
            well-being.
          </p>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-center">
            Whether you&apos;re a curious herbalist, a wellness enthusiast, or
            someone seeking natural remedies,{" "}
            <span className="text-primary font-semibold">जीवनामृत</span>{" "}
            provides an easy-to-use interface to capture or upload images of
            herbs. Our AI-driven analysis offers detailed insights into each
            herb&apos;s uses, history, chemical composition, and medicinal
            applications, making the ancient knowledge of Ayurveda accessible to
            all.
          </p>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-center">
            Join us on this journey to explore the rich biodiversity of
            India&apos;s medicinal plants and unlock the secrets of Ayurveda
            with <span className="text-primary font-semibold">जीवनामृत</span> –
            your gateway to nature&apos;s healing treasures.
          </p>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-md lg:max-w-none overflow-hidden">
            <WaterRippleEffect
              imageSrc="/About.jpg"
              height={
                typeof window !== "undefined" && window.innerWidth < 768
                  ? 150
                  : 550
              }
              width={
                typeof window !== "undefined" && window.innerWidth < 768
                  ? 150
                  : 650
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
