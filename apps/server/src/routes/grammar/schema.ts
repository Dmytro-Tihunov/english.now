import { z } from "@hono/zod-openapi";

export const GrammarSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    content: z.string(),
  })
  .openapi("Grammar");

export const GrammarListSchema = z
  .object({
    grammars: z.array(GrammarSchema),
  })
  .openapi("GrammarList");
