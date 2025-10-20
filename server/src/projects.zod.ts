import { z } from 'zod';

export const CodeSnippet = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(120),
  language: z.string().min(1).max(40),
  code: z.string().min(1),
  order: z.number().int().nonnegative().optional(),
});

export const DetailImage = z.object({
  src: z.string().url().max(2048),
  alt: z.string().min(1).max(160),
  caption: z.string().max(240).optional(),
});

export const DetailSection = z.object({
  id: z.string().uuid().optional(),
  heading: z.string().min(1).max(140),
  body: z.array(z.string().min(1)).min(1),
  bullets: z.array(z.string().min(1)).optional(),
  codeSnippets: z.array(CodeSnippet).optional(),
  image: DetailImage.optional().nullable(),
  order: z.number().int().nonnegative().optional(),
});

export const LinkItem = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1).max(60),
  url: z.string().url().max(2048),
  order: z.number().int().nonnegative().optional(),
});

export const MetricItem = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1).max(60),
  value: z.string().min(1).max(120),
  order: z.number().int().nonnegative().optional(),
});

export const GalleryItem = z.object({
  id: z.string().uuid().optional(),
  src: z.string().url().max(2048),
  alt: z.string().min(1).max(160),
  caption: z.string().max(240).optional(),
  order: z.number().int().nonnegative().optional(),
});

export const ProjectBase = z.object({
  title: z.string().min(3).max(140),
  slug: z.string().min(3).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().max(80).optional().nullable(),
  description: z.string().max(4000).optional().nullable(),
  longDescription: z.string().max(20000).optional().nullable(),
  summary: z.string().max(500).optional().nullable(),
  content: z.array(z.string().min(1)).default([]),
  tech: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),
  highlights: z.array(z.string().min(1)).default([]),
  timeline: z.string().max(120).optional().nullable(),
  team: z.string().max(120).optional().nullable(),
  status: z.enum(['draft','published']).default('draft'),
  version: z.number().int().positive().default(1),
  links: z.array(LinkItem).default([]),
  metrics: z.array(MetricItem).default([]),
  gallery: z.array(GalleryItem).default([]),
  detailSections: z.array(DetailSection).default([]),
});

export const CreateProjectSchema = ProjectBase;
export const UpdateProjectSchema = ProjectBase.partial().extend({ id: z.string().uuid() });

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
