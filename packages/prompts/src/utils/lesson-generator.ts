import { CEFR, LessonType } from '../types';
import { generateVocabularyLessonPrompt, VocabularyLessonParams } from '../templates/lessons/vocabulary';
import { generateGrammarLessonPrompt, GrammarLessonParams } from '../templates/lessons/grammar';
import { Message } from '../types';

export type LessonParams = 
  | (VocabularyLessonParams & { type: typeof LessonType.VOCABULARY })
  | (GrammarLessonParams & { type: typeof LessonType.GRAMMAR });

/**
 * Generates a prompt for creating a lesson based on the provided parameters
 * @param params The parameters for the lesson
 * @returns An array of messages that can be sent to an AI model
 */

export const generateLessonPrompt = (params: LessonParams): Message[] => {
  switch (params.type) {
    case LessonType.VOCABULARY:
      return generateVocabularyLessonPrompt(params);
    case LessonType.GRAMMAR:
      return generateGrammarLessonPrompt(params);
    default:
      throw new Error(`Unsupported lesson type: ${params.type}`);
  }
};

/**
 * Common vocabulary topics for different CEFR levels
 */
export const VOCABULARY_TOPICS: Record<CEFR, string[]> = {
  A1: [
    'Greetings and Introductions',
    'Numbers and Counting',
    'Days of the Week',
    'Months and Seasons',
    'Family Members',
    'Basic Food and Drink',
    'Colors and Shapes',
    'Basic Adjectives',
    'Common Verbs',
    'Time Expressions'
  ],
  A2: [
    'Daily Routines',
    'Weather and Climate',
    'Clothing and Shopping',
    'Hobbies and Leisure',
    'Transportation',
    'Restaurants and Food',
    'Health and Body',
    'Jobs and Work',
    'Houses and Furniture',
    'Travel and Directions'
  ],
  B1: [
    'Technology and Internet',
    'Education and Learning',
    'Environment and Nature',
    'Media and Entertainment',
    'Social Issues',
    'Business and Finance',
    'Sports and Fitness',
    'Art and Culture',
    'Emotions and Feelings',
    'Communication'
  ],
  B2: [
    'Politics and Government',
    'Science and Research',
    'Law and Justice',
    'Philosophy and Ethics',
    'Literature and Writing',
    'History and Historical Events',
    'Economics and Trade',
    'Psychology and Behavior',
    'Architecture and Design',
    'Music and Performance'
  ],
  C1: [
    'Advanced Technology',
    'Global Issues',
    'Academic Writing',
    'Professional Development',
    'Advanced Business Concepts',
    'Literary Analysis',
    'Scientific Research',
    'Philosophical Concepts',
    'Advanced Psychology',
    'Contemporary Art'
  ],
  C2: [
    'Linguistics and Language',
    'Advanced Literature',
    'Complex Social Theories',
    'Advanced Science',
    'International Relations',
    'Advanced Economics',
    'Complex Philosophical Ideas',
    'Advanced Psychology',
    'Advanced Art Criticism',
    'Complex Legal Concepts'
  ]
};

/**
 * Common grammar topics for different CEFR levels
 */
export const GRAMMAR_TOPICS: Record<CEFR, string[]> = {
  A1: [
    'Present Simple',
    'Basic Articles (a/an/the)',
    'Basic Pronouns',
    'Basic Prepositions',
    'Basic Adjectives',
    'Basic Adverbs',
    'Basic Questions',
    'Basic Negatives',
    'Basic Possessives',
    'Basic Count/Uncount Nouns'
  ],
  A2: [
    'Present Continuous',
    'Past Simple',
    'Future with Going To',
    'Comparatives and Superlatives',
    'Modal Verbs (can, must)',
    'Basic Conditionals (if/when)',
    'Basic Reported Speech',
    'Basic Passive Voice',
    'Basic Relative Clauses',
    'Basic Gerunds and Infinitives'
  ],
  B1: [
    'Present Perfect',
    'Past Continuous',
    'Future with Will',
    'First Conditional',
    'Second Conditional',
    'Modal Verbs (should, might)',
    'Passive Voice',
    'Relative Clauses',
    'Gerunds and Infinitives',
    'Used to and Would'
  ],
  B2: [
    'Present Perfect Continuous',
    'Past Perfect',
    'Future Perfect',
    'Third Conditional',
    'Mixed Conditionals',
    'Modal Verbs (needn\'t, ought to)',
    'Causative Have/Get',
    'Inversion',
    'Ellipsis and Substitution',
    'Complex Relative Clauses'
  ],
  C1: [
    'Advanced Tenses',
    'Advanced Conditionals',
    'Advanced Modals',
    'Advanced Passive Structures',
    'Advanced Reported Speech',
    'Advanced Inversion',
    'Advanced Ellipsis',
    'Advanced Nominalization',
    'Advanced Subordination',
    'Advanced Coordination'
  ],
  C2: [
    'Complex Tense Usage',
    'Complex Conditional Structures',
    'Complex Modal Usage',
    'Complex Passive Structures',
    'Complex Reported Speech',
    'Complex Inversion',
    'Complex Ellipsis',
    'Complex Nominalization',
    'Complex Subordination',
    'Complex Coordination'
  ]
}; 