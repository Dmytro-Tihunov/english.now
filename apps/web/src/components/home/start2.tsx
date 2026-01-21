import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
export function Start() {
  return (
    <div className="group mx-auto mt-32 mb-16 max-w-5xl">
      <div className="relative flex w-full flex-row justify-center overflow-hidden rounded-3xl bg-[#EFFF9B] p-6 text-left md:rounded-[2.25rem] md:p-10 dark:bg-orange-950">
        <div className="relative z-10 justify-center text-center">
          <h2 className="font-bold font-lyon text-4xl tracking-tight md:text-5xl">
            It was supposed to take a weekend, <br />
            not a quarter.
          </h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-3">
            <Button
              size="lg"
              asChild
              className="relative inline-flex h-12 shrink-0 cursor-pointer items-center overflow-hidden whitespace-nowrap rounded-2xl bg-linear-to-t from-[#202020] to-[#2F2F2F] text-base text-white shadow-[inset_0_1px_4px_0_rgba(255,255,255,0.4)] outline-none transition-all hover:opacity-90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:from-[rgb(192,192,192)] dark:to-[rgb(255,255,255)] dark:shadow-[inset_0_1px_4px_0_rgba(128,128,128,0.2)] dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none"
            >
              <Link to="/login">Get started for free</Link>
            </Button>
            <span className="text-neutral-500 text-sm">
              7-day free trial, no credit card required
            </span>
          </div>
        </div>
        <img
          className="absolute bottom-[-5px] w-[500px] opacity-5"
          src="/logo.svg"
          alt="English Now Logo"
        />
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            className="md:-bottom-[5rem] absolute bottom-[0rem] left-[0rem] w-full text-[#C6F64D] blur-[60px] md:left-[-4rem] dark:text-pink-600"
            viewBox="0 0 1920 600"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,600 C200,100 800,0 1000,400 C1200,100 1600,200 1920,600 L1920,600 L0,600 Z"
              fill="currentColor"
            />
          </svg>
          <svg
            className="-bottom-[2rem] md:-bottom-[12rem] absolute left-0 w-full text-[#ffffff] blur-[60px] dark:text-violet-500"
            viewBox="0 0 1920 600"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,500 C200,200 600,100 960,300 C1300,100 1600,0 1920,400 L1920,600 L0,600 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
