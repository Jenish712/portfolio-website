import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { z } from 'zod';
import projectsRouter from './projects';
import authRouter from './authRoutes';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRouter);
app.use('/projects', projectsRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
