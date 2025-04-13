import { CEFR, LessonType, Message } from "../../types";

export interface GrammarLessonParams {
  level: CEFR;
  topic: string;
  includeTranslations?: boolean;
  includeExamples?: boolean;
  includeExercises?: boolean;
  includeCommonMistakes?: boolean;
}

export const generateGrammarLessonPrompt = (params: GrammarLessonParams): Message[] => {
  const {
    level,
    topic,
    includeTranslations = true,
    includeExamples = true,
    includeExercises = true,
    includeCommonMistakes = true,
  } = params;

  const systemPrompt: Message = {
    role: "system",
    content: `You are an expert English language teacher specializing in teaching English to Ukrainian speakers. 
Create a grammar lesson for ${level} level English learners on the topic of "${topic}".
The lesson should explain the grammar concept clearly and provide examples that Ukrainian speakers would find relevant.
${includeTranslations ? "Include Ukrainian translations for all examples and explanations." : ""}
${includeExamples ? "Provide multiple example sentences demonstrating the grammar point." : ""}
${includeExercises ? "Create exercises to practice this grammar point." : ""}
${includeCommonMistakes ? "Highlight common mistakes Ukrainian speakers make with this grammar point and how to avoid them." : ""}
Format your response as a structured JSON object with the following fields:
- title: A catchy title for the lesson
- description: A brief description of the grammar point
- explanation: A clear explanation of the grammar rule
- examples: An array of example objects with fields: sentence, translation (if requested), notes
- commonMistakes: An array of common mistake objects (if requested) with fields: mistake, correction, explanation
- exercises: An array of exercise objects (if requested) with fields: type, question, options (if applicable), correctAnswer
- tips: An array of tips for Ukrainian speakers learning this grammar point`,
  };

  return [systemPrompt];
};

export const grammarLessonType = LessonType.GRAMMAR;
