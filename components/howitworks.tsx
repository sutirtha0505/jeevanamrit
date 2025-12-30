import CardExample from "./ui/card-example";
import { Timeline } from "./ui/timeline";

export default function HowItWorks() {
  const timelineData = [
    {
      title: "Step 1",
      content: (
        <CardExample
          imageSrc="/Step1.jpg"
          cardTitle="Capture a Photo"
          cardDescription="Use your device to take a clear photo of the herb you want to identify."
        />
      ),
    },
    {
      title: "Step 2",
      content: (
        <CardExample
          imageSrc="/Step2.jpg"
          cardTitle="AI Analysis"
          cardDescription="Our AI model analyzes the photo to identify the herb and provide detailed information about it."
        />
      ),
    },
    {
      title: "Step 3",
        content: (
        <CardExample
          imageSrc="/Step3.jpg"
          cardTitle="Get Your Results"
          cardDescription="Receive a complete report on the herb's uses, history and its role in Ayurveda."
        />
      ),
    },
    {
      title: "Step 4",
        content: (
        <CardExample
          imageSrc="/Step4.jpg"
          cardTitle="Chemical Insights"
          cardDescription="Understand the chemical composition of the herb and its medicinal properties."
        />
      ),
    },
    {
      title: "Step 5",
        content: (
        <CardExample
          imageSrc="/Step5.jpg"
          cardTitle="Uncover Medicinal Uses"
          cardDescription="Discover the traditional and modern medicinal applications of the herb."
        />
      ),
    },
    {
      title: "Step 6",
        content: (
        <CardExample
          imageSrc="/Step6.jpeg"
          cardTitle="Explore it's History"
          cardDescription="Dive into the rich history and cultural significance of the herb in Ayurvedic practices."
        />
      ),
    },

  ];
  return (
    <div
      id="how-it-works"
      className="min-h-screen flex flex-col items-center justify-center bg-color-background px-4"
    >
      <h1 className="text-4xl text-center md:text-8xl font-bold mb-6 italic">How <span className="text-primary">जीवनामृत</span> Works</h1>
      <Timeline data={timelineData} />
    </div>
  );
}
