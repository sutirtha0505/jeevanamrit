import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function FAQ() {
  return (
    <div className="w-full mx-auto gap-8 px-4 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl text-center md:text-8xl font-bold mb-6">
        Frequently Asked Questions
      </h1>
      <Accordion className="w-full px-0 md:px-8 lg:px-16">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h1 className="text-2xl font-bold">What is जीवनामृत ?</h1>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-xl">
              जीवनामृत is an innovative platform dedicated to the identification
              and exploration of medicinal herbs native to India. By leveraging
              advanced AI technology, we aim to bridge the gap between ancient
              Ayurvedic wisdom and modern-day accessibility. Our mission is to
              empower individuals to discover the healing properties of local
              flora, fostering a deeper connection with nature and promoting
              holistic well-being.
            </p>
            <p className="text-xl">
              Whether you&apos;re a curious herbalist, a wellness enthusiast, or
              someone seeking natural remedies, जीवनामृत provides an easy-to-use
              interface to capture or upload images of herbs. Our AI-driven
              analysis offers detailed insights into each herb&apos;s uses,
              history, chemical composition, and medicinal applications, making
              the ancient knowledge of Ayurveda accessible to all.
            </p>
            <p className="text-xl">
              Join us on this journey to explore the rich biodiversity of
              India&apos;s medicinal plants and unlock the secrets of Ayurveda
              with जीवनामृत – your gateway to nature&apos;s healing treasures.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <h1 className="text-2xl font-bold">How Accurate is जीवनामृत ?</h1>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-xl">
              जीवनामृत leverages state-of-the-art AI technology to analyze
              images of medicinal herbs. While our AI model has been trained on
              a vast dataset of herb images and information, the accuracy of
              identification can vary based on factors such as image quality,
              lighting conditions, and the uniqueness of the herb.
            </p>
            <p className="text-xl">
              We continuously work to improve our AI algorithms and expand our
              database to enhance accuracy. However, we recommend users to
              cross-reference the results provided by जीवनामृत with trusted
              sources or consult with Ayurvedic practitioners for critical
              applications.
            </p>
            <p className="text-xl">
              Your feedback is invaluable to us. If you encounter any
              discrepancies or have suggestions for improvement, please
              don&apos;t hesitate to reach out to our support team.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger><h1 className="text-2xl font-bold">Is the Information from जीवनामृत a substitute for professional medical advice?</h1></AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-xl">
              The information provided by जीवनामृत is intended for educational
              and informational purposes only. While we strive to offer accurate
              and up-to-date information about medicinal herbs and their uses in
              Ayurveda, it should not be considered a substitute for professional
              medical advice, diagnosis, or treatment.
            </p>
            <p className="text-xl">
              Always seek the advice of your physician or other qualified health
              provider with any questions you may have regarding a medical
              condition or before starting any new treatment or herbal remedy.
              Never disregard professional medical advice or delay in seeking it
              because of something you have read on जीवनामृत.
            </p>
            <p className="text-xl">
              If you think you may have a medical emergency, call your doctor or
              emergency services immediately.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger><h1 className="text-2xl font-bold">What is अरण्य, the Plant Heal Chatbot?</h1></AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-xl">
                अरण्य is our AI-powered Plant Heal Chatbot designed to assist
                users in exploring and understanding the medicinal properties of
                various herbs. Leveraging advanced natural language processing
                techniques, अरण्य can answer questions, provide insights, and guide
                users through the wealth of Ayurvedic knowledge associated with
                the herbs identified by जीवनामृत.
            </p>
            <p className="text-xl">
                Whether you&apos;re curious about a specific herb&apos;s uses,
                historical significance, or cultivation methods, अरण्य is here to
                help. Simply ask your questions, and the chatbot will provide
                informative and engaging responses based on our extensive database
                of Ayurvedic wisdom.
            </p>
            <p className="text-xl">
                Please note that while अरण्य aims to provide accurate and helpful
                information, it is not a substitute for professional medical advice.
                Always consult with a qualified healthcare provider for any medical
                concerns or treatments.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger><h1 className="text-2xl font-bold">How do I save my Analysis Result?</h1></AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-xl">
                After receiving your herb analysis results on जीवनामृत, you can
                easily save the information for future reference. Here&apos;s how:
            </p>
            <ol className="list-decimal list-inside text-xl space-y-2">
              <li>
                <strong>Download Report:</strong> Look for a &quot;Download&quot; or
                &quot;Save Report&quot; button on the results page. Clicking this will
                allow you to download a PDF or document version of your analysis.
              </li>
              <li>
                <strong>Bookmark the Page:</strong> You can bookmark the results page
                in your web browser for easy access later.
              </li>
              <li>
                <strong>Take Screenshots:</strong> If you prefer, you can take
                screenshots of the results and save them to your device.
              </li>
              <li>
                <strong>Create an Account:</strong> Consider creating an account on
                जीवनामृत (if available) to save your analysis history and access
                previous results anytime.
              </li>
            </ol>
            <p className="text-xl">
                If you encounter any issues while trying to save your results, feel
                free to reach out to our support team for assistance.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
