export interface Word {
  word: string;
  translation: string;
  partOfSpeech: string;
  example?: string;
  exampleTranslation?: string;
}

export interface Example {
  sentence: string;
  translation?: string;
  notes?: string;
}

export interface CommonMistake {
  mistake: string;
  correction: string;
  explanation: string;
}

export interface Exercise {
  type: 'multiple-choice' | 'fill-in-the-blank' | 'translation' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
}

export interface VocabularyLessonResponse {
  title: string;
  description: string;
  words: Word[];
  exercises?: Exercise[];
  tips: string[];
}

export interface GrammarLessonResponse {
  title: string;
  description: string;
  explanation: string;
  examples: Example[];
  commonMistakes?: CommonMistake[];
  exercises?: Exercise[];
  tips: string[];
} 