import { CheckIcon, StarIcon } from "lucide-react";
import { Button } from "../ui/button";
export function Pricing() {
  const _plans = [
    {
      name: "Free",
      description: "For individuals and small teams.",
      price: 0,
      isPopular: false,
      duration: "forever",
      features: [
        "The best image, video, and audio",
        "Shared workspaces",
        "Collaboration",
        "Personalized voices, and identities",
      ],
    },
    {
      name: "Monthly",
      description: "For teams and businesses.",
      price: 10,
      isPopular: true,
      duration: "month",
      features: [
        "Monitor any public account",
        "Write in any account's style",
        "Shared workspaces",
        "Automated reporting",
        "Video and audio transcription",
        "Scheduled reports",
      ],
    },
    {
      name: "Yearly",
      description: "For teams and businesses.",
      price: 100,
      isPopular: false,
      duration: "year",
      features: [
        "Monitor any public account",
        "Write in any account's style",
        "Shared workspaces",
        "Automated reporting",
        "Video and audio transcription",
        "Scheduled reports",
      ],
    },
  ];
  return (
    <div className="group mx-auto mt-8 max-w-screen px-2 sm:mt-24 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="mb-2 font-bold font-lyon text-5xl tracking-tight md:text-5xl">
          Pricing
        </h2>
        <p className="text-muted-foreground">
          Choose the plan that's right for you and start your journey to fluency
          today.
        </p>
      </div>
      <div className="relative flex w-full flex-row items-end justify-between gap-6">
        {_plans.map((_plan) => {
          const card = (
            <div
              className={`relative min-h-[458px] w-full gap-6 overflow-hidden rounded-3xl border bg-background p-6 ${_plan.isPopular ? "border-[#C6F64D]" : ""}`}
            >
              <div className="relative z-10 mb-4">
                <div className="flex flex-col gap-2">
                  <div
                    data-slot="card-title"
                    className="font-semibold text-black text-xl"
                  >
                    {_plan.name}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {_plan.description}
                  </div>
                </div>
              </div>
              <div className="relative z-10 flex items-baseline">
                <div className="font-bold text-3xl">${_plan.price}</div>
                <div className="flex items-center font-normal text-muted-foreground">
                  /{_plan.duration}
                </div>
              </div>
              <div className="relative z-10 my-6 flex items-center gap-4">
                <Button
                  className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${_plan.isPopular ? "" : ""}`}
                >
                  {_plan.price > 0 ? "Start 7-day trial" : "Get started"}
                </Button>
              </div>
              <div className="relative z-10 mb-4 font-medium text-black text-sm">
                What's included
              </div>
              <ul className="relative z-10 space-y-3 text-sm">
                {_plan.features.map((feature) => (
                  <li
                    className="flex items-center justify-start gap-2"
                    key={feature}
                  >
                    <CheckIcon className="size-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );

          return (
            <div className="w-full" key={_plan.name}>
              {_plan.isPopular ? (
                <div className="relative">
                  <div
                    className="rounded-[1.6rem] p-1"
                    style={{
                      background:
                        "linear-gradient(180deg, #EFFF9B 0%, #D8FF76 60%, #C6F64D 100%)",
                      boxShadow:
                        "inset 0 0 0 1px #C6F64D, inset 0 0 8px 2px #C6F64D",
                    }}
                  >
                    <div className="mt-1.5 mb-2.5 flex items-center justify-center gap-1.5 text-center font-medium text-black text-sm">
                      <StarIcon fill="currentColor" className="size-4" />
                      Most Popular
                    </div>
                    {card}
                  </div>
                </div>
              ) : (
                card
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
