import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Footer from "@/components/footer";
import { Compare } from "@/components/home/compare";
import { Demo } from "@/components/home/demo";
import FAQ from "@/components/home/faq";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { Pricing } from "@/components/home/pricing";
import { useTRPC } from "@/utils/trpc";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const trpc = useTRPC();
  useQuery(trpc.healthCheck.queryOptions());

  return (
    <div className="relative h-full">
      <div className="container relative z-10 mx-auto max-w-5xl px-4 py-2 pt-18">
        <Hero />
        <Demo />
        {/* <AI /> */}
        {/* <UseCases /> */}
        <Features />
        {/* <Letter /> */}
        <Compare />
        <Pricing />
        <FAQ />
        {/* <Start /> */}
      </div>
      <Footer />
    </div>
  );
}
