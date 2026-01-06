import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does English Now help me learn English?",
    answer:
      "English Now is an all-in-one English learning app that combines conversation practice, vocabulary building, grammar lessons, and personalized feedback. Our AI-powered system adapts to your learning style and provides real-time corrections and suggestions to help you improve faster.",
  },
  {
    question: "Do I need to pay to use English Now?",
    answer:
      "We offer both free and premium plans. The free plan includes basic features like limited conversation practice and vocabulary exercises. Our premium plan unlocks unlimited practice sessions, advanced AI feedback, personalized learning paths, and priority support.",
  },
  {
    question: "Can I practice speaking English with the app?",
    answer:
      "Yes! English Now includes conversation practice features where you can have real-time conversations with our AI tutor. The AI will help you practice pronunciation, correct your mistakes, and guide you through natural conversations on various topics.",
  },
  {
    question: "Is my progress saved across devices?",
    answer:
      "Absolutely! Your progress, vocabulary, and learning history are automatically synced across all your devices when you sign in with your account. You can seamlessly continue learning on your phone, tablet, or computer.",
  },
  {
    question: "How is this different from other English learning apps?",
    answer:
      "English Now combines multiple learning methods in one app - conversation practice, vocabulary, grammar, and personalized feedback - all powered by advanced AI. Instead of switching between different apps, you get everything you need in one place, with a learning experience that adapts to your needs.",
  },
  {
    question: "Can I use English Now offline?",
    answer:
      "Some features are available offline, such as reviewing your saved vocabulary and completed lessons. However, conversation practice and AI feedback require an internet connection. We're working on expanding offline capabilities in future updates.",
  },
];

export default function FAQ() {
  return (
    <div className="group mx-auto mt-8 max-w-screen px-2 pb-32 sm:mt-24 sm:px-6">
      <div className="flex flex-row gap-4">
        <div className="w-1/4">
          <h2 className="mb-4 font-bold font-lyon text-5xl tracking-tight md:text-5xl">
            FAQs
          </h2>
          <p className="text text-muted-foreground">
            Can't find the answer you are looking for? <br /> Reach out to us{" "}
            <a
              href="mailto:support@englishnow.com"
              className="text-primary underline"
            >
              here
            </a>
            .
          </p>
        </div>
        <div className="w-3/4">
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-3xl border shadow"
          >
            {faqData.map((item, index) => (
              <AccordionItem
                key={`faq-${item.question.slice(0, 20)}`}
                value={`item-${index}`}
                className="border-b bg-background px-6 first:rounded-t-3xl last:rounded-b-3xl last:border-b-0"
              >
                <AccordionTrigger className="text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
