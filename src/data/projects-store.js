// Lightweight client-side project store overlaying static PROJECTS with local additions.
// NOTE: This is not secure storage. For a real admin, use a backend/DB.

import { PROJECTS } from "./projects";

const STORAGE_KEY = "admin_projects";

const slugify = (s) => s
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

export function getExtraProjects() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveExtraProjects(projects) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  try { window.dispatchEvent(new Event("projects-updated")); } catch {}
}

export function addProject(p) {
  const project = { ...p };
  if (!project.slug) project.slug = slugify(project.title || "new-project");
  if (!project.summary) project.summary = project.description || "";
  if (!Array.isArray(project.tags)) project.tags = [];
  if (!Array.isArray(project.tech)) project.tech = [];
  if (!Array.isArray(project.links)) project.links = [];
  const extras = getExtraProjects();
  extras.unshift(project);
  saveExtraProjects(extras);
  return project.slug;
}

export function removeProjectBySlug(slug) {
  const extras = getExtraProjects();
  const next = extras.filter((p) => p.slug !== slug);
  saveExtraProjects(next);
}

export function getAllProjects() {
  return [...getExtraProjects(), ...PROJECTS];
}

export function getProjectBySlug(slug) {
  return getAllProjects().find((p) => p.slug === slug);
}

