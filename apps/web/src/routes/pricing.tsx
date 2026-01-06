import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon, SparklesIcon, ZapIcon } from "lucide-react";
import { useState } from "react";
import Footer from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started with English learning",
    price: { monthly: 0, yearly: 0 },
    features: [
      "5 AI conversations per day",
      "Basic grammar lessons",
      "Limited vocabulary exercises",
      "Progress tracking",
      "Community access",
    ],
    cta: "Get Started",
    popular: false,
    icon: ZapIcon,
  },
  {
    name: "Pro",
    description: "For serious learners who want to accelerate their progress",
    price: { monthly: 12, yearly: 99 },
    features: [
      "Unlimited AI conversations",
      "Advanced grammar & pronunciation",
      "Full vocabulary library",
      "Personalized learning path",
      "Progress analytics",
      "Offline mode",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
    icon: SparklesIcon,
  },
  {
    name: "Team",
    description: "Best for schools, companies, and learning groups",
    price: { monthly: 29, yearly: 249 },
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Admin dashboard",
      "Team progress reports",
      "Custom learning goals",
      "Dedicated account manager",
      "API access",
    ],
    cta: "Contact Sales",
    popular: false,
    icon: SparklesIcon,
  },
];

const faqs = [
  {
    question: "Can I switch between plans?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate applies at your next billing cycle.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Absolutely! We offer a 7-day free trial for our Pro plan. No credit card required to start. You can explore all Pro features and decide if it's right for you.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. For Team plans, we also offer invoice-based billing.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. No questions asked, no hidden fees.",
  },
  {
    question: "Do you offer student discounts?",
    answer:
      "Yes! Students with a valid .edu email address get 50% off all paid plans. Contact our support team with proof of enrollment to claim your discount.",
  },
  {
    question: "How does the AI conversation feature work?",
    answer:
      "Our AI tutor uses advanced language models to simulate natural English conversations. It adapts to your level, corrects your mistakes in real-time, and provides personalized feedback to help you improve faster.",
  },
  {
    question: "Is my learning progress saved if I cancel?",
    answer:
      "Your progress is always saved, even if you cancel or switch to the free plan. You can pick up where you left off whenever you decide to come back.",
  },
];

function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly"
  );

  return (
    <div className="relative min-h-screen">
      {/* Background pattern */}
      <div className="-z-10 absolute inset-0 overflow-hidden">
        <div className="-top-40 absolute right-0 h-[500px] w-[500px] rounded-full bg-[#C6F64D]/20 blur-3xl" />
        <div className="-bottom-40 absolute left-0 h-[400px] w-[400px] rounded-full bg-[#C6F64D]/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4 py-16 pt-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C6F64D]/30 bg-[#C6F64D]/10 px-4 py-1.5 text-sm">
            <span className="font-medium text-[#7a9a2e]">Simple Pricing</span>
          </div>
          <h1 className="mb-4 font-bold font-lyon text-4xl tracking-tight md:text-5xl lg:text-6xl">
            Choose your path to
            <br />
            <span className="bg-linear-to-r from-[#7a9a2e] to-[#C6F64D] bg-clip-text text-transparent">
              English fluency
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Start free and upgrade when you're ready. All plans include access
            to our AI-powered learning tools.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "rounded-full px-5 py-2 font-medium text-sm transition-all",
              billingCycle === "monthly"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2 font-medium text-sm transition-all",
              billingCycle === "yearly"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
            <span className="rounded-full bg-[#C6F64D] px-2 py-0.5 font-semibold text-[#3d4d17] text-xs">
              Save 30%
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="mb-24 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-3xl border p-8 transition-all duration-300",
                plan.popular
                  ? "border-[#C6F64D] bg-linear-to-b from-[#C6F64D]/5 to-transparent shadow-[#C6F64D]/10 shadow-lg"
                  : "border-border bg-card hover:border-[#C6F64D]/50"
              )}
            >
              {plan.popular && (
                <div className="-top-3 -translate-x-1/2 absolute left-1/2">
                  <span className="rounded-full bg-[#C6F64D] px-4 py-1 font-semibold text-[#3d4d17] text-xs uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div
                  className={cn(
                    "mb-4 inline-flex size-12 items-center justify-center rounded-2xl",
                    plan.popular ? "bg-[#C6F64D]/20" : "bg-muted"
                  )}
                >
                  <plan.icon
                    className={cn(
                      "size-6",
                      plan.popular ? "text-[#7a9a2e]" : "text-muted-foreground"
                    )}
                  />
                </div>
                <h3 className="mb-2 font-bold font-lyon text-2xl">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="font-bold font-lyon text-5xl">
                    ${plan.price[billingCycle]}
                  </span>
                  {plan.price[billingCycle] > 0 && (
                    <span className="text-muted-foreground">
                      /{billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  )}
                </div>
                {billingCycle === "yearly" && plan.price.yearly > 0 && (
                  <p className="mt-1 text-muted-foreground text-sm">
                    ${(plan.price.yearly / 12).toFixed(2)}/mo billed annually
                  </p>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                        plan.popular ? "bg-[#C6F64D]/20" : "bg-muted"
                      )}
                    >
                      <CheckIcon
                        className={cn(
                          "size-3",
                          plan.popular
                            ? "text-[#7a9a2e]"
                            : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full rounded-xl py-6 font-semibold",
                  plan.popular
                    ? "bg-[#C6F64D] text-[#3d4d17] hover:bg-[#b8e845]"
                    : ""
                )}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQs Section */}
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C6F64D]/30 bg-[#C6F64D]/10 px-4 py-1.5 text-sm">
              <span className="font-medium text-[#7a9a2e]">FAQ</span>
            </div>
            <h2 className="mb-4 font-bold font-lyon text-3xl tracking-tight md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about our pricing and plans.
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="divide-y rounded-3xl border bg-card"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="px-6"
              >
                <AccordionTrigger className="py-5 text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-16 rounded-3xl border border-[#C6F64D]/30 bg-linear-to-br from-[#C6F64D]/10 to-transparent p-8 text-center md:p-12">
            <h3 className="mb-3 font-bold font-lyon text-2xl">
              Still have questions?
            </h3>
            <p className="mb-6 text-muted-foreground">
              Can't find the answer you're looking for? Our team is here to
              help.
            </p>
            <Button
              variant="outline"
              className="rounded-xl px-6 py-5 font-semibold"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
