import {
    BookOpen,
    BrainCircuit,
    GraduationCap,
    MessageCircle,
    Mic,
    Sparkles,
  } from "lucide-react";
  import { useEffect, useState } from "react";

  
  // AI Chat Demo Component
  function AIChatDemo() {
    const [messages, setMessages] = useState<
      { role: "user" | "ai"; text: string; typing?: boolean }[]
    >([]);
  
    const conversation = [
      { role: "user" as const, text: "How do I use 'would have'?" },
      {
        role: "ai" as const,
        text: "Great question! 'Would have' expresses unreal past situations. For example: 'I would have called if I had known.'",
      },
    ];
  
    useEffect(() => {
      const timers: NodeJS.Timeout[] = [];
  
      const runConversation = () => {
        setMessages([]);
  
        // User message
        timers.push(
          setTimeout(() => {
            setMessages([conversation[0]]);
          }, 800)
        );
  
        // AI typing indicator
        timers.push(
          setTimeout(() => {
            setMessages([conversation[0], { role: "ai", text: "", typing: true }]);
          }, 1500)
        );
  
        // AI response
        timers.push(
          setTimeout(() => {
            setMessages([conversation[0], conversation[1]]);
          }, 2800)
        );
      };
  
      runConversation();
      const interval = setInterval(runConversation, 7000);
  
      return () => {
        timers.forEach(clearTimeout);
        clearInterval(interval);
      };
    }, [conversation[1]conversation[0]]);
  
    return (
      <div className="flex h-full flex-col">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-purple-600">
            <Sparkles className="size-3.5 text-white" />
          </div>
          <span className="font-medium text-sm">Nova AI</span>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 text-xs dark:bg-emerald-900/30 dark:text-emerald-400">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Online
          </span>
        </div>
  
        <div className="flex flex-1 flex-col gap-2.5 overflow-hidden">
          {messages.map((msg) => (
            <div
              key={`${msg.role}-${msg.text.slice(0, 10)}`}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm transition-all duration-300 ${
                  msg.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground"
                }`}
                style={{
                  animation: "fadeSlideIn 0.3s ease-out",
                }}
              >
                {msg.typing ? (
                  <div className="flex gap-1 py-1">
                    <span className="size-1.5 animate-bounce rounded-full bg-current opacity-60" />
                    <span
                      className="size-1.5 animate-bounce rounded-full bg-current opacity-60"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="size-1.5 animate-bounce rounded-full bg-current opacity-60"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Speaking Wave Animation
  const WAVE_IDS = ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8"] as const;
  
  function SpeakingDemo() {
    const [isActive, setIsActive] = useState(false);
    const [waves, setWaves] = useState<number[]>(Array(8).fill(0.3));
  
    useEffect(() => {
      const cycle = () => {
        setIsActive(true);
        const waveInterval = setInterval(() => {
          setWaves(
            Array(8)
              .fill(0)
              .map(() => 0.2 + Math.random() * 0.8)
          );
        }, 80);
  
        setTimeout(() => {
          clearInterval(waveInterval);
          setWaves(Array(8).fill(0.3));
          setIsActive(false);
        }, 2500);
      };
  
      cycle();
      const interval = setInterval(cycle, 4500);
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="mb-4 text-center">
          <div className="font-bold font-lyon text-lg">"Entrepreneur"</div>
          <div className="text-muted-foreground text-xs">/ˌɒntrəprəˈnɜːr/</div>
        </div>
  
        <div className="flex h-12 items-center justify-center gap-1">
          {waves.map((amp, i) => (
            <div
              key={WAVE_IDS[i]}
              className="w-1.5 rounded-full transition-all duration-100"
              style={{
                height: `${amp * 100}%`,
                backgroundColor: isActive
                  ? "#C6F64D"
                  : "var(--color-muted-foreground)",
                opacity: isActive ? 1 : 0.3,
              }}
            />
          ))}
        </div>
  
        <div className="mt-4 flex items-center gap-2">
          <div
            className={`flex size-10 items-center justify-center rounded-full transition-all duration-300 ${
              isActive
                ? "bg-[#C6F64D] shadow-[#C6F64D]/30 shadow-lg"
                : "bg-muted"
            }`}
          >
            <Mic
              className={`size-5 transition-colors ${isActive ? "text-black" : "text-muted-foreground"}`}
            />
          </div>
        </div>
  
        {isActive && (
          <div className="fade-in mt-3 animate-in text-muted-foreground text-xs">
            Listening...
          </div>
        )}
      </div>
    );
  }
  
  // Vocabulary Progress Demo
  function VocabularyDemo() {
    const words = [
      { word: "Resilient", learned: true },
      { word: "Ephemeral", learned: true },
      { word: "Ubiquitous", learned: true },
      { word: "Eloquent", learned: false },
      { word: "Pragmatic", learned: false },
    ];
  
    return (
      <div className="flex h-full flex-col">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-medium text-sm">Today's Words</span>
          <span className="text-muted-foreground text-xs">3/5 learned</span>
        </div>
  
        <div className="flex flex-col gap-2">
          {words.map((w, i) => (
            <div
              key={w.word}
              className={`flex items-center justify-between rounded-xl px-3 py-2 transition-all duration-300 ${
                w.learned
                  ? "bg-[#F5FFE0] dark:bg-[#C6F64D]/10"
                  : "bg-muted/50"
              }`}
              style={{
                animationDelay: `${i * 100}ms`,
              }}
            >
              <span
                className={`text-sm ${w.learned ? "text-[#5A7D00] dark:text-[#C6F64D]" : "text-muted-foreground"}`}
              >
                {w.word}
              </span>
              {w.learned && (
                <svg
                  className="size-4 text-[#7CB518]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <title>Learned</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Grammar Quiz Demo
  function GrammarDemo() {
    const [selected, setSelected] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
  
    useEffect(() => {
      const cycle = () => {
        setSelected(null);
        setShowResult(false);
  
        setTimeout(() => {
          setSelected(1);
        }, 1200);
  
        setTimeout(() => {
          setShowResult(true);
        }, 1800);
      };
  
      cycle();
      const interval = setInterval(cycle, 5000);
      return () => clearInterval(interval);
    }, []);
  
    const options = ["has been", "had been", "have been", "was being"];
  
    return (
      <div className="flex h-full flex-col">
        <div className="mb-3 rounded-lg bg-muted/50 p-2.5">
          <span className="text-muted-foreground text-xs">Fill in the blank:</span>
          <p className="mt-1 text-sm">
            She <span className="font-semibold text-[#7CB518]">___</span> waiting
            for two hours when he arrived.
          </p>
        </div>
  
        <div className="grid grid-cols-2 gap-2">
          {options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              className={`rounded-xl border px-3 py-2 text-left text-sm transition-all duration-200 ${
                selected === i
                  ? showResult
                    ? i === 1
                      ? "border-[#7CB518] bg-[#F5FFE0] text-[#5A7D00] dark:bg-[#C6F64D]/10 dark:text-[#C6F64D]"
                      : "border-red-300 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "border-foreground/20 bg-foreground/5"
                  : "border-border hover:border-foreground/20"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
  
        {showResult && selected === 1 && (
          <div className="fade-in mt-3 animate-in text-[#7CB518] text-xs">
            ✓ Correct! Past perfect continuous.
          </div>
        )}
      </div>
    );
  }
  
  // Course Progress Demo
  function CoursesDemo() {
    const courses = [
      { name: "Business English", progress: 72, color: "from-blue-500 to-indigo-600" },
      { name: "Grammar Mastery", progress: 45, color: "from-violet-500 to-purple-600" },
      { name: "Daily Conversations", progress: 88, color: "from-emerald-500 to-teal-600" },
    ];
  
    return (
      <div className="flex h-full flex-col">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-medium text-sm">Your Courses</span>
          <span className="text-muted-foreground text-xs">3 active</span>
        </div>
  
        <div className="flex flex-col gap-3">
          {courses.map((course) => (
            <div key={course.name} className="group">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm">{course.name}</span>
                <span className="text-muted-foreground text-xs">
                  {course.progress}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full bg-linear-to-r transition-all duration-500 ${course.color}`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  const features = [
    {
      id: "courses",
      icon: GraduationCap,
      title: "Structured Courses",
      description: "Follow curated learning paths from beginner to advanced",
      demo: CoursesDemo,
      accent: "from-blue-500 to-indigo-600",
    },
    {
      id: "grammar",
      icon: BookOpen,
      title: "Grammar Practice",
      description: "Master rules with interactive exercises and instant feedback",
      demo: GrammarDemo,
      accent: "from-violet-500 to-purple-600",
    },
    {
      id: "vocabulary",
      icon: BrainCircuit,
      title: "Vocabulary Builder",
      description: "Expand your word power with spaced repetition",
      demo: VocabularyDemo,
      accent: "from-amber-500 to-orange-600",
    },
    {
      id: "speaking",
      icon: Mic,
      title: "Speaking Practice",
      description: "Perfect your pronunciation with AI-powered feedback",
      demo: SpeakingDemo,
      accent: "from-emerald-500 to-teal-600",
    },
    {
      id: "ai",
      icon: MessageCircle,
      title: "AI Tutor",
      description: "Get instant answers and personalized guidance 24/7",
      demo: AIChatDemo,
      accent: "from-rose-500 to-pink-600",
    },
  ];
  
  export function Features() {
    return (
      <div className="mx-auto mt-20 max-w-screen px-2 sm:mt-32 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="font-bold font-lyon text-4xl tracking-tight md:text-5xl">
            Everything you need to
            <br />
            <span className="bg-linear-to-r from-[#7CB518] to-[#C6F64D] bg-clip-text text-transparent">
              master English
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            Five powerful tools, one seamless experience. Practice smarter, not
            harder.
          </p>
        </div>
  
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.id}
              className={`group relative overflow-hidden rounded-3xl border bg-card p-5 transition-all duration-300 hover:border-foreground/10 hover:shadow-lg ${
                i === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Icon and title */}
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl bg-linear-to-br ${feature.accent} text-white shadow-lg`}
                >
                  <feature.icon className="size-5" />
                </div>
              </div>
  
              <h3 className="mb-1 font-semibold text-lg">{feature.title}</h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {feature.description}
              </p>
  
              {/* Interactive demo */}
              <div className="h-48 rounded-2xl border bg-background/50 p-4">
                <feature.demo />
              </div>
  
              {/* Subtle gradient overlay on hover */}
              <div
                className={`pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-[0.03] ${feature.accent}`}
              />
            </div>
          ))}
        </div>
  
        <style>{`
          @keyframes fadeSlideIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }
  