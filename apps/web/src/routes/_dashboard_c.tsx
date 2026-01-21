// import { createFileRoute } from "@tanstack/react-router";
// import { useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// export const Route = createFileRoute("/_dashboard_c")({
//   component: RouteComponent,
// });

// // Mock data for the dashboard
// const TUTOR_PERSONAS = [
//   {
//     id: "coach",
//     name: "Emma",
//     role: "Encouraging Coach",
//     accent: "British",
//     avatar: "👩‍🏫",
//     description: "Patient and supportive, celebrates every small win",
//     color: "from-emerald-400 to-teal-500",
//   },
//   {
//     id: "professor",
//     name: "James",
//     role: "Strict Professor",
//     accent: "American",
//     avatar: "👨‍🎓",
//     description: "Precise corrections, academic rigor",
//     color: "from-slate-600 to-slate-800",
//   },
//   {
//     id: "friend",
//     name: "Sofia",
//     role: "Casual Friend",
//     accent: "European",
//     avatar: "💬",
//     description: "Relaxed conversations about everyday topics",
//     color: "from-violet-400 to-purple-500",
//   },
// ];

// const PRACTICE_SCENARIOS = [
//   {
//     id: "job",
//     title: "Job Interview",
//     description: "Practice answering common interview questions",
//     icon: "💼",
//     cefrLevel: "B2",
//     duration: "15 min",
//   },
//   {
//     id: "restaurant",
//     title: "At the Restaurant",
//     description: "Order food and handle dietary requirements",
//     icon: "🍽️",
//     cefrLevel: "A2",
//     duration: "10 min",
//   },
//   {
//     id: "bluecard",
//     title: "Blue Card Interview",
//     description: "Navigate German immigration procedures",
//     icon: "🇪🇺",
//     cefrLevel: "B1",
//     duration: "20 min",
//   },
//   {
//     id: "conference",
//     title: "Tech Conference",
//     description: "Present ideas and network professionally",
//     icon: "🎤",
//     cefrLevel: "C1",
//     duration: "25 min",
//   },
// ];

// const RECENT_SESSION = {
//   date: "Today, 2:30 PM",
//   duration: "12 minutes",
//   fluencyScore: 72,
//   cefrLevel: "B1",
//   newWords: ["elaborate", "furthermore", "consequently"],
//   grammarIssues: [
//     {
//       original: "I have went to the store",
//       corrected: "I have gone to the store",
//       explanation: "Use past participle 'gone' with 'have'",
//     },
//     {
//       original: "She don't like coffee",
//       corrected: "She doesn't like coffee",
//       explanation: "Third person singular requires 'doesn't'",
//     },
//   ],
//   pronunciationTips: ["Focus on the 'th' sound in 'furthermore'"],
// };

// function RouteComponent() {
//   const { session } = Route.useRouteContext();
//   const [selectedTutor, setSelectedTutor] = useState(TUTOR_PERSONAS[0]);
//   const [isListening, setIsListening] = useState(false);

//   const firstName = session?.user.name?.split(" ")[0] || "Learner";

//   // Mock user stats
//   const userStats = {
//     streak: 7,
//     totalMinutes: 342,
//     cefrProgress: 65,
//     currentLevel: "B1",
//     wordsLearned: 847,
//   };

//   return (
//     <div className="container relative z-10 mx-auto max-w-5xl px-4 py-6 pt-8">
//       {/* Header with Streak */}
//       <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="font-bold font-lyon text-3xl tracking-tight">
//             Welcome back, {firstName}
//           </h1>
//           <p className="text-muted-foreground">
//             Ready to practice? Your AI tutor is waiting.
//           </p>
//         </div>

//         {/* Daily Streak Badge */}
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 px-4 py-2">
//             <span className="text-2xl">🔥</span>
//             <div>
//               <p className="font-bold text-amber-700 text-lg leading-none">
//                 {userStats.streak} days
//               </p>
//               <p className="text-amber-600/80 text-xs">Daily streak</p>
//             </div>
//           </div>
//           <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 px-4 py-2 sm:flex">
//             <span className="text-xl">⏱️</span>
//             <div>
//               <p className="font-bold text-emerald-700 leading-none">
//                 {userStats.totalMinutes}m
//               </p>
//               <p className="text-emerald-600/80 text-xs">This month</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* Left Column - AI Tutor & Scenarios */}
//         <div className="space-y-6 lg:col-span-2">
//           {/* AI Conversation Card */}
//           <Card className="relative overflow-hidden border-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
//             {/* Animated background pattern */}
//             <div className="pointer-events-none absolute inset-0 opacity-30">
//               <div className="absolute top-0 right-0 size-64 rounded-full bg-[#C6F64D]/20 blur-3xl" />
//               <div className="absolute bottom-0 left-0 size-48 rounded-full bg-violet-500/20 blur-3xl" />
//             </div>

//             <CardContent className="relative p-6">
//               <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
//                 {/* Left side - Tutor preview */}
//                 <div className="flex items-center gap-4">
//                   <div
//                     className={`relative flex size-20 items-center justify-center rounded-2xl bg-linear-to-br ${selectedTutor.color} shadow-lg`}
//                   >
//                     <span className="text-4xl">{selectedTutor.avatar}</span>
//                     {isListening && (
//                       <div className="-inset-1 absolute animate-pulse rounded-2xl border-2 border-[#C6F64D]/50" />
//                     )}
//                   </div>
//                   <div>
//                     <h2 className="font-bold font-lyon text-2xl">
//                       {selectedTutor.name}
//                     </h2>
//                     <p className="text-slate-300">{selectedTutor.role}</p>
//                     <Badge className="mt-1 border-0 bg-white/10 text-white/80">
//                       {selectedTutor.accent} Accent
//                     </Badge>
//                   </div>
//                 </div>

//                 {/* Right side - Start button */}
//                 <div className="flex flex-col items-center gap-3">
//                   <Button
//                     size="lg"
//                     onClick={() => setIsListening(!isListening)}
//                     className={`h-16 w-full rounded-2xl px-8 font-semibold text-lg transition-all md:w-auto ${
//                       isListening
//                         ? "bg-red-500 hover:bg-red-600"
//                         : "bg-[#C6F64D] text-slate-900 hover:bg-[#D8FF76]"
//                     }`}
//                   >
//                     {isListening ? (
//                       <>
//                         <span className="relative flex size-3">
//                           <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
//                           <span className="relative inline-flex size-3 rounded-full bg-white" />
//                         </span>
//                         Listening... Tap to stop
//                       </>
//                     ) : (
//                       <>
//                         <svg
//                           className="size-6"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           aria-hidden="true"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
//                           />
//                         </svg>
//                         Start Conversation
//                       </>
//                     )}
//                   </Button>
//                   <p className="text-center text-slate-400 text-xs">
//                     Speak naturally – I'll wait while you think
//                   </p>
//                 </div>
//               </div>

//               {/* Tutor selector */}
//               <div className="mt-6 border-slate-700 border-t pt-6">
//                 <p className="mb-3 text-slate-400 text-sm">
//                   Choose your tutor:
//                 </p>
//                 <div className="flex gap-3">
//                   {TUTOR_PERSONAS.map((tutor) => (
//                     <button
//                       type="button"
//                       key={tutor.id}
//                       onClick={() => setSelectedTutor(tutor)}
//                       className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
//                         selectedTutor.id === tutor.id
//                           ? "border-[#C6F64D] bg-white/10"
//                           : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
//                       }`}
//                     >
//                       <span className="text-2xl">{tutor.avatar}</span>
//                       <div className="text-center">
//                         <p className="font-medium text-sm">{tutor.name}</p>
//                         <p className="text-slate-400 text-xs">{tutor.role}</p>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Practice Scenarios */}
//           <div>
//             <div className="mb-4 flex items-center justify-between">
//               <h3 className="font-lyon font-semibold text-xl">
//                 Practice Scenarios
//               </h3>
//               <Button variant="ghost" size="sm" className="text-slate-600">
//                 View all →
//               </Button>
//             </div>
//             <div className="grid gap-3 sm:grid-cols-2">
//               {PRACTICE_SCENARIOS.map((scenario) => (
//                 <Card
//                   key={scenario.id}
//                   className="group cursor-pointer border transition-all hover:border-[#C6F64D]/50 hover:shadow-md"
//                 >
//                   <CardContent className="flex items-center gap-4 p-4">
//                     <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-50 text-2xl transition-transform group-hover:scale-110">
//                       {scenario.icon}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <div className="flex items-center gap-2">
//                         <h4 className="truncate font-semibold">
//                           {scenario.title}
//                         </h4>
//                         <Badge
//                           variant="outline"
//                           className="shrink-0 border-slate-300 text-slate-600"
//                         >
//                           {scenario.cefrLevel}
//                         </Badge>
//                       </div>
//                       <p className="truncate text-muted-foreground text-sm">
//                         {scenario.description}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>

//           {/* Last Session Report Card */}
//           <Card className="overflow-hidden border">
//             <div className="flex items-center justify-between border-b bg-slate-50 px-6 py-4">
//               <div>
//                 <h3 className="font-lyon font-semibold text-lg">
//                   Session Report Card
//                 </h3>
//                 <p className="text-muted-foreground text-sm">
//                   {RECENT_SESSION.date} • {RECENT_SESSION.duration}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <div className="flex items-center gap-2">
//                   <span className="font-bold font-lyon text-3xl text-emerald-600">
//                     {RECENT_SESSION.fluencyScore}
//                   </span>
//                   <span className="text-slate-500">/100</span>
//                 </div>
//                 <p className="text-muted-foreground text-xs">Fluency Score</p>
//               </div>
//             </div>
//             <CardContent className="p-6">
//               <div className="grid gap-6 md:grid-cols-3">
//                 {/* New Vocabulary */}
//                 <div>
//                   <h4 className="mb-3 flex items-center gap-2 font-medium text-sm">
//                     <span className="flex size-6 items-center justify-center rounded-full bg-violet-100 text-violet-600">
//                       📚
//                     </span>
//                     New Vocabulary
//                   </h4>
//                   <div className="flex flex-wrap gap-2">
//                     {RECENT_SESSION.newWords.map((word) => (
//                       <Badge
//                         key={word}
//                         variant="outline"
//                         className="cursor-pointer border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100"
//                       >
//                         {word}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Grammar Corrections */}
//                 <div>
//                   <h4 className="mb-3 flex items-center gap-2 font-medium text-sm">
//                     <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">
//                       ✏️
//                     </span>
//                     Grammar Focus
//                   </h4>
//                   <div className="space-y-2 text-sm">
//                     {RECENT_SESSION.grammarIssues.slice(0, 2).map((issue) => (
//                       <div
//                         key={issue.original}
//                         className="rounded-lg bg-amber-50 p-2 text-amber-800"
//                       >
//                         <p className="line-through opacity-60">
//                           {issue.original}
//                         </p>
//                         <p className="font-medium">{issue.corrected}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Pronunciation */}
//                 <div>
//                   <h4 className="mb-3 flex items-center gap-2 font-medium text-sm">
//                     <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
//                       🎯
//                     </span>
//                     Pronunciation Tips
//                   </h4>
//                   <div className="space-y-2 text-sm">
//                     {RECENT_SESSION.pronunciationTips.map((tip) => (
//                       <p
//                         key={tip}
//                         className="rounded-lg bg-emerald-50 p-2 text-emerald-700"
//                       >
//                         {tip}
//                       </p>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Sidebar */}
//         <div className="space-y-6">
//           {/* CEFR Progress */}
//           {/* <Card className="overflow-hidden border">
//             <CardContent className="p-5">
//               <div className="mb-4 flex items-center justify-between">
//                 <h3 className="font-semibold">CEFR Progress</h3>
//                 <Badge className="border-0 bg-linear-to-r from-[#C6F64D] to-[#D8FF76] text-slate-900">
//                   {userStats.currentLevel}
//                 </Badge>
//               </div>

//               <div className="mb-4 flex items-center justify-between text-xs">
//                 {["A1", "A2", "B1", "B2", "C1", "C2"].map((level, i) => (
//                   <div
//                     key={level}
//                     className={`flex flex-col items-center ${
//                       level === userStats.currentLevel
//                         ? "font-bold text-slate-900"
//                         : i < 2
//                           ? "text-emerald-600"
//                           : "text-slate-400"
//                     }`}
//                   >
//                     <span
//                       className={`mb-1 flex size-6 items-center justify-center rounded-full text-[10px] ${
//                         level === userStats.currentLevel
//                           ? "bg-[#C6F64D] text-slate-900"
//                           : i < 2
//                             ? "bg-emerald-100 text-emerald-600"
//                             : "bg-slate-100"
//                       }`}
//                     >
//                       {i < 2
//                         ? "✓"
//                         : level === userStats.currentLevel
//                           ? "→"
//                           : ""}
//                     </span>
//                     {level}
//                   </div>
//                 ))}
//               </div>

//               <div className="mb-2">
//                 <div className="mb-1 flex justify-between text-sm">
//                   <span className="text-slate-600">Progress to B2</span>
//                   <span className="font-medium">{userStats.cefrProgress}%</span>
//                 </div>
//                 <Progress value={userStats.cefrProgress} className="h-2" />
//               </div>

//               <p className="text-muted-foreground text-xs">
//                 Keep practicing to reach B2 – Estimated: 3 weeks
//               </p>
//             </CardContent>
//           </Card> */}

//           {/* Quick Stats */}
//           {/* <Card className="overflow-hidden border">
//             <CardContent className="p-5">
//               <h3 className="mb-4 font-semibold">Your Progress</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100">
//                     <span className="text-lg">📖</span>
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium">{userStats.wordsLearned}</p>
//                     <p className="text-muted-foreground text-xs">
//                       Words learned
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100">
//                     <span className="text-lg">🎯</span>
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium">42</p>
//                     <p className="text-muted-foreground text-xs">
//                       Conversations completed
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100">
//                     <span className="text-lg">⚡</span>
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium">+12%</p>
//                     <p className="text-muted-foreground text-xs">
//                       Fluency improvement
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card> */}

//           {/* Import Content Card */}
//           <Card className="overflow-hidden border border-slate-300 border-dashed bg-slate-50/50">
//             <CardContent className="p-5">
//               <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-white">
//                 <svg
//                   className="size-5 text-slate-600"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
//                   />
//                 </svg>
//               </div>
//               <h4 className="mb-1 font-semibold">Learn from Any Content</h4>
//               <p className="mb-4 text-muted-foreground text-sm">
//                 Paste a URL or text to create a personalized lesson
//               </p>
//               <Button variant="outline" className="w-full">
//                 Import Content
//               </Button>
//             </CardContent>
//           </Card>

//           {/* Privacy Badge */}
//           <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 p-4">
//             <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
//               <svg
//                 className="size-5 text-emerald-600"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                 />
//               </svg>
//             </div>
//             <div>
//               <p className="font-medium text-emerald-800 text-sm">
//                 GDPR Compliant
//               </p>
//               <p className="text-emerald-600 text-xs">
//                 Your data stays in Europe 🇪🇺
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
