import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Plus,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  CATEGORY_INFO,
  type Course,
  type CourseCategory,
  type CourseLevel,
  type Lesson,
  PRESET_COURSES,
  SKILL_INFO,
  type SkillFocus,
} from "../lib/courses-data";
import { cn } from "../lib/utils";

// --- Route Definition ---

export const Route = createFileRoute("/courses/")({
  component: CoursesIndexPage,
});

// --- Main Component ---

function CoursesIndexPage() {
  const [courses, setCourses] = useState<Course[]>(PRESET_COURSES);
  const [selectedCategory, setSelectedCategory] = useState<
    CourseCategory | "all"
  >("all");
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | "all">(
    "all"
  );
  const [activeTab, setActiveTab] = useState<"all" | "enrolled" | "custom">(
    "all"
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      const matchesLevel =
        selectedLevel === "all" || course.level === selectedLevel;
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "enrolled" && course.progress > 0) ||
        (activeTab === "custom" && course.isCustom);

      return matchesCategory && matchesLevel && matchesTab;
    });
  }, [courses, selectedCategory, selectedLevel, activeTab]);

  const handleCreateCourse = useCallback((newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    setIsCreateDialogOpen(false);
    setActiveTab("custom");
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8 xl:max-w-6xl 2xl:max-w-7xl">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-bold font-lyon text-3xl tracking-tight md:text-4xl">
              Courses
            </h1>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-5 w-5" />
            Create Course
          </Button>
        </div>

        {/* Tabs and Filters */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          >
            <TabsList>
              <TabsTrigger value="all" className="gap-2 px-4">
                <BookOpen className="h-4 w-4" />
                All Courses
              </TabsTrigger>
              <TabsTrigger value="enrolled" className="gap-2 px-4">
                <Play className="h-4 w-4" />
                In Progress
              </TabsTrigger>
              <TabsTrigger value="custom" className="gap-2 px-4">
                <Sparkles className="h-4 w-4" />
                My Courses
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as CourseCategory | "all")
              }
              className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_INFO).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) =>
                setSelectedLevel(e.target.value as CourseLevel | "all")
              }
              className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Levels</option>
              {(["A1", "A2", "B1", "B2", "C1", "C2"] as const).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 font-semibold text-lg">No courses found</h3>
            <p className="mb-4 text-center text-muted-foreground text-sm">
              {activeTab === "custom"
                ? "Create your first custom course to get started!"
                : "Try adjusting your filters or search query."}
            </p>
            {activeTab === "custom" && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Course
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Course Dialog */}
      <CreateCourseDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={handleCreateCourse}
      />
    </div>
  );
}

// --- Course Card ---
function CourseCard({ course }: { course: Course }) {
  const completedLessons = course.lessons.filter((l) => l.completed).length;

  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      className="group hover:-translate-y-0.5 block overflow-hidden rounded-xl border border-border transition-all hover:shadow-lg"
    >
      {/* Thumbnail Area */}
      <div
        className={cn(
          "relative flex h-38 items-center justify-center bg-lime-200",
          course.color
        )}
      >
        <span className="text-5xl transition-transform group-hover:scale-110">
          {course.thumbnail}
        </span>
        <div className="absolute top-2 left-2 flex gap-1.5">
          <Badge variant={course.level}>{course.level}</Badge>
          {course.isCustom && (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Custom
            </Badge>
          )}
        </div>
        {course.progress > 0 && (
          <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-xs backdrop-blur">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            {course.progress}%
          </div>
        )}
      </div>

      <div className="p-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-bold text-base">{course.title}</h3>
        </div>
        <p className="line-clamp-2 text-xs">{course.description}</p>
      </div>

      <div className="space-y-3 p-2">
        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {course.skills.slice(0, 3).map((skill) => {
            const skillInfo = SKILL_INFO[skill];
            return (
              <span
                key={skill}
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md bg-muted px-1.5 py-0.5 text-[10px]",
                  skillInfo.color
                )}
              >
                <skillInfo.icon className="h-2.5 w-2.5" />
                {skillInfo.label}
              </span>
            );
          })}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {Math.round(course.totalDuration / 60)}h {course.totalDuration % 60}
            m
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {completedLessons}/{course.lessons.length} lessons
          </span>
        </div>

        {/* Progress */}
        {course.progress > 0 && (
          <Progress value={course.progress} className="h-1.5" />
        )}
      </div>

      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="font-medium text-xs">{course.rating}</span>
        </div>
        <span className="flex items-center gap-1 font-medium text-primary text-xs">
          <Play className="h-3 w-3" />
          {course.progress > 0 ? "Continue" : "Start"}
        </span>
      </div>
    </Link>
  );
}

// --- Create Course Dialog ---
function CreateCourseDialog({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (course: Course) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<CourseLevel>("A2");
  const [category, setCategory] = useState<CourseCategory>("general");
  const [selectedSkills, setSelectedSkills] = useState<SkillFocus[]>([
    "speaking",
    "vocabulary",
  ]);
  const [lessons, setLessons] = useState<
    { id: string; title: string; duration: number; type: Lesson["type"] }[]
  >([{ id: `lesson-${Date.now()}`, title: "", duration: 15, type: "video" }]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newCourse: Course = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      description:
        description.trim() ||
        `A custom course focused on ${selectedSkills.map((s) => SKILL_INFO[s].label).join(", ")}`,
      level,
      category,
      skills: selectedSkills,
      lessons: lessons
        .filter((l) => l.title.trim())
        .map((l, i) => ({
          id: `custom-lesson-${Date.now()}-${i}`,
          title: l.title.trim(),
          duration: l.duration,
          type: l.type,
          completed: false,
        })),
      totalDuration: lessons.reduce((a, l) => a + l.duration, 0),
      enrolledStudents: 1,
      rating: 5.0,
      isCustom: true,
      thumbnail: ["📝", "🎯", "💡", "🚀", "⭐", "🌟", "📚", "🎓"][
        Math.floor(Math.random() * 8)
      ],
      color: [
        "from-indigo-500/20 to-blue-500/20",
        "from-emerald-500/20 to-teal-500/20",
        "from-amber-500/20 to-yellow-500/20",
        "from-rose-500/20 to-pink-500/20",
        "from-violet-500/20 to-purple-500/20",
      ][Math.floor(Math.random() * 5)],
      progress: 0,
    };

    onCreate(newCourse);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLevel("A2");
    setCategory("general");
    setSelectedSkills(["speaking", "vocabulary"]);
    setLessons([
      { id: `lesson-${Date.now()}`, title: "", duration: 15, type: "video" },
    ]);
  };

  const addLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        id: `lesson-${Date.now()}-${prev.length}`,
        title: "",
        duration: 15,
        type: "video",
      },
    ]);
  };

  const updateLesson = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setLessons((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  };

  const removeLesson = (index: number) => {
    if (lessons.length > 1) {
      setLessons((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const toggleSkill = (skill: SkillFocus) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Create Custom Course
          </DialogTitle>
          <DialogDescription>
            Design your personalized learning path tailored to your goals.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Interview English Preparation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What will you learn in this course?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Level</Label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as CourseLevel)}
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                >
                  {(["A1", "A2", "B1", "B2", "C1", "C2"] as const).map((l) => (
                    <option key={l} value={l}>
                      {l} -{" "}
                      {l.startsWith("A")
                        ? "Beginner"
                        : l.startsWith("B")
                          ? "Intermediate"
                          : "Advanced"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as CourseCategory)
                  }
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                >
                  {Object.entries(CATEGORY_INFO).map(([key, { label }]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <Label>Skills to Focus On</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SKILL_INFO).map(
                ([key, { label, icon: Icon, color }]) => {
                  const isSelected = selectedSkills.includes(key as SkillFocus);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleSkill(key as SkillFocus)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-all",
                        isSelected
                          ? `border-primary bg-primary/10 ${color}`
                          : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                      {isSelected && (
                        <CheckCircle2 className="ml-1 h-3.5 w-3.5" />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Lessons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Lessons</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addLesson}
                className="h-7 gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Lesson
              </Button>
            </div>
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                    {index + 1}
                  </span>
                  <Input
                    placeholder="Lesson title..."
                    value={lesson.title}
                    onChange={(e) =>
                      updateLesson(index, "title", e.target.value)
                    }
                    className="flex-1"
                  />
                  <select
                    value={lesson.type}
                    onChange={(e) =>
                      updateLesson(index, "type", e.target.value)
                    }
                    className="h-9 rounded-md border bg-background px-2 text-sm"
                  >
                    <option value="video">Video</option>
                    <option value="reading">Reading</option>
                    <option value="exercise">Exercise</option>
                    <option value="quiz">Quiz</option>
                    <option value="speaking">Speaking</option>
                  </select>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min={5}
                      max={180}
                      value={lesson.duration}
                      onChange={(e) =>
                        updateLesson(
                          index,
                          "duration",
                          Number.parseInt(e.target.value, 10) || 15
                        )
                      }
                      className="w-16 text-center"
                    />
                    <span className="text-muted-foreground text-xs">min</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeLesson(index)}
                    disabled={lessons.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || selectedSkills.length === 0}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Create Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

