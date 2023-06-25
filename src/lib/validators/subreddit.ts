import { z } from "zod";

export const SubredditValidator = z.object({
  // no space allowed
  name: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(3)
    .max(21),
});

export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string(),
});
export const SubredditNameValidator = z.object({});

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;

export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>;
