export type CEFR = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export const LessonType = {
    VOCABULARY: "vocabulary",
    GRAMMAR: "grammar",
} as const;

export type Role = "user" | "assistant" | "system";

export type Message = {
    role: Role;
    content: string;
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    type: typeof LessonType;
    estimatedTime: number;
    content: string;
}

export interface Exercise {
  type: 'multiple_choice' | 'fill_in_the_blank' | 'true_false' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
}
