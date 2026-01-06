export const Letter = () => {
  return (
    <div className="max-w-screen px-2 sm:mt-16 sm:px-6">
      <div className="flex justify-center">
        <div className="w-1/2">
          <h2 className="mb-4 font-bold font-lyon text-5xl tracking-tight md:text-5xl">
            Hey, I'm Dmytro.
          </h2>
          <p className="font-lyon text-2xl text-muted-foreground">
            (I built English Now)
          </p>
        </div>
        <div className="w-1/2">
          {/* <div className="mask-[radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)] w-full leading-[23px]"> */}
          <div className="group mx-auto">
            <div className="relative">
              <div className="mb-0">
                <div>
                  <div className="font-semibold text-text-primary">
                    Dear Friend,
                  </div>
                  <div className="mt-1 block sm:hidden">
                    wanderer from
                    <div className="inline-block translate-y-[-1px]">
                      <div
                        className="inline-flex h-[12px] w-[18px] overflow-hidden rounded-[2px] shadow-md saturate-[.9]"
                        title="UA"
                      >
                        <img
                          className="h-full w-full"
                          alt="UA"
                          src="https://purecatamphetamine.github.io/country-flag-icons/3x2/UA.svg"
                        />
                      </div>
                    </div>
                    <span className="ml-1 text-text-primary">Ukraine</span>.
                  </div>

                  <div className="mt-1 hidden sm:block">
                    <button data-state="closed" type="button">
                      <span className="mr-[1px] border-border border-b border-dashed text-text-primary hover:border-primary/60">
                        wanderer
                      </span>
                    </button>
                    &nbsp;from&nbsp;&nbsp;
                    <div className="inline-block translate-y-[-1px]">
                      <div
                        className="inline-flex h-[12px] w-[18px] overflow-hidden rounded-[2px] shadow-md saturate-[.9]"
                        title="UA"
                      >
                        <img
                          className="h-full w-full"
                          alt="UA"
                          src="https://purecatamphetamine.github.io/country-flag-icons/3x2/UA.svg"
                        />
                      </div>
                    </div>
                    <span className="ml-1 text-text-primary">Ukraine</span>.
                  </div>
                </div>
              </div>
              <div className="mt-6">
                There are a million apps promising you fluency in "10 minutes a
                day." You’ve probably tried some. Yet, here you are-still
                feeling like you're missing the "big picture" of how English
                actually works.
              </div>
              <div className="mt-4">
                Unfortunately, most learning platforms are either overwhelming,
                childishly simple, or built to keep you scrolling rather than
                learning. You know?
                <span className="text-text-primary">one minimalistic tool</span>
                , Seline.
              </div>
            </div>
            <div className="pt-1 pb-2">
              <div className="rotate-[-0.1deg]">
                Think of{" "}
                <span className="text-text-primary">Google Analytics</span>, but
                intuitive and fast.
              </div>
              <div className="rotate-[-0.1deg]">
                A tool you'll actually enjoy using daily.
              </div>
              <div className="mt-4 rotate-[-0.1deg]">
                If you're interested in trying our product but not sure where to
                start, feel free to reach out to us via&nbsp;
                <button className="inline-link" type="button">
                  live chat
                </button>
                ,{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-link"
                  href="https://x.com/nstkostya"
                >
                  twitter
                </a>{" "}
                or{" "}
                <a className="inline-link" href="mailto:kostya@seline.com">
                  email
                </a>
                .
              </div>
              <div className="mt-4 rotate-[-0.1deg]">
                Looking forward to have you on board!
              </div>
            </div>
            <div className="">
              <div>Gratefully,</div>
              <div className="mt-3">
                <img
                  alt="signature"
                  loading="lazy"
                  width={300}
                  height={100}
                  decoding="async"
                  data-nimg="1"
                  className="h-auto w-[180px]"
                  style={{ color: "transparent" }}
                  srcSet="/_next/image?url=%2Fimg%2Fsignature.png&w=384&q=75 1x, /_next/image?url=%2Fimg%2Fsignature.png&w=640&q=75 2x"
                  src="/_next/image?url=%2Fimg%2Fsignature.png&w=640&q=75"
                />
              </div>
              <div className="mt-4">
                P.S. Seline is completely{" "}
                <a className="inline-link" href="/pricing">
                  free
                </a>{" "}
                to start.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
