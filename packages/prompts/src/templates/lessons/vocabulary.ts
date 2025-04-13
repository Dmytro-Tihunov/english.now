import { CEFR, LessonType, Message } from "../../types";

export interface VocabularyLessonParams {
  level: CEFR;
  topic: string;
  wordCount?: number;
  includeTranslations?: boolean;
  includeExamples?: boolean;
  includeExercises?: boolean;
}

export const generateVocabularyLessonPrompt = (params: VocabularyLessonParams): Message[] => {
  const {
    level,
    topic,
    wordCount = 10,
    includeTranslations = true,
    includeExamples = true,
    includeExercises = true,
  } = params;

  const systemPrompt: Message = {
    role: "system",
    content: `You are an expert English language teacher specializing in teaching English to Ukrainian speakers. 
Create a vocabulary lesson for ${level} level English learners on the topic of "${topic}".
The lesson should include ${wordCount} essential words or phrases that Ukrainian speakers would find useful.
${includeTranslations ? "Include Ukrainian translations for all words and phrases." : ""}
${includeExamples ? "Provide example sentences in English with Ukrainian translations." : ""}
${includeExercises ? "Create simple exercises to practice these words." : ""}
Format your response as a structured JSON object with the following fields:
- title: A catchy title for the lesson
- description: A brief description of the lesson
- words: An array of objects with fields: word, translation, partOfSpeech, example (if requested), exampleTranslation (if requested)
- exercises: An array of exercise objects (if requested) with fields: type, question, options (if applicable), correctAnswer
- tips: An array of tips for Ukrainian speakers learning these words`,
  };

  return [systemPrompt];
};

export const vocabularyLessonType = LessonType.VOCABULARY;
