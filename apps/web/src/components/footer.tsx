import { Link } from "@tanstack/react-router";
export default function Footer() {
  return (
    //         </style><div class="canvas-bg relative flex aspect-[3/2] w-36 flex-row items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-neutral-500/20 bg-clip-padding text-neutral-500" style="animation: 2s ease-in-out infinite alternate bg-zoom;"><div class="absolute left-0 top-0 rounded-br-xl bg-neutral-500/20 px-2 py-1 text-xs font-medium text-neutral-400">Zoom</div><span class="group-focus:text-neutral-200 space-x-0 p-0 font-sans text-2xl/[1] font-extralight text-neutral-400" style="font-variant-numeric: tabular-nums; font-kerning: none; user-select: none; white-space: pre;"><span>⌘</span></span><svg viewBox="0 0 12 12" width="1.2em" height="1.2em" class="size-[0.75em] text-2xl/[1]"><path fill="currentColor" d="M6 2a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 6 2"></path></svg><div class="flex aspect-[2/3] w-10 flex-row items-start justify-start overflow-hidden rounded-3xl border-2 border-neutral-500 bg-neutral-900"><div class="flex h-2/3 w-full flex-col items-center justify-center"><div class="stripes min-h-5 min-w-2.5 rounded-full border-2 border-neutral-400"></div></div></div></div></div></div></div><div class="mt-2 flex flex-col gap-0.5 text-xs font-normal text-neutral-500"><span><span class="font-medium">Trackpad:</span> Using two fingers tap and drag to pan, or pinch to zoom.</span><span><span class="font-medium">Mouse:</span> Drag empty space to pan, hold <span class="text-neutral-400 group-focus:text-neutral-200" style="font-variant-numeric: tabular-nums; font-kerning: none; user-select: none; white-space: pre;"><span>⌘</span></span> and scroll to zoom, or hold <span class="text-neutral-400 group-focus:text-neutral-200" style="font-variant-numeric: tabular-nums; font-kerning: none; user-select: none; white-space: pre;"><span>⇧</span></span> and scroll to pan horizontally.<br></span><span><span class="font-medium">Tip:</span> Double-click a node to bring it to focus, or double-click the empty space to fit all nodes in view!</span></div><div class="mt-2 flex w-full flex-row items-center justify-center"><button class="rounded-full border border-neutral-500 px-5 py-1 text-xs font-normal text-neutral-500 duration-300 hover:scale-105 hover:border-neutral-100 hover:text-neutral-100 pressed:scale-95" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" id="react-aria339673045-_r_17e_">Got it</button></div></div>
    <footer>
      <div className="container relative z-10 mx-auto max-w-5xl px-4 py-2">
        <div className="group mx-auto grid grid-cols-3 border-t pt-12">
          <div className="col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-3">
              <div className="relative size-9 overflow-hidden rounded-xl bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)]">
                <img
                  className="absolute bottom-[-7px] h-full w-full object-contain"
                  src="/logo.svg"
                  alt="English Now Logo"
                  width={32}
                  height={32}
                />
              </div>
            </Link>
            <div className="text-muted-foreground text-sm">
              <a href="https://x.com/tihunov" target="_blank" rel="noopener">
                I'm{" "}
              </a>
              building <span className="font-bold">English.now</span> to help
              you learn English faster and easier. It's not ready yet, but I'm
              working hard to make it better for you.
            </div>
          </div>
          <div className="col-span-2 pl-32">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <h3 className="mb-4 font-medium">Product</h3>
                <ul className="flex flex-col gap-2 text-sm">
                  <li>
                    <Link
                      className="text-muted-foreground leading-6 hover:text-gray-900"
                      to="/"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-muted-foreground leading-6 hover:text-gray-900"
                      to="/pricing"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-muted-foreground leading-6 hover:text-gray-900"
                      to="/faq"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col">
                <h3 className="mb-4 font-medium">Resources</h3>
                <ul className="flex flex-col gap-2 text-sm">
                  <li>
                    <Link
                      className="text-muted-foreground leading-6 hover:text-gray-900"
                      to="/feedback"
                    >
                      Feedback
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-muted-foreground leading-6 hover:text-gray-900"
                      to="/roadmap"
                    >
                      Roadmap
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-muted-foreground leading-6 hover:text-gray-900"
                      to="/updates"
                    >
                      Updates
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col">
                <h3 className="mb-4 font-medium">Company</h3>
                <ul className="flex flex-col gap-2 text-sm">
                  <li>
                    <Link
                      className="text-muted-foreground leading-6 hover:text-gray-900"
                      to="/about"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-muted-foreground leading-6 hover:text-gray-900"
                      to="/privacy"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-muted-foreground leading-6 hover:text-gray-900"
                      to="/terms"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-row items-start justify-between py-3.5 text-muted-foreground text-xs">
          <div className="flex items-center gap-2 text-center">
            <div>
              © {new Date().getFullYear()} English Now. All rights reserved.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"
              />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
