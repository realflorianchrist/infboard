import {z} from "zod";

export const makeUpdateSchema = <T extends z.ZodRawShape>(base: z.ZodObject<T>) => {
    return base.partial().extend({ id: z.string() });
}