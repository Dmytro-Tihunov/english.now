import { useEffect, useState } from "react";

// Vocabulary Flashcard Component
function VocabularyCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);

  const words = [
    {
      id: "serendipity",
      word: "Serendipity",
      definition: "Finding something good by chance",
      example: "It was serendipity that we met.",
    },
    {
      id: "eloquent",
      word: "Eloquent",
      definition: "Fluent and persuasive in speaking",
      example: "She gave an eloquent speech.",
    },
    {
      id: "ephemeral",
      word: "Ephemeral",
      definition: "Lasting for a very short time",
      example: "The beauty of cherry blossoms is ephemeral.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFlipped) {
        setCurrentWord((prev) => (prev + 1) % words.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isFlipped]);

  const handleFlip = () => setIsFlipped(!isFlipped);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <button
      type="button"
      className="group relative h-full w-full cursor-pointer border-0 bg-transparent p-0"
      style={{ perspective: "1000px" }}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      aria-label={`Vocabulary flashcard: ${words[currentWord].word}. ${isFlipped ? "Showing definition" : "Tap to reveal definition"}`}
    >
      <div
        className="relative h-full w-full transition-transform duration-700 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front - Word */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl p-6"
          style={{
            backfaceVisibility: "hidden",
            background:
              "linear-gradient(135deg, #EFFF9B 0%, #D8FF76 50%, #C6F64D 100%)",
          }}
        >
          <div className="mb-2 rounded-full bg-white/60 px-3 py-1 font-medium text-black/60 text-xs uppercase tracking-wider">
            Tap to reveal
          </div>
          <span className="font-bold font-lyon text-3xl text-black/90 transition-all duration-300 group-hover:scale-105">
            {words[currentWord].word}
          </span>
          <div className="mt-4 flex gap-1.5">
            {words.map((w, i) => (
              <div
                key={w.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentWord ? "w-6 bg-black/40" : "w-1.5 bg-black/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Back - Definition */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-white p-6"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="mb-1 font-medium text-[#7CB518] text-sm">
            Definition
          </span>
          <span className="mb-4 text-center font-bold font-lyon text-black/90 text-xl">
            {words[currentWord].definition}
          </span>
          <div className="rounded-2xl bg-[#F5FFE0] px-4 py-2 text-center text-black/70 text-sm">
            "{words[currentWord].example}"
          </div>
        </div>
      </div>

      {/* Floating sparkle animation */}
      <div className="-right-2 -top-2 pointer-events-none absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="animate-pulse"
          aria-hidden="true"
        >
          <title>Sparkle decoration</title>
          <path
            d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
            fill="#C6F64D"
          />
        </svg>
      </div>
    </button>
  );
}

// Word Category Sort Component
function CategorySort() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [sortedCards, setSortedCards] = useState<number[]>([]);

  const cards = [
    { id: "happy", word: "happy", color: "#FFE066" },
    { id: "joyful", word: "joyful", color: "#C6F64D" },
    { id: "sad", word: "sad", color: "#A8DADC" },
    { id: "angry", word: "angry", color: "#FF6B6B" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (sortedCards.length < cards.length) {
        setSortedCards((prev) => [...prev, prev.length]);
        setActiveCard(sortedCards.length);
        setTimeout(() => setActiveCard(null), 500);
      } else {
        setSortedCards([]);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [sortedCards.length]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between rounded-3xl bg-[#FAFAFA] p-5">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <span className="font-medium text-black/40 text-xs uppercase tracking-wider">
          Word Sort
        </span>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#C6F64D]" />
          <span className="text-black/40 text-xs">Live</span>
        </div>
      </div>

      {/* Cards area */}
      <div className="relative flex h-24 w-full items-center justify-center gap-2">
        {cards.map((card, i) => {
          const isSorted = sortedCards.includes(i);
          const isActive = activeCard === i;

          return (
            <div
              key={card.id}
              className="relative transition-all duration-500 ease-out"
              style={{
                transform: isSorted
                  ? `translateY(40px) rotate(${(i - 1.5) * 8}deg) scale(0.85)`
                  : isActive
                    ? "translateY(-10px) scale(1.1)"
                    : "translateY(0) scale(1)",
                opacity: isSorted ? 0.6 : 1,
                zIndex: isActive ? 10 : 1,
              }}
            >
              <div
                className="flex h-12 w-16 items-center justify-center rounded-xl shadow-md transition-shadow duration-300 hover:shadow-lg"
                style={{ backgroundColor: card.color }}
              >
                <span className="font-semibold text-black/80 text-xs">
                  {card.word}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Categories */}
      <div className="flex w-full gap-2">
        <div className="flex-1 rounded-xl border-2 border-[#C6F64D]/40 border-dashed bg-[#F5FFE0]/50 p-2 text-center">
          <span className="font-medium text-[10px] text-black/40">
            Positive
          </span>
        </div>
        <div className="flex-1 rounded-xl border-2 border-[#A8DADC]/40 border-dashed bg-[#E8F4F5]/50 p-2 text-center">
          <span className="font-medium text-[10px] text-black/40">
            Negative
          </span>
        </div>
      </div>
    </div>
  );
}

// Pronunciation Practice Component
function PronunciationPractice() {
  const [isListening, setIsListening] = useState(false);
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>(
    Array(12).fill(0.3)
  );
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const cycle = () => {
      // Start listening
      setIsListening(true);
      setScore(null);

      // Animate waves during listening
      const waveInterval = setInterval(() => {
        setWaveAmplitudes(
          Array(12)
            .fill(0)
            .map(() => 0.2 + Math.random() * 0.8)
        );
      }, 100);

      // Stop listening and show score
      setTimeout(() => {
        clearInterval(waveInterval);
        setWaveAmplitudes(Array(12).fill(0.3));
        setIsListening(false);
        setScore(Math.floor(85 + Math.random() * 15));
      }, 2500);
    };

    cycle();
    const interval = setInterval(cycle, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center rounded-3xl bg-linear-to-br from-[#1a1a2e] to-[#16213e] p-6">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: isListening
            ? "radial-gradient(circle at 50% 60%, rgba(198, 246, 77, 0.15) 0%, transparent 60%)"
            : "none",
          opacity: isListening ? 1 : 0,
        }}
      />

      {/* Word to pronounce */}
      <div className="mb-4 text-center">
        <span className="font-medium text-white/40 text-xs uppercase tracking-wider">
          Say this word
        </span>
        <div className="mt-1 font-bold font-lyon text-2xl text-white">
          Pronunciation
        </div>
        <div className="mt-1 text-[#C6F64D]/80 text-sm">/prəˌnʌnsiˈeɪʃən/</div>
      </div>

      {/* Wave visualization */}
      <div className="flex h-16 items-center justify-center gap-1">
        {waveAmplitudes.map((amp, i) => (
          <div
            key={`wave-${i}-${amp.toFixed(2)}`}
            className="w-1.5 rounded-full transition-all duration-100"
            style={{
              height: `${amp * 100}%`,
              backgroundColor: isListening
                ? "#C6F64D"
                : "rgba(255,255,255,0.3)",
              boxShadow: isListening
                ? "0 0 8px rgba(198, 246, 77, 0.5)"
                : "none",
            }}
          />
        ))}
      </div>

      {/* Status / Score */}
      <div className="mt-4">
        {isListening ? (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-[#C6F64D]" />
            <span className="font-medium text-sm text-white/80">
              Listening...
            </span>
          </div>
        ) : score !== null ? (
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="font-bold font-lyon text-3xl text-[#C6F64D]">
                {score}
              </span>
              <span className="text-sm text-white/40">/ 100</span>
            </div>
            <span className="mt-1 text-white/60 text-xs">
              {score >= 95
                ? "Perfect! 🎉"
                : score >= 90
                  ? "Excellent!"
                  : "Great job!"}
            </span>
          </div>
        ) : null}
      </div>

      {/* Mic indicator */}
      <div
        className={`absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
          isListening
            ? "bg-[#C6F64D] shadow-[#C6F64D]/30 shadow-lg"
            : "bg-white/10"
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isListening ? "#1a1a2e" : "rgba(255,255,255,0.5)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <title>Microphone indicator</title>
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </div>
    </div>
  );
}

export function UseCases() {
  return (
    <div className="mx-auto mt-12 max-w-screen px-2 sm:mt-16 sm:px-6">
      {/* Section header */}
      {/* <div className="mb-8 text-center">
        <span className="inline-block rounded-full bg-[#F5FFE0] px-4 py-1.5 font-medium text-[#5A7D00] text-sm">
          Interactive Learning
        </span>
        <h2 className="mt-4 font-bold font-lyon text-3xl tracking-tight md:text-4xl">
          Learn by doing, not by tapping.
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
          Engage with vocabulary, categorize words, and practice pronunciation —
          all in one place.
        </p>
      </div> */}

      <div className="relative flex flex-col items-center justify-center gap-6 lg:flex-row lg:gap-0">
        {/* Card 1 - Vocabulary Flashcard */}
        <div
          className="hover:-rotate-2 lg:-mr-3 relative z-10 mx-2 cursor-pointer overflow-hidden rounded-3xl bg-white transition-all duration-500 ease-out hover:z-50 hover:scale-110 sm:mx-0 lg:z-20 lg:order-1"
          style={{
            minWidth: "300px",
            maxWidth: "300px",
            width: "100%",
            height: "350px",
            boxShadow:
              "rgba(103, 103, 103, 0.08) 0px 0px 0px 1px, rgba(103, 103, 103, 0.12) 0px 4px 16px 0px",
          }}
        >
          <VocabularyCard />
        </div>

        {/* Card 2 - Category Sort */}
        <div
          className="relative z-30 mx-2 cursor-pointer overflow-hidden rounded-3xl bg-white transition-all duration-500 ease-out hover:z-50 hover:scale-110 sm:mx-0 lg:order-2 lg:translate-y-6"
          style={{
            minWidth: "300px",
            maxWidth: "300px",
            width: "100%",
            height: "350px",
            boxShadow:
              "rgba(103, 103, 103, 0.08) 0px 0px 0px 1px, rgba(103, 103, 103, 0.15) 0px 8px 24px 0px",
          }}
        >
          <CategorySort />
        </div>

        {/* Card 3 - Pronunciation Practice */}
        <div
          className="lg:-ml-3 relative z-20 mx-2 cursor-pointer overflow-hidden rounded-3xl transition-all duration-500 ease-out hover:z-50 hover:rotate-2 hover:scale-110 sm:mx-0 lg:z-10 lg:order-3"
          style={{
            minWidth: "300px",
            maxWidth: "300px",
            width: "100%",
            height: "350px",
            boxShadow:
              "rgba(103, 103, 103, 0.08) 0px 0px 0px 1px, rgba(103, 103, 103, 0.12) 0px 4px 16px 0px",
          }}
        >
          <PronunciationPractice />
        </div>
      </div>
    </div>
  );
}
