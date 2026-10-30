import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({ name: z.string(), url: z.string() });

const publications = defineCollection({
  loader: file('src/data/publications.yaml'),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    venue_short: z.string(),
    year: z.number(),
    image: z.string().optional(),
    selected: z.number().optional(), // position on the home page
    note: z.string().optional(),
    links: z.array(link).default([]),
  }),
});

const experience = defineCollection({
  loader: file('src/data/experience.yaml'),
  schema: z.object({
    role: z.string(),
    org: z.string(),
    org_url: z.string().optional(),
    location: z.string(),
    period: z.string().optional(),
  }),
});

// One file per project. If the file has a body (text/demos below the frontmatter),
// the project gets its own page at /projects/<file-name>/.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    category: z.enum(['industry', 'research']),
    order: z.number(),
    featured: z.boolean().default(false),
    image: z.string(),
    description: z.string().optional(),
    points: z.array(z.string()).default([]),
    links: z.array(link).default([]),
  }),
});

export const collections = { publications, experience, projects };
