import * as z from 'zod';

export const questionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3)
});

export const AnswerSchma = z.object({
  answer: z.string().min(100)
});

export const profileSchema = z.object({
  name: z.string().min(5).max(50),
  username: z.string().min(5).max(50),
  portfoliowebsite: z.string().url(),
  location: z.string().min(5).max(50),
  bio: z.string().min(10).max(160)
});
