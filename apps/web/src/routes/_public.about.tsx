import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/about")({
  component: About,
});

export default function About() {
  return (
    <div className="container relative z-10 mx-auto max-w-5xl px-4 py-2 pt-18">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="mb-6 font-bold font-lyon text-4xl tracking-tight md:text-5xl">
          Why I am Building English Now
        </h1>
      </div>

      {/* Story Section */}
      <article className="prose prose-lg mx-auto max-w-none">
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p className="text-xl leading-relaxed">
            Hi, I'm Dmytro. I grew up in Ukraine where learning English felt
            like an impossible mountain to climb. Traditional classes were
            boring, textbooks were outdated, and apps felt more like games than
            real learning tools.
          </p>

          <p>
            After years of struggling, I finally became fluent — but not through
            any app or course. It happened when I started having real
            conversations, making mistakes, and learning from native speakers
            who corrected me patiently.
          </p>

          <p>
            That's when it hit me:{" "}
            <span className="font-medium text-foreground">
              the best way to learn a language is by actually using it.
            </span>{" "}
            Not by memorizing vocabulary lists or completing gamified lessons
            that give you points but don't prepare you for real-world
            conversations.
          </p>

          <div className="my-12 rounded-2xl border-[#C6F64D] border-l-4 bg-[#C6F64D]/5 p-6 pl-8">
            <p className="mb-0 font-medium text-foreground italic">
              "I wanted to build something that I wish existed when I was
              learning English — a tool that feels like having a patient,
              always-available friend who helps you practice and improve."
            </p>
          </div>

          <p>
            English Now is my answer to everything that frustrated me about
            language learning. It's built on a simple belief: AI can be that
            patient friend. It never judges your mistakes, it's available 24/7,
            and it adapts to exactly where you are in your learning journey.
          </p>
        </div>
      </article>

      {/* Mission Section */}
      <section className="mt-20 mb-16">
        <div className="rounded-3xl border bg-linear-to-br from-neutral-50 to-white p-8 md:p-12">
          <h2 className="mb-6 font-bold font-lyon text-2xl md:text-3xl">
            Our Mission
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C6F64D]/20">
                <svg
                  className="h-5 w-5 text-[#7a9a2e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Real Conversations</h3>
                <p className="text-muted-foreground text-sm">
                  Practice speaking with AI that responds naturally, just like a
                  real conversation partner.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C6F64D]/20">
                <svg
                  className="h-5 w-5 text-[#7a9a2e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Learn Faster</h3>
                <p className="text-muted-foreground text-sm">
                  Personalized learning paths that adapt to your level and focus
                  on what you need most.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C6F64D]/20">
                <svg
                  className="h-5 w-5 text-[#7a9a2e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">No Judgment</h3>
                <p className="text-muted-foreground text-sm">
                  Make mistakes freely. AI is patient and helps you improve
                  without embarrassment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C6F64D]/20">
                <svg
                  className="h-5 w-5 text-[#7a9a2e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Always Available</h3>
                <p className="text-muted-foreground text-sm">
                  Practice anytime, anywhere. Your AI language partner is ready
                  when you are.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
