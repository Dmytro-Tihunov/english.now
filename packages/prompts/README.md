# English Learning Prompts

This package contains prompts for generating English lessons for Ukrainian speakers using AI.

## Features

- Vocabulary lessons with customizable parameters
- Grammar lessons with customizable parameters
- CEFR level-specific content (A1-C2)
- Ukrainian translations for all content
- Structured JSON responses for easy integration

## Usage

### Generating a Vocabulary Lesson

```typescript
import { generateLessonPrompt, LessonType, CEFR } from '@english.now/prompts';

// Generate a vocabulary lesson for A2 level on the topic of "Daily Routines"
const vocabularyLessonPrompt = generateLessonPrompt({
  type: LessonType.VOCABULARY,
  level: CEFR.A2,
  topic: "Daily Routines",
  wordCount: 15,
  includeTranslations: true,
  includeExamples: true,
  includeExercises: true
});

// Send the prompt to your AI model
const response = await sendToAIModel(vocabularyLessonPrompt);
```

### Generating a Grammar Lesson

```typescript
import { generateLessonPrompt, LessonType, CEFR } from '@english.now/prompts';

// Generate a grammar lesson for B1 level on the topic of "Present Perfect"
const grammarLessonPrompt = generateLessonPrompt({
  type: LessonType.GRAMMAR,
  level: CEFR.B1,
  topic: "Present Perfect",
  includeTranslations: true,
  includeExamples: true,
  includeExercises: true,
  includeCommonMistakes: true
});

// Send the prompt to your AI model
const response = await sendToAIModel(grammarLessonPrompt);
```

### Using Predefined Topics

```typescript
import { VOCABULARY_TOPICS, GRAMMAR_TOPICS, CEFR } from '@english.now/prompts';

// Get all vocabulary topics for A2 level
const a2VocabularyTopics = VOCABULARY_TOPICS[CEFR.A2];

// Get all grammar topics for B1 level
const b1GrammarTopics = GRAMMAR_TOPICS[CEFR.B1];
```

## Response Format

### Vocabulary Lesson Response

```typescript
interface VocabularyLessonResponse {
  title: string;
  description: string;
  words: {
    word: string;
    translation: string;
    partOfSpeech: string;
    example?: string;
    exampleTranslation?: string;
  }[];
  exercises?: {
    type: 'multiple-choice' | 'fill-in-the-blank' | 'translation' | 'matching';
    question: string;
    options?: string[];
    correctAnswer: string | string[];
  }[];
  tips: string[];
}
```

### Grammar Lesson Response

```typescript
interface GrammarLessonResponse {
  title: string;
  description: string;
  explanation: string;
  examples: {
    sentence: string;
    translation?: string;
    notes?: string;
  }[];
  commonMistakes?: {
    mistake: string;
    correction: string;
    explanation: string;
  }[];
  exercises?: {
    type: 'multiple-choice' | 'fill-in-the-blank' | 'translation' | 'matching';
    question: string;
    options?: string[];
    correctAnswer: string | string[];
  }[];
  tips: string[];
}
``` 