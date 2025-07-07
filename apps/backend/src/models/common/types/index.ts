import {z} from "zod";

export const ModelSchema = z.object({
  id: z.string(),
  created: z.coerce.date(),
});

export type IModel = z.infer<typeof ModelSchema>;
