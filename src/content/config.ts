import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const writeups = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    machine: z.string().optional(),
    difficulty: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { notes, writeups };
