import { Link } from "@tanstack/react-router";
import { Languages, PlayIcon } from "lucide-react";
import { useState } from "react";
import DialogDemo from "../dialog-demo";
import { Button } from "../ui/button";

export default function Hero() {
	const [open, setOpen] = useState(false);

	return (
		<section className="relative pt-16">
			<DialogDemo open={open} setOpen={setOpen} />
			<div className="relative mx-auto flex flex-col lg:flex-row lg:items-center">
				<div className="flex flex-1 flex-col items-start gap-6">
					<h1 className="font-bold font-lyon text-5xl text-neutral-900 tracking-tight sm:text-5xl lg:text-6xl dark:text-white">
						The last English learning app you <br />
						will ever need.
					</h1>

					<p className="max-w-md text-lg text-muted-foreground leading-relaxed">
						AI-powered English learning app that helps you learn faster and
						easier through personalized lessons, real conversations, and instant
						feedback.
					</p>

					<div className="flex flex-wrap items-center gap-3 pt-2">
						<Button
							size="lg"
							asChild
							className="relative inline-flex h-12 shrink-0 cursor-pointer items-center overflow-hidden whitespace-nowrap rounded-2xl bg-linear-to-t from-[#202020] to-[#2F2F2F] text-base text-white shadow-[inset_0_1px_4px_0_rgba(255,255,255,0.4)] outline-none transition-all hover:opacity-90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:from-[rgb(192,192,192)] dark:to-[rgb(255,255,255)] dark:shadow-[inset_0_1px_4px_0_rgba(128,128,128,0.2)] dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none"
						>
							<Link to="/login">
								Get started
								<span className="font-lyon text-neutral-500 text-xl italic">
									for free
								</span>
							</Link>
						</Button>
						<Button
							size="lg"
							onClick={() => setOpen(true)}
							variant="outline"
							className="h-12 cursor-pointer rounded-2xl border-neutral-300 px-6 text-base hover:bg-neutral-100"
							// style={{
							//   background:
							//     "linear-gradient(0deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.75) 100%)",
							//   boxShadow:
							//     "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 0px 0px rgb(255, 255, 255, 1) inset, 0px 1px 2px 1px rgba(0, 0, 0, 0.06)",
							// }}
						>
							<PlayIcon fill="currentColor" className="size-4" />
							Watch Demo
						</Button>
					</div>

					<div className="flex items-center gap-4 pt-4 text-muted-foreground text-sm">
						<span className="flex items-center gap-1.5">
							<span className="-space-x-1 flex">
								{[1, 2, 3, 4].map((_avatar, _i) => (
									<div
										key={_avatar}
										className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)] font-bold font-lyon text-lime-800 text-xs shadow-xs"
									>
										K
									</div>
								))}
							</span>
							<span>10k+ learners</span>
						</span>
						<span className="h-4 w-px bg-neutral-400" />
						<span>No card required</span>
					</div>
				</div>

				<div className="relative flex-1 overflow-hidden border-border/50 border-b lg:min-h-[440px]">
					<div
						className="absolute right-0 bottom-0 h-full w-full overflow-hidden rounded-t-3xl border border-[#C6F64D] bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)]"
						style={{
							boxShadow: "inset 0 0 0 1px #C6F64D, inset 0 0 8px 2px #C6F64D",
						}}
					/>

					<div
						className="relative bottom-0 left-6 z-20 flex h-[55%] w-[240px] select-none flex-col overflow-hidden rounded-t-3xl border border-[#C6F64D] border-b-0 p-4 shadow-xl lg:absolute"
						style={{
							background:
								"linear-gradient(45deg, white 70%, rgba(255,255,255,0.8) 100%)",
						}}
					>
						{/* svg logo, converted to TSX/JSX (fixed tags, props camelCase, and self-closing) */}
						{/* <svg
              viewBox="0 0 60 76"
              className="z-10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <g filter="url(#filter0_dd_17536_1454)">
                <mask
                  id="mask0_17536_1454"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x={3}
                  y={0}
                  width={55}
                  height={55}
                >
                  <path
                    d="M57.418 0.984375L3.41797 0.984375L3.41797 54.9844L57.418 54.9844L57.418 0.984375Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask0_17536_1454)">
                  <path
                    d="M22.4843 35.4131C21.978 34.7381 21.4718 33.5568 20.4593 32.0381C19.953 31.1943 18.4343 29.5068 17.928 28.8318C17.5905 28.1568 17.5905 27.8193 17.7593 27.1443C17.928 26.1318 18.9405 25.2881 20.1218 25.2881C20.9655 25.2881 21.8093 25.9631 22.4843 26.4693C22.8218 26.8068 23.328 27.4818 23.6655 27.8193C24.003 28.1568 24.003 28.3256 24.3405 28.6631C24.678 29.1693 24.8468 29.5068 24.678 28.8318C24.5093 27.9881 24.3405 26.6381 24.003 25.2881C23.8343 24.2756 23.6655 24.1068 23.4968 23.4318C23.328 22.5881 23.1593 22.0818 22.9905 21.2381C22.8218 20.7318 22.653 19.3818 22.4843 18.7068C22.3155 17.8631 22.3155 16.3443 22.9905 15.6693C23.4968 15.1631 24.5093 14.9943 25.1843 15.3318C26.028 15.8381 26.5343 17.0193 26.703 17.5256C27.0405 18.3693 27.378 19.5506 27.5468 20.9006C27.8843 22.5881 28.3905 25.1193 28.3905 25.6256C28.3905 24.9506 28.2218 23.7693 28.3905 23.0943C28.5593 22.5881 28.8968 21.9131 29.5718 21.7443C30.078 21.5756 30.5843 21.5756 31.0905 21.5756C31.5968 21.7443 32.103 22.0818 32.4405 22.4193C33.1155 23.4318 33.1155 25.6256 33.1155 25.4568C33.2843 24.7818 33.2843 23.4318 33.6218 22.7568C33.7905 22.4193 34.4655 22.0818 34.803 21.9131C35.3093 21.7443 35.9843 21.7443 36.4905 21.9131C36.828 21.9131 37.503 22.4193 37.6718 22.7568C38.0093 23.2631 38.178 24.9506 38.3468 25.6256C38.3468 25.7943 38.5155 24.9506 38.853 24.4443C39.528 23.4318 41.8905 23.0943 42.0593 25.4568C42.0593 26.6381 42.0593 26.4693 42.0593 27.3131C42.0593 28.1568 42.0593 28.6631 42.0593 29.3381C42.0593 30.0131 41.8905 31.5318 41.7218 32.2068C41.553 32.7131 41.0468 33.8943 40.5405 34.5693C40.5405 34.5693 38.6843 36.5943 38.5155 37.6068C38.3468 38.6193 38.3468 38.6193 38.3468 39.2943C38.3468 39.9693 38.5155 40.8131 38.5155 40.8131C38.5155 40.8131 37.1655 40.9818 36.4905 40.8131C35.8155 40.6443 34.9718 39.4631 34.803 38.9568C34.4655 38.4506 33.9593 38.4506 33.6218 38.9568C33.2843 39.6318 32.4405 40.8131 31.7655 40.8131C30.5843 40.9818 28.2218 40.8131 26.5343 40.8131C26.5343 40.8131 26.8718 39.1256 26.1968 38.4506C25.6905 37.9443 24.8468 37.1006 24.3405 36.5943L22.4843 35.4131Z"
                    fill="white"
                  />
                  <path
                    d="M22.4843 35.4131C21.978 34.7381 21.4718 33.5568 20.4593 32.0381C19.953 31.1943 18.4343 29.5068 17.928 28.8318C17.5905 28.1568 17.5905 27.8193 17.7593 27.1443C17.928 26.1318 18.9405 25.2881 20.1218 25.2881C20.9655 25.2881 21.8093 25.9631 22.4843 26.4693C22.8218 26.8068 23.328 27.4818 23.6655 27.8193C24.003 28.1568 24.003 28.3256 24.3405 28.6631C24.678 29.1693 24.8468 29.5068 24.678 28.8318C24.5093 27.9881 24.3405 26.6381 24.003 25.2881C23.8343 24.2756 23.6655 24.1068 23.4968 23.4318C23.328 22.5881 23.1593 22.0818 22.9905 21.2381C22.8218 20.7318 22.653 19.3818 22.4843 18.7068C22.3155 17.8631 22.3155 16.3443 22.9905 15.6693C23.4968 15.1631 24.5093 14.9943 25.1843 15.3318C26.028 15.8381 26.5343 17.0193 26.703 17.5256C27.0405 18.3693 27.378 19.5506 27.5468 20.9006C27.8843 22.5881 28.3905 25.1193 28.3905 25.6256C28.3905 24.9506 28.2218 23.7693 28.3905 23.0943C28.5593 22.5881 28.8968 21.9131 29.5718 21.7443C30.078 21.5756 30.5843 21.5756 31.0905 21.5756C31.5968 21.7443 32.103 22.0818 32.4405 22.4193C33.1155 23.4318 33.1155 25.6256 33.1155 25.4568C33.2843 24.7818 33.2843 23.4318 33.6218 22.7568C33.7905 22.4193 34.4655 22.0818 34.803 21.9131C35.3093 21.7443 35.9843 21.7443 36.4905 21.9131C36.828 21.9131 37.503 22.4193 37.6718 22.7568C38.0093 23.2631 38.178 24.9506 38.3468 25.6256C38.3468 25.7943 38.5155 24.9506 38.853 24.4443C39.528 23.4318 41.8905 23.0943 42.0593 25.4568C42.0593 26.6381 42.0593 26.4693 42.0593 27.3131C42.0593 28.1568 42.0593 28.6631 42.0593 29.3381C42.0593 30.0131 41.8905 31.5318 41.7218 32.2068C41.553 32.7131 41.0468 33.8943 40.5405 34.5693C40.5405 34.5693 38.6843 36.5943 38.5155 37.6068C38.3468 38.6193 38.3468 38.6193 38.3468 39.2943C38.3468 39.9693 38.5155 40.8131 38.5155 40.8131C38.5155 40.8131 37.1655 40.9818 36.4905 40.8131C35.8155 40.6443 34.9718 39.4631 34.803 38.9568C34.4655 38.4506 33.9593 38.4506 33.6218 38.9568C33.2843 39.6318 32.4405 40.8131 31.7655 40.8131C30.5843 40.9818 28.2218 40.8131 26.5343 40.8131C26.5343 40.8131 26.8718 39.1256 26.1968 38.4506C25.6905 37.9443 24.8468 37.1006 24.3405 36.5943L22.4843 35.4131Z"
                    stroke="black"
                    strokeWidth={1.26562}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <mask
                  id="mask2_17536_1454"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x={3}
                  y={0}
                  width={55}
                  height={55}
                >
                  <path
                    d="M57.418 0.984375L3.41797 0.984375L3.41797 54.9844L57.418 54.9844L57.418 0.984375Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask2_17536_1454)">
                  <path
                    d="M36.4961 35.9172V30.1797"
                    stroke="black"
                    strokeWidth={1.26562}
                    strokeLinecap="round"
                  />
                </g>
                <mask
                  id="mask3_17536_1454"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x={3}
                  y={0}
                  width={55}
                  height={55}
                >
                  <path
                    d="M57.418 0.984375L3.41797 0.984375L3.41797 54.9844L57.418 54.9844L57.418 0.984375Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask3_17536_1454)">
                  <path
                    d="M33.118 35.9172L32.9492 30.1797"
                    stroke="black"
                    strokeWidth={1.26562}
                    strokeLinecap="round"
                  />
                </g>
                <mask
                  id="mask4_17536_1454"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x={3}
                  y={0}
                  width={55}
                  height={55}
                >
                  <path
                    d="M57.418 0.984375L3.41797 0.984375L3.41797 54.9844L57.418 54.9844L57.418 0.984375Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask4_17536_1454)">
                  <path
                    d="M29.7422 30.1797V35.9172"
                    stroke="black"
                    strokeWidth={1.26562}
                    strokeLinecap="round"
                  />
                </g>
              </g>
              <defs>
                <filter
                  id="filter0_dd_17536_1454"
                  x={0.140625}
                  y={14.5234}
                  width={59.4258}
                  height={60.75}
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity={0} result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feMorphology
                    radius={3.375}
                    operator="erode"
                    in="SourceAlpha"
                    result="effect1_dropShadow_17536_1454"
                  />
                  <feOffset dy={6.75} />
                  <feGaussianBlur stdDeviation={3.375} />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.03 0 0 0 0.12 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_17536_1454"
                  />
                  <feMorphology
                    radius={3.375}
                    operator="erode"
                    in="SourceAlpha"
                    result="effect2_dropShadow_17536_1454"
                  />
                  <feOffset dy={16.875} />
                  <feGaussianBlur stdDeviation={10.125} />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.09 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="effect1_dropShadow_17536_1454"
                    result="effect2_dropShadow_17536_1454"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect2_dropShadow_17536_1454"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg> */}
						<div className="relative mb-0.5 flex items-center gap-1.5">
							<span className="font-semibold text-sm">Feedback</span>{" "}
							<span className="rounded-md bg-radial from-[#EFFF9B] to-[#D8FF76] px-1.5 py-0.5 font-medium text-black text-sm normal-case tracking-normal md:py-[0.165rem] md:text-xs">
								AI
							</span>
						</div>

						<p className="text-neutral-900 text-sm">
							<span className="font-medium text-xs">Here's your feedback:</span>
							<div className="mt-3 flex flex-col divide-neutral-200">
								<div className="relative h-[48px]">
									<span className="absolute top-0 rounded-t-md bg-[#D8FF76] px-1.5 py-0.5 font-semibold text-lime-700 text-xs">
										Fluency
									</span>
									<span className="absolute bottom-0 rounded-b-md border-2 border-[#D8FF76] bg-[#D8FF76]/50 px-1.5 py-0.5 text-neutral-900 text-sm">
										Good use of phrases.
									</span>
								</div>
								<hr className="my-3 border-neutral-200 border-dashed" />
								<div className="relative h-[74px]">
									<span className="absolute top-0 rounded-t-md bg-[#F8E95F] px-1.5 py-0.5 font-semibold text-[#A55500] text-xs">
										Grammar
									</span>
									<span className="absolute bottom-0 rounded-b-md border-2 border-[#F8E95F] bg-[#F8E95F]/50 px-1.5 py-0.5 text-neutral-900 text-sm leading-[1.45rem]">
										Minor mistakes, ("<b>He go</b>" should be "<b>He goes</b>").
									</span>
								</div>
							</div>
						</p>
					</div>

					<div className="relative z-10 ml-auto h-full w-[370px] max-w-sm select-none overflow-hidden rounded-3xl border border-[#C6F64D] bg-white shadow-xl lg:absolute lg:top-8 lg:right-6">
						<div className="border-border/50 border-b px-4 py-3">
							<div className="flex items-center gap-2">
								<div className="relative size-8 overflow-hidden rounded-xl border border-[#C6F64D] bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)]">
									<img
										className="absolute bottom-[-4px] h-full w-full object-contain"
										src="/logo.svg"
										alt=""
										width={32}
										height={32}
									/>
								</div>
								<span className="font-semibold text-sm">Practice Session</span>
							</div>
						</div>

						<div className="space-y-4 p-4">
							<div className="flex gap-2">
								{/* <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-radial from-[#EFFF9B] to-[#D8FF76]">
									<Sparkles className="size-3.5 text-lime-600" />
								</div> */}
								<div
									className="max-w-[90%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm"
									style={{
										boxShadow:
											"0 0 0 1px #0000000f,0 1px 1px #00000010,inset 0 1px #fff,inset 0 -1px 1px #fff3,inset 0 1px 4px 1px #fff3,inset 0 -2px 1px 1px #0000000f,inset 0 20px 20px #00000002",
									}}
								>
									<p className="text-neutral-900">
										Let's practice ordering at a restaurant. What would you say
										to the waiter?
									</p>
									<div className="mt-1.5 flex items-center gap-1.5">
										<Button
											variant="outline"
											size="sm"
											className="size-7 rounded-lg text-xs"
										>
											<PlayIcon fill="currentColor" className="size-2.5" />
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="size-7 rounded-lg text-xs"
										>
											<svg
												className="size-3"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												width="1em"
												aria-hidden="true"
											>
												<path
													d="m6.25 6.013.675 1.8h-1.35zm1.86 1.443c.777-1.022 1.896-1.762 3.28-2.147C10.576 3.534 8.76 2.5 6.25 2.5 2.778 2.5.625 4.475.625 7.656c0 1.622.563 2.928 1.572 3.819L.625 13.047l.469.703a5.6 5.6 0 0 0 3.378-1.134 7.8 7.8 0 0 0 1.778.197c.256 0 .503-.016.747-.035a7.7 7.7 0 0 1-.122-1.372c0-.853.134-1.634.381-2.344h-2.15l-.35.938H3.437l1.876-5h1.875zm5.64 4.206c.31-.28.575-.621.75-1.037h-1.497c.175.416.44.756.75 1.037zm4.053 3.563 1.572 1.572-.469.703a5.6 5.6 0 0 1-3.378-1.134 7.8 7.8 0 0 1-1.778.197c-3.472 0-5.625-1.975-5.625-5.157S10.278 6.25 13.75 6.25s5.625 1.975 5.625 5.156c0 1.622-.562 2.928-1.572 3.819m-1.24-5.85h-2.188v-.937h-1.25v.937h-2.187v1.25h.778a4.4 4.4 0 0 0 1.006 1.725c-.863.425-1.681.544-1.681.544l.437 1.172a6.3 6.3 0 0 0 2.269-.87 6.3 6.3 0 0 0 2.269.87l.437-1.172s-.819-.119-1.681-.544a4.3 4.3 0 0 0 1.006-1.725h.778v-1.25z"
													fill="currentColor"
												/>
											</svg>
										</Button>
									</div>
								</div>
							</div>

							<div className="flex justify-end">
								<div
									className="rounded-2xl rounded-tr-md bg-radial from-[#EFFF9B] to-[#D8FF76] px-3.5 py-2.5 text-sm"
									style={{
										boxShadow:
											"0 0 0 1px #0000000f,0 1px 1px #00000010,inset 0 1px #fff,inset 0 -1px 1px #fff3,inset 0 1px 4px 1px #fff3,inset 0 -2px 1px 1px #0000000f,inset 0 20px 20px #00000002",
									}}
								>
									<p className="text-neutral-900">
										I would like to order the pasta, please.
									</p>
								</div>
							</div>

							<div className="flex gap-2">
								{/* <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-radial from-[#EFFF9B] to-[#D8FF76]">
									<Sparkles className="size-3.5 text-lime-600" />
								</div> */}
								<div
									className="max-w-[90%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm"
									style={{
										boxShadow:
											"0 0 0 1px #0000000f,0 1px 1px #00000010,inset 0 1px #fff,inset 0 -1px 1px #fff3,inset 0 1px 4px 1px #fff3,inset 0 -2px 1px 1px #0000000f,inset 0 20px 20px #00000002",
									}}
								>
									<p className="text-neutral-900">
										Perfect! <span className="font-medium">98% accuracy</span>.
										Your pronunciation is improving! Keep going!
									</p>
									<div className="mt-1.5 flex items-center gap-1.5">
										<Button
											variant="outline"
											size="sm"
											className="size-7 rounded-lg text-xs"
										>
											<PlayIcon fill="currentColor" className="size-2.5" />
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="size-7 rounded-lg text-xs"
										>
											<svg
												className="size-3"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												width="1em"
												aria-hidden="true"
											>
												<path
													d="m6.25 6.013.675 1.8h-1.35zm1.86 1.443c.777-1.022 1.896-1.762 3.28-2.147C10.576 3.534 8.76 2.5 6.25 2.5 2.778 2.5.625 4.475.625 7.656c0 1.622.563 2.928 1.572 3.819L.625 13.047l.469.703a5.6 5.6 0 0 0 3.378-1.134 7.8 7.8 0 0 0 1.778.197c.256 0 .503-.016.747-.035a7.7 7.7 0 0 1-.122-1.372c0-.853.134-1.634.381-2.344h-2.15l-.35.938H3.437l1.876-5h1.875zm5.64 4.206c.31-.28.575-.621.75-1.037h-1.497c.175.416.44.756.75 1.037zm4.053 3.563 1.572 1.572-.469.703a5.6 5.6 0 0 1-3.378-1.134 7.8 7.8 0 0 1-1.778.197c-3.472 0-5.625-1.975-5.625-5.157S10.278 6.25 13.75 6.25s5.625 1.975 5.625 5.156c0 1.622-.562 2.928-1.572 3.819m-1.24-5.85h-2.188v-.937h-1.25v.937h-2.187v1.25h.778a4.4 4.4 0 0 0 1.006 1.725c-.863.425-1.681.544-1.681.544l.437 1.172a6.3 6.3 0 0 0 2.269-.87 6.3 6.3 0 0 0 2.269.87l.437-1.172s-.819-.119-1.681-.544a4.3 4.3 0 0 0 1.006-1.725h.778v-1.25z"
													fill="currentColor"
												/>
											</svg>
										</Button>
									</div>
								</div>
							</div>

							<div className="flex justify-end">
								<div
									className="rounded-2xl rounded-tr-md bg-radial from-[#EFFF9B] to-[#D8FF76] px-3.5 py-2.5 text-sm"
									style={{
										boxShadow:
											"0 0 0 1px #0000000f,0 1px 1px #00000010,inset 0 1px #fff,inset 0 -1px 1px #fff3,inset 0 1px 4px 1px #fff3,inset 0 -2px 1px 1px #0000000f,inset 0 20px 20px #00000002",
									}}
								>
									<p className="text-neutral-900">Thank you!</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
