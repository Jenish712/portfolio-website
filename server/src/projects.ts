import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateProjectSchema, UpdateProjectSchema } from './projects.zod.js';
import { requireAuth } from './auth.js';

const prisma = new PrismaClient();
const router: Router = Router();

// GET /projects
router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(String(req.query.pageSize || '12'), 10)));
  const query = String(req.query.query || '').trim();
  const tag = String(req.query.tag || '').trim();

  const where: any = {};
  if (query) where.OR = [
    { title: { contains: query, mode: 'insensitive' } },
    { summary: { contains: query, mode: 'insensitive' } },
    { description: { contains: query, mode: 'insensitive' } },
  ];
  if (tag) where.tags = { array_contains: tag } as any; // handled via JSON query below if needed

  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, title: true, slug: true, summary: true, tags: true, status: true, updatedAt: true
      }
    }),
    prisma.project.count({ where })
  ]);

  res.json({ items, page, pageSize, total });
});

// GET /projects/:slug
router.get('/:slug', async (req, res) => {
  const slug = req.params.slug;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      links: { orderBy: { order: 'asc' } },
      metrics: { orderBy: { order: 'asc' } },
      gallery: { orderBy: { order: 'asc' } },
      sections: { orderBy: { order: 'asc' }, include: { snippets: { orderBy: { order: 'asc' } } } }
    }
  });
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
});

// POST /projects (editor/admin)
router.post('/', requireAuth(['editor','admin']), async (req, res) => {
  const parsed = CreateProjectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const data = parsed.data;

  // enforce unique slug
  const exists = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (exists) return res.status(409).json({ message: 'Slug already exists' });

  const result = await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({ data: {
      title: data.title, slug: data.slug, category: data.category ?? null,
      description: data.description ?? null, longDescription: data.longDescription ?? null,
      summary: data.summary ?? null, content: data.content, tech: data.tech, tags: data.tags,
      highlights: data.highlights, timeline: data.timeline ?? null, team: data.team ?? null,
      status: data.status, version: data.version,
    }});

    const mkOrder = <T extends { order?: number }>(arr: T[]) => arr.map((a, i) => ({ ...a, order: a.order ?? i }));

    if (data.links?.length) await tx.projectLink.createMany({ data: mkOrder(data.links).map(l => ({ ...l, projectId: project.id })) });
    if (data.metrics?.length) await tx.projectMetric.createMany({ data: mkOrder(data.metrics).map(m => ({ ...m, projectId: project.id })) });
    if (data.gallery?.length) await tx.projectGallery.createMany({ data: mkOrder(data.gallery).map(g => ({ ...g, projectId: project.id })) });

    if (data.detailSections?.length) {
      for (const [i, s] of data.detailSections.entries()) {
        const section = await tx.detailSection.create({ data: {
          projectId: project.id,
          heading: s.heading,
          body: s.body,
          bullets: s.bullets ?? [],
          image: s.image ?? undefined,
          order: s.order ?? i,
        }});
        if (s.codeSnippets?.length) {
          await tx.codeSnippet.createMany({ data: mkOrder(s.codeSnippets).map(cs => ({ ...cs, sectionId: section.id })) });
        }
      }
    }

    await tx.projectRevision.create({ data: { projectId: project.id, version: project.version, actorId: (req as any).user?.sub, summary: 'Initial create' }});
    return project;
  });

  res.status(201).json(result);
});

// PUT /projects/:id (editor/admin)
router.put('/:id', requireAuth(['editor','admin']), async (req, res) => {
  const parsed = UpdateProjectSchema.safeParse({ ...req.body, id: req.params.id });
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const data = parsed.data;

  const project = await prisma.project.findUnique({ where: { id: data.id } });
  if (!project) return res.status(404).json({ message: 'Not found' });
  if (data.slug && data.slug !== project.slug) {
    const exists = await prisma.project.findUnique({ where: { slug: data.slug } });
    if (exists) return res.status(409).json({ message: 'Slug already exists' });
  }

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.project.update({ where: { id: data.id }, data: {
      title: data.title ?? project.title,
      slug: data.slug ?? project.slug,
      category: data.category ?? project.category,
      description: data.description ?? project.description,
      longDescription: data.longDescription ?? project.longDescription,
      summary: data.summary ?? project.summary,
      content: data.content ?? project.content,
      tech: data.tech ?? project.tech,
      tags: data.tags ?? project.tags,
      highlights: data.highlights ?? project.highlights,
      timeline: data.timeline ?? project.timeline,
      team: data.team ?? project.team,
      status: data.status ?? project.status,
      version: (data.version ?? project.version) + 1,
    }});

    // Replace nested arrays by deleting and reinserting (simple + consistent)
    await tx.projectLink.deleteMany({ where: { projectId: data.id } });
    await tx.projectMetric.deleteMany({ where: { projectId: data.id } });
    await tx.projectGallery.deleteMany({ where: { projectId: data.id } });

    const mkOrder = <T extends { order?: number }>(arr: T[]) => arr.map((a, i) => ({ ...a, order: a.order ?? i }));

    if (data.links) await tx.projectLink.createMany({ data: mkOrder(data.links).map(l => ({ ...l, projectId: data.id })) });
    if (data.metrics) await tx.projectMetric.createMany({ data: mkOrder(data.metrics).map(m => ({ ...m, projectId: data.id })) });
    if (data.gallery) await tx.projectGallery.createMany({ data: mkOrder(data.gallery).map(g => ({ ...g, projectId: data.id })) });

    // Sections & snippets replacement
    await tx.codeSnippet.deleteMany({ where: { section: { projectId: data.id } } });
    await tx.detailSection.deleteMany({ where: { projectId: data.id } });

    if (data.detailSections) {
      for (const [i, s] of data.detailSections.entries()) {
        const section = await tx.detailSection.create({ data: {
          projectId: data.id,
          heading: s.heading,
          body: s.body ?? [],
          bullets: s.bullets ?? [],
          image: s.image ?? undefined,
          order: s.order ?? i,
        }});
        if (s.codeSnippets?.length) {
          await tx.codeSnippet.createMany({ data: mkOrder(s.codeSnippets).map(cs => ({ ...cs, sectionId: section.id })) });
        }
      }
    }

    await tx.projectRevision.create({ data: { projectId: data.id, version: updated.version, actorId: (req as any).user?.sub, summary: 'Update' }});
    return updated;
  });

  res.json(result);
});

// PATCH /projects/:id/reorder (admin)
router.patch('/:id/reorder', requireAuth(['admin']), async (req, res) => {
  const id = req.params.id;
  const { links, metrics, gallery, detailSections, codeSnippets } = req.body || {};

  const txs: any[] = [];
  if (Array.isArray(links)) for (const l of links) txs.push(prisma.projectLink.update({ where: { id: l.id }, data: { order: l.order } }));
  if (Array.isArray(metrics)) for (const m of metrics) txs.push(prisma.projectMetric.update({ where: { id: m.id }, data: { order: m.order } }));
  if (Array.isArray(gallery)) for (const g of gallery) txs.push(prisma.projectGallery.update({ where: { id: g.id }, data: { order: g.order } }));
  if (Array.isArray(detailSections)) for (const s of detailSections) txs.push(prisma.detailSection.update({ where: { id: s.id }, data: { order: s.order } }));
  if (Array.isArray(codeSnippets)) for (const cs of codeSnippets) txs.push(prisma.codeSnippet.update({ where: { id: cs.id }, data: { order: cs.order } }));

  await prisma.$transaction(txs);
  res.json({ ok: true });
});

// DELETE /projects/:id (admin)
router.delete('/:id', requireAuth(['admin']), async (req, res) => {
  const id = req.params.id;
  await prisma.project.delete({ where: { id } });
  res.status(204).send();
});

export default router;
