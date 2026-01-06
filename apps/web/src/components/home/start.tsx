export function Start() {
  // Popular English learning app icons (stylized representations)
  const _apps = [
    { name: "Duolingo", color: "#58CC02", letter: "D" },
    { name: "Babbel", color: "#F7931A", letter: "B" },
    { name: "Rosetta", color: "#0066CC", letter: "R" },
    { name: "Memrise", color: "#FFD028", letter: "M" },
    { name: "Busuu", color: "#E94E1B", letter: "B" },
    { name: "Lingoda", color: "#1A1A2E", letter: "L" },
    { name: "Preply", color: "#00D084", letter: "P" },
    { name: "Cambly", color: "#FFCC00", letter: "C" },
  ];

  return (
    <div className="group mx-auto mt-8 max-w-screen px-2 sm:mt-16 sm:px-6">
      <div className="flex flex-row text-left">
        <div className="w-1/2">
          <h2 className="font-bold font-lyon text-4xl tracking-tight md:text-5xl">
            It was supposed to take a weekend, <br />
            not a quarter.
          </h2>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">
            Master English with one platform built for real progress.
          </p>
        </div>
        <div className="w-1/2">
          <div className="flex items-center gap-3">
            <img
              src="https://www.notion.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fspoqsaf9291f%2F2FoagXHQUpf8Uw9jo5qEcQ%2F2e2e3542e9dc6635a0f706df48aa04d8%2Fasset-calculator.png&w=3840&q=75"
              alt="Start"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
