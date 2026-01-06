import {
    BookOpen,
    Briefcase,
    GraduationCap,
    Headphones,
    MessageSquare,
    Mic,
    PenTool,
    Plane,
    Sparkles,
    Target,
    Trophy,
} from "lucide-react";

// --- Types ---
export type CourseLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type SkillFocus =
    | "speaking"
    | "listening"
    | "reading"
    | "writing"
    | "grammar"
    | "vocabulary";
export type CourseCategory =
    | "business"
    | "travel"
    | "academic"
    | "exam-prep"
    | "conversation"
    | "general";

export interface Lesson {
    id: string;
    title: string;
    duration: number; // minutes
    type: "video" | "reading" | "exercise" | "quiz" | "speaking";
    completed: boolean;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    level: CourseLevel;
    category: CourseCategory;
    skills: SkillFocus[];
    lessons: Lesson[];
    totalDuration: number; // minutes
    enrolledStudents: number;
    rating: number;
    isCustom: boolean;
    thumbnail: string; // emoji or icon identifier
    color: string;
    progress: number;
    isFeatured?: boolean;
}

// --- Constants ---

export const CATEGORY_INFO: Record<
    CourseCategory,
    { label: string; icon: typeof Briefcase; color: string }
> = {
    business: { label: "Business", icon: Briefcase, color: "text-amber-500" },
    travel: { label: "Travel", icon: Plane, color: "text-sky-500" },
    academic: {
        label: "Academic",
        icon: GraduationCap,
        color: "text-violet-500",
    },
    "exam-prep": { label: "Exam Prep", icon: Trophy, color: "text-orange-500" },
    conversation: {
        label: "Conversation",
        icon: MessageSquare,
        color: "text-pink-500",
    },
    general: { label: "General", icon: BookOpen, color: "text-slate-500" },
};

export const SKILL_INFO: Record<
    SkillFocus,
    { label: string; icon: typeof Mic; color: string }
> = {
    speaking: { label: "Speaking", icon: Mic, color: "text-rose-500" },
    listening: { label: "Listening", icon: Headphones, color: "text-blue-500" },
    reading: { label: "Reading", icon: BookOpen, color: "text-emerald-500" },
    writing: { label: "Writing", icon: PenTool, color: "text-amber-500" },
    grammar: { label: "Grammar", icon: Target, color: "text-purple-500" },
    vocabulary: { label: "Vocabulary", icon: Sparkles, color: "text-cyan-500" },
};

// --- Pre-generated Courses Data ---

export const PRESET_COURSES: Course[] = [
    {
        id: "business-essentials",
        title: "Business English Essentials",
        description:
            "Master professional communication for meetings, emails, and presentations. Perfect for career advancement.",
        level: "B1",
        category: "business",
        skills: ["speaking", "writing", "vocabulary"],
        lessons: [
            {
                id: "be-1",
                title: "Professional Email Writing",
                duration: 15,
                type: "reading",
                completed: true,
            },
            {
                id: "be-2",
                title: "Meeting Vocabulary",
                duration: 12,
                type: "video",
                completed: true,
            },
            {
                id: "be-3",
                title: "Phone Call Etiquette",
                duration: 20,
                type: "speaking",
                completed: false,
            },
            {
                id: "be-4",
                title: "Presentation Skills",
                duration: 25,
                type: "video",
                completed: false,
            },
            {
                id: "be-5",
                title: "Negotiation Language",
                duration: 18,
                type: "exercise",
                completed: false,
            },
            {
                id: "be-6",
                title: "Business Idioms",
                duration: 10,
                type: "quiz",
                completed: false,
            },
        ],
        totalDuration: 100,
        enrolledStudents: 15420,
        rating: 4.8,
        isCustom: false,
        thumbnail: "💼",
        color: "from-amber-500/20 to-orange-500/20",
        progress: 33,
        isFeatured: true,
    },
];

