// Load .env FIRST before any other imports (especially Prisma!)
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '.env');
console.log('[dotenv] Loading from:', envPath);
dotenv.config({ path: envPath });
console.log('[dotenv] DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO');

// Now import everything else (Prisma will use the env vars)
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { z } from 'zod';
import fs from 'node:fs';
import projectsRouter from './projects';
import authRouter from './authRoutes';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json({ limit: '2mb' }));

// Health first (always available)
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRouter);
app.use('/projects', projectsRouter);

const port = Number(process.env.PORT || 4000);
// Optionally serve the frontend build via the API server
if (process.env.SERVE_FRONTEND === 'true') {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	// CRA builds to root-level build/
	const buildPath = path.resolve(__dirname, '../../build');
	const publicPath = path.resolve(__dirname, '../../public');
	const clientBuild = fs.existsSync(buildPath) ? buildPath : (fs.existsSync(publicPath) ? publicPath : buildPath);

	app.use(express.static(clientBuild));
	// SPA fallback (serves index.html for unknown routes except our API namespaces)
	app.get(/^(?!\/(health|auth|projects)\b).*$/, (_req, res) => {
		res.sendFile(path.join(clientBuild, 'index.html'));
	});
	console.log(`[static] Serving frontend from: ${clientBuild}`);
}

app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
