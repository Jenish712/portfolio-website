import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../');
const frontendPath = path.resolve(root, 'src/data/projects.js');
// Load .env from server folder and override any existing env vars (like a user-level DATABASE_URL)
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

// dynamic import of ESM/JS file
const { PROJECTS } = await import(pathToFileURL(frontendPath).href);

const prisma = new PrismaClient();

function mkOrder<T>(arr: T[] | undefined) {
  return (arr ?? []).map((x: any, i: number) => ({ ...x, order: x.order ?? i }));
}

async function main() {
  for (const p of PROJECTS) {
    const exists = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (exists) continue;

    const created = await prisma.project.create({ data: {
      title: p.title, slug: p.slug,
      category: p.category ?? null,
      description: p.description ?? null,
      longDescription: p.longDescription ?? null,
      summary: p.summary ?? null,
      content: p.content ?? [], tech: p.tech ?? [], tags: p.tags ?? [], highlights: p.highlights ?? [],
      timeline: p.timeline ?? null, team: p.team ?? null,
      status: 'published',
    }});

    if (p.links) await prisma.projectLink.createMany({ data: mkOrder(p.links).map(l => ({ ...l, projectId: created.id })) });
    if (p.metrics) await prisma.projectMetric.createMany({ data: mkOrder(p.metrics).map(m => ({ ...m, projectId: created.id })) });
    if (p.gallery) await prisma.projectGallery.createMany({ data: mkOrder(p.gallery).map(g => ({ ...g, projectId: created.id })) });

    if (p.detailSections) {
      for (const [i, s] of p.detailSections.entries()) {
        const section = await prisma.detailSection.create({ data: {
          projectId: created.id,
          heading: s.heading,
          body: s.body ?? [],
          bullets: s.bullets ?? [],
          image: s.image ?? undefined,
          order: s.order ?? i,
        }});
        if (s.codeSnippets?.length) {
          await prisma.codeSnippet.createMany({ data: mkOrder(s.codeSnippets).map((cs: any) => ({ ...cs, sectionId: section.id })) });
        }
      }
    }

    await prisma.projectRevision.create({ data: { projectId: created.id, version: 1, summary: 'Seed import' } });
  }
}

main().then(() => prisma.$disconnect());
