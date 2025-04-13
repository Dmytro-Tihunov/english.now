import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { NeonHttpDatabase } from "@repo/db";
import { schema } from "@repo/db";
import { z } from "zod";
import { Variables, Bindings } from "../../types";

const app = new OpenAPIHono<{ Variables: Variables; Bindings: Bindings }>();

function extractJsonFromMarkdown(markdown: string) {
  // Regular expression to match JSON inside code blocks
  const jsonRegex = /```json\n([\s\S]*?)\n```/g;
  const matches = [];
  let match;

  while ((match = jsonRegex.exec(markdown)) !== null) {
    try {
      // Parse the JSON content from the captured group
      const jsonData = JSON.parse(match[1]);
      matches.push(jsonData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  return matches;
}

const postRouterGenerate = createRoute({
  method: "get",
  path: "/generate",
  summary: "Generate a course",
  responses: {
    200: {
      description: "Course generated successfully",
      content: {
        "application/json": {
          schema: z.object({
            units: z.array(z.any()),
          }),
        },
      },
    },
    500: {
      description: "Error generating course",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

app.openapi(postRouterGenerate, async (c) => {
  const db = c.get("db") as NeonHttpDatabase<typeof schema>;

  const result = await c.env.AI.run(
    "@cf/meta/llama-3.3-70b-instruct-fp8-fast" as any,
    {
      max_tokens: 5000,
      prompt: `
     You are an expert curriculum designer for English language learning following CEFR (Common European Framework of Reference for Languages) standards.

  Create a comprehensive curriculum structure for CEFR A1 level English learners. The curriculum should be organized into logical units, where each unit focuses on a specific subject area appropriate for A1 level.

        Return a JSON object with the following structure:
  [
      {
              "title": "Unit title",
              "description": "Detailed unit description",
              "ukrainianTitle": "Unit title Ukrainian translation",
              "ukrainianDescription": "Detailed unit description Ukrainian translation",
              "intendedGrammarFocus": ["Grammar point 1", "Grammar point 2"],
              "intendedVocabularyThemes": ["Vocabulary theme 1", "Vocabulary theme 2"],
              "orderIndex": 1,
              "lessons": [
                {
                  "title": "Lesson title",
                  "description": "Brief lesson description",
                  "ukrainianTitle": "Lesson title Ukrainian translation",
                  "ukrainianDescription": "Brief lesson description Ukrainian translation",
                  "lessonType": "GRAMMAR or VOCABULARY",
                  "estimatedTime": estimated minutes to complete,
                  "orderIndex": 1
                },
                // more lessons...
              ]
            },
              }
                        // more units...
      ]

  Ensure that:

      Units progress logically in difficulty.
  All required CEFR A1 competencies are covered.
  Each unit has a distinct, focused subject.
  Grammar and vocabulary are suitable for A1 level.
  Units integrate a mix of essential language skills (grammar and vocabulary).
  The curriculum aligns with standard CEFR A1 guidelines.
  Consider feedback from initial users to iterate and enhance the curriculum.

        The units should follow a logical progression from basic to more complex concepts.
        Make sure the orderIndex values are sequential and start from 1.`,
    },
    {
      gateway: {
        id: "english-now",
      },
    },
  );

  //   const response = {
  //     response:
  //       '```json\n[\n  {\n    "title": "Introductions and Basic Phrases",\n    "description": "Learn basic phrases and introductions in English",\n    "ukrainianTitle": "Вступ та основні фрази",\n    "ukrainianDescription": "Навчіться основних фраз та вмінню представлятися англійською",\n    "intendedGrammarFocus": ["Present Simple", "Basic question forms"],\n    "intendedVocabularyThemes": ["Introductions", "Basic Phrases"],\n    "orderIndex": 1,\n    "lessons": [\n      {\n        "title": "Saying Hello and Introducing Yourself",\n        "description": "Learn to greet and introduce yourself in English",\n        "ukrainianTitle": "Привітання та представлення",\n        "ukrainianDescription": "Навчіться вітатися та представлятися англійською",\n        "lessonType": "VOCABULARY",\n        "estimatedTime": 45,\n        "orderIndex": 1\n      }\n    ]\n  }\n]\n```\n\nHere is a comprehensive curriculum structure for CEFR A1 level English learners:\n\n```json\n[\n  {\n    "title": "Introductions and Basic Phrases",\n    "description": "Learn basic phrases and introductions in English",\n    "ukrainianTitle": "Вступ та основні фрази",\n    "ukrainianDescription": "Навчіться основних фраз та вмінню представлятися англійською",\n    "intendedGrammarFocus": ["Present Simple", "Basic question forms"],\n    "intendedVocabularyThemes": ["Introductions", "Basic Phrases"],\n    "orderIndex": 1,\n    "lessons": [\n      {\n        "title": "Saying Hello and Introducing Yourself",\n        "description": "Learn to greet and introduce yourself in English",\n        "ukrainianTitle": "Привітання та представлення",\n        "ukrainianDescription": "Навчіться вітатися та представлятися англійською",\n        "lessonType": "VOCABULARY",\n        "estimatedTime": 45,\n        "orderIndex": 1\n      }\n    ]\n  },\n  {\n    "title": "Family and Relationships",\n    "description": "Learn vocabulary and grammar related to family and relationships",\n    "ukrainianTitle": "Сім\'я та стосунки",\n    "ukrainianDescription": "Навчіться лексики та граматики пов\'язаної із сім\'єю та стосунками",\n    "intendedGrammarFocus": ["Possessive adjectives", "Basic sentence structures"],\n    "intendedVocabularyThemes": ["Family members", "Relationships"],\n    "orderIndex": 2,\n    "lessons": [\n      {\n        "title": "Describing Your Family",\n        "description": "Learn to describe your family members",\n        "ukrainianTitle": "Опис своєї сім\'ї",\n        "ukrainianDescription": "Навчіться описувати членів своєї сім\'ї",\n        "lessonType": "VOCABULARY",\n        "estimatedTime": 60,\n        "orderIndex": 1\n      },\n      {\n        "title": "Using Possessive Adjectives",\n        "description": "Learn to use possessive adjectives in sentences",\n        "ukrainianTitle": "Використання присвійних прикметників",\n        "ukrainianDescription": "Навчіться використовувати присвійні прикметники у реченнях",\n        "lessonType": "GRAMMAR",\n        "estimatedTime": 60,\n        "orderIndex": 2\n      }\n    ]\n  },\n  {\n    "title": "Food and Drinks",\n    "description": "Learn vocabulary and grammar related to food and drinks",\n    "ukrainianTitle": "Їжа та напої",\n    "ukrainianDescription": "Навчіться лексики та граматики пов\'язаної із їжею та напоями",\n    "intendedGrammarFocus": ["Countable and uncountable nouns", "Basic sentence structures"],\n    "intendedVocabularyThemes": ["Food", "Drinks"],\n    "orderIndex": 3,\n    "lessons": [\n      {\n        "title": "Ordering Food and Drinks",\n        "description": "Learn to order food and drinks in a restaurant",\n        "ukrainianTitle": "Замовлення їжі та напоїв",\n        "ukrainianDescription": "Навчіться замовляти їжу та напої у ресторані",\n        "lessonType": "VOCABULARY",\n        "estimatedTime": 60,\n        "orderIndex": 1\n      }\n    ]\n  },\n  {\n    "title": "Shopping and Numbers",\n    "description": "Learn vocabulary and grammar related to shopping and numbers",\n    "ukrainianTitle": "Шопінг та числа",\n    "ukrainianDescription": "Навчіться лексики та граматики пов\'язаної із шопінгом та числами",\n    "intendedGrammarFocus": ["Numbers 1-100", "Basic question forms"],\n    "intendedVocabularyThemes": ["Shopping", "Numbers"],\n    "orderIndex": 4,\n    "lessons": [\n      {\n        "title": "Buying Clothes",\n        "description": "Learn to buy clothes in English",\n        "ukrainianTitle": "Купівля одягу",\n        "ukrainianDescription": "Навчіться купувати одяг англійською",\n        "lessonType": "VOCABULARY",\n        "estimatedTime": 60,\n        "orderIndex": 1\n      }\n    ]\n  },\n  {\n    "title": "Travel and Directions",\n    "description": "Learn vocabulary and grammar related to travel and directions",\n    "ukrainianTitle": "Подорожі та напрямки",\n    "ukrainianDescription": "Навчіться лексики та граматики пов\'язаної із подорожами та напрямками",\n    "intendedGrammarFocus": ["Prepositions of place", "Imperative forms"],\n    "intendedVocabularyThemes": ["Travel", "Directions"],\n    "orderIndex": 5,\n    "lessons": [\n      {\n        "title": "Asking for Directions",\n        "description": "Learn to ask for directions in English",\n        "ukrainianTitle": "Запитання напрямку",\n        "ukrainianDescription": "Навчіться запитувати напрямок англійською",\n        "lessonType": "VOCABULARY",\n        "estimatedTime": 60,\n        "orderIndex": 1\n      }\n    ]\n  }\n]\n```',
  //     tool_calls: [],
  //     usage: {
  //       prompt_tokens: 381,
  //       completion_tokens: 1430,
  //       total_tokens: 1811,
  //     },
  //   };

  const units = extractJsonFromMarkdown(result.response);

  console.log(units);

  //   for (const unit of units) {
  //     const unitId = await db
  //       .insert(schema.unit)
  //       .values({
  //         courseId: 2,
  //         orderIndex: unit.orderIndex,
  //         title: unit.subject,
  //         description: unit.description,
  //         isPublished: true,
  //       })
  //       .returning();
  //     for (const lesson of unit.lessons) {
  //       await db.insert(schema.lesson).values({
  //         unitId: unitId[0].id,
  //         orderIndex: lesson.orderIndex,
  //         title: lesson.title,
  //         description: lesson.description,
  //         type: lesson.lessonType,
  //         estimatedTime: lesson.estimatedTime,
  //       });
  //     }
  //   }

  return c.json({ units: result.response });
});

export default app;
