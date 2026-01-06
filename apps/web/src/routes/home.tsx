import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getUser } from "@/functions/get-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getUser();
    return { session };
  },
  loader: async ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

// Mock data for the dashboard - client-side only
const mockUserStats = {
  streak: 12,
  totalWordsLearned: 847,
  lessonsCompleted: 34,
  minutesToday: 18,
  dailyGoal: 30,
  weeklyXp: 1250,
  currentLevel: "B1",
  accuracy: 87,
};

const mockCourses = [
  {
    id: 1,
    title: "Grammar Fundamentals",
    description: "Master English grammar rules",
    progress: 72,
    totalLessons: 24,
    completedLessons: 17,
    icon: "📚",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
  },
  {
    id: 2,
    title: "Vocabulary Builder",
    description: "Expand your word power",
    progress: 45,
    totalLessons: 40,
    completedLessons: 18,
    icon: "📝",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
  },
  {
    id: 3,
    title: "Speaking Practice",
    description: "Improve pronunciation & fluency",
    progress: 28,
    totalLessons: 20,
    completedLessons: 6,
    icon: "🎙️",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
  },
  {
    id: 4,
    title: "Business English",
    description: "Professional communication",
    progress: 15,
    totalLessons: 30,
    completedLessons: 5,
    icon: "💼",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
  },
];

const mockWeeklyActivity = [
  { day: "Mon", minutes: 25, completed: true },
  { day: "Tue", minutes: 32, completed: true },
  { day: "Wed", minutes: 18, completed: true },
  { day: "Thu", minutes: 45, completed: true },
  { day: "Fri", minutes: 12, completed: false },
  { day: "Sat", minutes: 28, completed: true },
  { day: "Sun", minutes: 18, completed: false },
];

const mockRecentActivity = [
  {
    id: 1,
    type: "lesson",
    title: "Past Perfect Tense",
    course: "Grammar Fundamentals",
    xp: 50,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "vocabulary",
    title: "Academic Words Set 5",
    course: "Vocabulary Builder",
    xp: 30,
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    type: "speaking",
    title: "Interview Practice",
    course: "Speaking Practice",
    xp: 75,
    timestamp: "Yesterday",
  },
];

const mockAchievements = [
  { id: 1, name: "Week Warrior", icon: "🏆", unlocked: true },
  { id: 2, name: "Vocab Master", icon: "📖", unlocked: true },
  { id: 3, name: "Perfect Score", icon: "⭐", unlocked: true },
  { id: 4, name: "Early Bird", icon: "🌅", unlocked: false },
  { id: 5, name: "Night Owl", icon: "🦉", unlocked: false },
];

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const firstName = session?.user.name?.split(" ")[0] || "Learner";

  return (
    <div className="container relative z-10 mx-auto max-w-6xl px-4 py-6 pt-16">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="font-bold font-lyon text-3xl tracking-tight">
            Welcome back, {firstName}
          </h1>
          <div className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-orange-500 to-red-500 px-3 py-1 text-white shadow-lg shadow-orange-200">
            <span className="text-lg">🔥</span>
            <span className="font-bold">{mockUserStats.streak}</span>
            <span className="text-sm opacity-90">day streak</span>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">
          Keep up the great work! You're making excellent progress.
        </p>
      </div>

      {/* Stats Overview */}
      {/* <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Words Learned"
          value={mockUserStats.totalWordsLearned}
          icon="📚"
          trend="+24 this week"
          color="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Lessons Done"
          value={mockUserStats.lessonsCompleted}
          icon="✅"
          trend="+5 this week"
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Weekly XP"
          value={mockUserStats.weeklyXp.toLocaleString()}
          icon="⚡"
          trend="Top 15%"
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Accuracy"
          value={`${mockUserStats.accuracy}%`}
          icon="🎯"
          trend="+3% vs last week"
          color="bg-blue-50 text-blue-600"
        />
      </div> */}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Courses & Progress */}
        <div className="space-y-6 lg:col-span-2">
          {/* Course Accelerator */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardContent className="p-6">
              {/* Header */}
              <div className="mb-4">
                <h2 className="font-bold font-lyon text-xl">
                  English Fluency Accelerator
                </h2>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Week 1 of 4 • Grammar Foundations
                  </span>
                  <span className="font-medium text-sm">18% Complete</span>
                </div>
              </div>

              {/* Progress Bar Segments */}
              <div className="mb-6 flex gap-1.5">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[72%] rounded-full bg-amber-500" />
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-0 rounded-full bg-slate-300" />
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-0 rounded-full bg-slate-300" />
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-0 rounded-full bg-slate-300" />
                </div>
              </div>

              {/* Current Week Module */}
              <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full border-2 border-amber-500 text-amber-600">
                      <svg
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Week 1: Grammar Foundations
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Current Module
                      </p>
                    </div>
                  </div>
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    🏆 You're ahead of 142 peers
                  </Badge>
                </div>

                {/* Current Lesson */}
                <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-violet-100 to-purple-100">
                    <span className="text-3xl">📚</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-slate-300 text-slate-600"
                      >
                        ○ 77% Done
                      </Badge>
                    </div>
                    <h4 className="font-semibold">Past Perfect Tense</h4>
                    <p className="text-muted-foreground text-sm">
                      Video • 12m remaining
                    </p>
                  </div>
                  <Button className="shrink-0 bg-slate-900 hover:bg-slate-800">
                    Resume
                  </Button>
                </div>
              </div>

              {/* Assignment Card */}
              <div className="mb-4 rounded-xl border-2 border-rose-200 bg-rose-50/50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-slate-900">
                      Assignment: Write a Short Story
                    </h4>
                    <p className="mt-1 text-muted-foreground text-sm">
                      Use past perfect tense in at least 5 sentences.
                    </p>
                    <Link
                      to="/courses"
                      className="mt-2 inline-flex items-center gap-1 font-medium text-rose-600 text-sm hover:text-rose-700"
                    >
                      View Assignment
                      <svg
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                  <div className="shrink-0 rounded-lg border border-rose-200 bg-white px-3 py-2 text-center">
                    <div className="flex items-center gap-1 text-rose-600 text-xs">
                      <svg
                        className="size-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-semibold uppercase">Time Left</span>
                    </div>
                    <p className="mt-0.5 font-bold text-lg text-slate-900">
                      2d 4h
                    </p>
                  </div>
                </div>
              </div>

              {/* Locked Week */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 opacity-60">
                <div className="flex size-10 items-center justify-center rounded-full border-2 border-slate-300 text-slate-400">
                  <svg
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-slate-500">
                    Week 2: Vocabulary Mastery
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Unlocks in 6 days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Progress */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold font-lyon text-xl">Your Courses</h2>
              <Link
                to="/courses"
                className="text-muted-foreground text-sm hover:text-foreground"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {mockCourses.map((course) => (
                <Card
                  key={course.id}
                  className={cn(
                    "group hover:-translate-y-1 cursor-pointer border-0 shadow-sm transition-all duration-300 hover:shadow-lg",
                    selectedCourse === course.id && "ring-2 ring-primary"
                  )}
                  onClick={() =>
                    setSelectedCourse(
                      selectedCourse === course.id ? null : course.id
                    )
                  }
                >
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div
                        className={cn(
                          "flex size-12 items-center justify-center rounded-xl text-2xl",
                          course.bgColor
                        )}
                      >
                        {course.icon}
                      </div>
                      <Badge variant="secondary" className="font-medium">
                        {course.progress}%
                      </Badge>
                    </div>
                    <h3 className="mb-1 font-semibold">{course.title}</h3>
                    <p className="mb-3 text-muted-foreground text-sm">
                      {course.description}
                    </p>
                    <div className="space-y-2">
                      <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={cn(
                            "h-full rounded-full bg-linear-to-r transition-all duration-500",
                            course.color
                          )}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {course.completedLessons} of {course.totalLessons}{" "}
                        lessons
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Weekly Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-lyon text-lg">
                Weekly Activity
              </CardTitle>
              <CardDescription>Your learning pattern this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2">
                {mockWeeklyActivity.map((day, i) => (
                  <div
                    key={day.day}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="relative w-full">
                      <div
                        className={cn(
                          "mx-auto w-8 rounded-t-lg transition-all duration-300",
                          day.completed
                            ? "bg-linear-to-t from-emerald-500 to-emerald-400"
                            : "bg-slate-200"
                        )}
                        style={{
                          height: `${Math.max(day.minutes * 2, 20)}px`,
                        }}
                      />
                      {day.minutes > 0 && (
                        <span className="-top-5 -translate-x-1/2 absolute left-1/2 font-medium text-muted-foreground text-xs">
                          {day.minutes}m
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "font-medium text-xs",
                        i === new Date().getDay() - 1
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      )}
                    >
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Current Level */}
          <Card className="overflow-hidden border-0 bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-xl">
            <CardContent className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-indigo-100 text-sm">Current Level</span>
                <Badge className="border-white/20 bg-white/20 text-white">
                  CEFR
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold font-lyon text-5xl">
                  {mockUserStats.currentLevel}
                </span>
                <span className="text-indigo-200">Intermediate</span>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-200">Progress to B2</span>
                  <span className="font-medium">68%</span>
                </div>
                <Progress
                  value={68}
                  className="h-2 bg-white/20 *:data-[slot=indicator]:bg-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-lyon text-lg">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRecentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50"
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm",
                      activity.type === "lesson" && "bg-violet-100",
                      activity.type === "vocabulary" && "bg-amber-100",
                      activity.type === "speaking" && "bg-emerald-100"
                    )}
                  >
                    {activity.type === "lesson" && "📖"}
                    {activity.type === "vocabulary" && "📝"}
                    {activity.type === "speaking" && "🎙️"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">
                      {activity.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {activity.timestamp}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    +{activity.xp} XP
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-lyon text-lg">Achievements</CardTitle>
              <CardDescription>Your earned badges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={cn(
                      "flex size-12 items-center justify-center rounded-xl text-xl transition-all",
                      achievement.unlocked
                        ? "bg-linear-to-br from-amber-100 to-orange-100 shadow-sm"
                        : "bg-slate-100 opacity-40 grayscale"
                    )}
                    title={achievement.name}
                  >
                    {achievement.icon}
                  </div>
                ))}
                <div className="flex size-12 items-center justify-center rounded-xl border-2 border-slate-200 border-dashed text-slate-400 text-xl">
                  +
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 bg-slate-50 shadow-sm">
            <CardContent className="space-y-2 p-4">
              <p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Quick Actions
              </p>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/vocabulary">
                  <span className="mr-2">📝</span>
                  Practice Vocabulary
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/grammar">
                  <span className="mr-2">📚</span>
                  Grammar Quiz
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/fluency">
                  <span className="mr-2">🎙️</span>
                  Speaking Session
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function _StatCard({
  label,
  value,
  icon,
  trend,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  trend: string;
  color: string;
}) {
  return (
    <Card className="hover:-translate-y-0.5 border-0 shadow-sm transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-sm",
              color
            )}
          >
            {icon}
          </span>
        </div>
        <p className="font-bold font-lyon text-2xl">{value}</p>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="mt-1 text-emerald-600 text-xs">{trend}</p>
      </CardContent>
    </Card>
  );
}
