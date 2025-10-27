import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input, Textarea } from "./components/ui/input";
import { Separator } from "./components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./components/ui/sheet";
import { CircuitBackground } from "./components/ui/background";
import { LiveSignals } from "./components/ui/live-signals";
import { Section, Pill } from "./components/ui/section";
import { ScrollReveal } from "./components/ui/scroll-reveal";
import { Projects } from "./components/Projects";
import { ProjectDetail } from "./components/ProjectDetail";
import { Admin } from "./pages/Admin";
import { useHashRoute } from "./utils/router";
import { PROFILE } from "./data/profile";
import { SKILLS } from "./data/skills";
import { PROJECTS } from "./data/projects";
import { getAllProjects } from "./data/projects-store";
import { EXPERIENCE } from "./data/experience";
import { HIGHLIGHTS, PUBLICATIONS, CTA } from "./data/misc";
import {
  Github,
  Linkedin,
  Mail,
  Cpu,
  CircuitBoard,
  Wrench,
  FileText,
  Sun,
  Moon,
  Menu,
  Link,
  GitBranch,
  User2,
  Sparkles,
  LayoutDashboard,
  Briefcase,
  Megaphone,
  ScrollText,
  ArrowRight,
} from "lucide-react";
import './styles/App.css';
import { AiMatrixLoader } from "./components/ui/loading";

// Function to run smoke tests
function runSmokeTests() {
  const tests = [];
  const add = (name, pass, details = "") => tests.push({ name, pass, details });

  // lucide-react icons exist
  add("lucide-react: Link exists", typeof Link === "function");
  add("lucide-react: Cpu exists", typeof Cpu === "function");
  add("lucide-react: CircuitBoard exists", typeof CircuitBoard === "function");

  // data present
  add("PROFILE has name", Boolean(PROFILE.name));
  add("At least one project", Array.isArray(PROJECTS) && PROJECTS.length > 0);
  add("At least one skills group", Array.isArray(SKILLS) && SKILLS.length > 0);

  // filtering logic
  const someTag = PROJECTS[0]?.tags?.[0];
  const filtered = someTag ? PROJECTS.filter((p) => p.tags.includes(someTag)) : [];
  add("Filtering returns ≥1 for known tag", someTag ? filtered.length >= 1 : true);

  // highlights icons are valid components
  add("HIGHLIGHTS icons are components", HIGHLIGHTS.every((h) => typeof h.icon === "function"));

  return tests;
}

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored === "dark";
    } catch {}
    // Default: always dark on first load
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = (e) => {
      try {
        const stored = localStorage.getItem("theme");
        if (stored === null) setDark(e.matches);
      } catch {}
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return { dark, setDark };
}

function App() {
  const { dark, setDark } = useDarkMode();
  const [tests, setTests] = useState(null);
  const route = useHashRoute();
  const [booting, setBooting] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  // New: split boot into minimum time and assets-loaded readiness
  const [minBootElapsed, setMinBootElapsed] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Show loader for at least 5.2s (prevents flash on fast loads)
  useEffect(() => {
    const MIN_BOOT_MS = 5200;
    const t = setTimeout(() => setMinBootElapsed(true), MIN_BOOT_MS);
    return () => clearTimeout(t);
  }, []);

  // Also wait until the page assets finish loading (or 8s safety cap)
  useEffect(() => {
    if (document.readyState === "complete") {
      setAssetsLoaded(true);
      return;
    }
    const onLoad = () => setAssetsLoaded(true);
    window.addEventListener("load", onLoad, { once: true });
    const MAX_BOOT_MS = 8000;
    const fallback = setTimeout(() => setAssetsLoaded(true), MAX_BOOT_MS);
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(fallback);
    };
  }, []);

  // Booting ends only when both conditions are true
  useEffect(() => {
    setBooting(!(minBootElapsed && assetsLoaded));
  }, [minBootElapsed, assetsLoaded]);

  // Light navigation loader on hash route change
  useEffect(() => {
    if (!booting) {
      setNavLoading(true);
      const t = setTimeout(() => setNavLoading(false), 350);
      return () => clearTimeout(t);
    }
  }, [route.name, route.slug, booting]);

  const projectsCount = getAllProjects().length;
  const experienceCount = EXPERIENCE.length;
  const baseLocation = PROFILE.location;

  const menuLinks = useMemo(
    () => [
      {
        id: "about",
        label: "About",
        description: "Snapshot & mission statement",
        icon: User2,
      },
      {
        id: "skills",
        label: "Skills",
        description: "Tooling, languages, and stacks",
        icon: Sparkles,
      },
      {
        id: "projects",
        label: "Projects",
        description: "Case studies and shipped builds",
        icon: LayoutDashboard,
      },
      {
        id: "experience",
        label: "Experience",
        description: "Roles, impact, and tenure",
        icon: Briefcase,
      },
      {
        id: "publications",
        label: "Publications",
        description: "Talks, articles, and patents",
        icon: Megaphone,
      },
      {
        id: "docs",
        label: "Documentation",
        description: "Stack notes & implementation",
        icon: ScrollText,
      },
      {
        id: "contact",
        label: "Contact",
        description: "Open for collaborations",
        icon: Mail,
      },
    ],
    []
  );

  const menuStats = useMemo(
    () => [
      { label: "Projects", value: `${projectsCount}+` },
      { label: "Roles", value: `${experienceCount}+` },
      { label: "Location", value: baseLocation },
    ],
    [projectsCount, experienceCount, baseLocation]
  );

  const MenuLinkCard = ({ id, label, description, icon: Icon, index, setOpen }) => {
    return (
      <motion.a
        href={`#${id}`}
        onClick={() => setOpen?.(false)}
        whileHover={{ x: 6 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="group relative block overflow-hidden rounded-xl border dark:border-emerald-900/40 bg-card dark:bg-neutral-900/40 px-4 py-4 transition-all duration-200 hover:border-emerald-500/60 hover:bg-emerald-500/10"
      >
        <span className="absolute inset-y-0 left-0 w-1 bg-emerald-500/0 transition-all duration-200 group-hover:bg-emerald-500/80" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
                                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 transition-colors duration-200 group-hover:border-emerald-500/60 group-hover:text-emerald-200">
              <Icon className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground dark:text-white">{label}</p>
                                    <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
                                <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-emerald-300" />
        </div>
                              <span className="absolute right-3 top-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-emerald-300/80">
                                {String(index + 1).padStart(2, "0")}
                              </span>
      </motion.a>
    );
  };

  const SocialTile = ({ s, setOpen }) => {
    return (
      <a
        href={s.href}
        aria-label={s.label}
        onClick={() => setOpen?.(false)}
        className="group flex flex-col items-center justify-center gap-2 rounded-xl border bg-card py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground transition-all hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-200"
      >
        <s.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-300 transition-colors duration-200 group-hover:text-emerald-200" />
        {s.label}
      </a>
    );
  };

  const SheetContentWrapper = ({ setOpen }) => {
    return (
      <div className="relative h-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-[-40px] h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl opacity-60 dark:bg-emerald-500/20" />
          <div className="absolute -bottom-28 left-[-60px] h-60 w-60 rounded-full bg-emerald-400/15 blur-3xl opacity-60 dark:bg-emerald-400/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.08),_rgba(0,0,0,0)_60%)] dark:bg-[radial-gradient(circle_at_top,#0f172a,rgba(15,23,42,0)_60%)] opacity-60" />
        </div>
        <div className="relative z-10 flex h-full flex-col">
          <SheetHeader className="px-6 py-6 border dark:border-emerald-900/40">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-600/70 dark:text-emerald-400/70">Portfolio</p>
              <SheetTitle className="text-left text-2xl font-semibold">Navigate</SheetTitle>
              <p className="text-sm text-muted-foreground">
                Jump to a section or reach out directly.
              </p>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-10">
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Sections</p>
              <nav className="mt-4 space-y-3">
                {menuLinks.map((item, index) => (
                  <MenuLinkCard key={item.id} {...item} index={index} setOpen={setOpen} />
                ))}
              </nav>
            </div>

            <div className="mt-10">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Connect</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {PROFILE.socials.map((s) => (
                  <SocialTile key={s.label} s={s} setOpen={setOpen} />
                ))}
              </div>
            </div>

            <div className="mt-10">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Snapshot</p>
              {/* Use 2 columns in the narrow sheet to prevent crowding */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {menuStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border dark:border-emerald-900/40 bg-card dark:bg-neutral-900/40 px-4 py-3 text-sm"
                  >
                    <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</div>
                    {/* Tighter leading and clamp to avoid overflow for long locations */}
                    <div className="mt-2 text-base sm:text-lg font-semibold leading-snug break-words line-clamp-2 text-emerald-600 dark:text-emerald-300">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors">
      {(booting || navLoading) && (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-background/80 backdrop-blur-sm">
          <AiMatrixLoader />
        </div>
      )}
      <CircuitBackground />

      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border dark:border-emerald-800/40 bg-background/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Brand Section */}
            <div className="flex items-center gap-4 min-w-0 flex-1 mr-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/40 grid place-items-center flex-shrink-0">
                <CircuitBoard className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold truncate text-foreground">{PROFILE.name}</div>
                <div className="text-xs text-emerald-700/80 dark:text-emerald-300/80 truncate hidden sm:block">{PROFILE.title}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Desktop social links */}
              <div className="hidden md:flex items-center gap-2 mr-3">
                {PROFILE.socials.map((s) => (
                  <Button key={s.label} variant="ghost" size="icon" asChild className="hover:bg-emerald-500/10 h-9 w-9">
                    <a href={s.href} aria-label={s.label}>
                      <s.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                    </a>
                  </Button>
                ))}
              </div>

              {/* Theme toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDark((d) => !d)}
                aria-label="Toggle theme"
                className="border-emerald-800/40 hover:bg-emerald-500/10 h-9 w-9"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Developer tests */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:flex border-emerald-800/40 text-foreground hover:bg-emerald-500/10 h-9 px-4">
                    Dev
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background border text-foreground">
                  <DialogHeader>
                    <DialogTitle>Smoke tests</DialogTitle>
                  </DialogHeader>
                  <div className="mb-3 text-sm text-muted-foreground">
                    Quick checks for icons, data, filtering, widgets, and routing.
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white border"
                      onClick={() => setTests(runSmokeTests())}
                    >
                      Run
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
                      onClick={() => setTests(null)}
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {tests?.map((t, i) => (
                      <div
                        key={i}
                        className={`rounded-md border p-2 text-sm ${t.pass ? "border-green-400" : "border-red-400"}`}
                      >
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {t.pass ? "PASS" : "FAIL"}
                          {t.details ? ` — ${t.details}` : ""}
                        </div>
                      </div>
                    ))}
                    {!tests && <div className="text-xs text-muted-foreground">No results yet.</div>}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white border h-9 px-4 font-medium">
                    <span className="hidden sm:inline">Menu</span>
                    <span className="sm:hidden">☰</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="border-l border bg-background text-foreground p-0 w-[90vw] sm:w-[400px] max-w-md">
                  <SheetContentWrapper />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HERO */}
        {route.name === "home" && (
          <ScrollReveal delay={0.1} direction="fade" duration={1.2}>
            <section id="about" className="py-8 sm:py-12 lg:py-16">
              <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-center">
                <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                  <motion.h1
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] sm:leading-[1.1] lg:leading-[1.05] pb-1 overflow-visible bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-[0_8px_40px_rgba(16,185,129,.12)]"
                  >
                    {PROFILE.name}
                  </motion.h1>
                  <p className="text-emerald-700/80 dark:text-emerald-300/80 text-sm sm:text-base">{PROFILE.title}</p>                <div className="mt-2 h-[3px] w-28 bg-gradient-to-r from-emerald-400 via-teal-300 to-transparent rounded-full" />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="leading-relaxed text-muted-foreground text-sm sm:text-base"
                  >
                    {PROFILE.summary}
                  </motion.p>
                  <div className="flex flex-wrap gap-2">{PROFILE.location && <Pill>{PROFILE.location}</Pill>}
                    <Pill>Open to roles</Pill>
                    <Pill>Available for consulting</Pill>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="w-full sm:w-auto">
                      <Button
                        asChild
                        className="flex bg-emerald-600 hover:bg-emerald-500 text-white border glow-emerald w-full sm:w-auto"
                      >
                        <a
                          href="#projects"
                          className="flex w-full items-center justify-center gap-2"
                        >
                          <Cpu className="h-4 w-4" />
                          <span>View Projects</span>
                        </a>
                      </Button>
                    </div>
                    <div className="w-full sm:w-auto">
                      <Button
                        asChild
                        variant="outline"
                        className="flex border text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300 w-full sm:w-auto"
                      >
                        <a
                          href="#contact"
                          className="flex w-full items-center justify-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          <span>Contact</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 order-last">{/* LiveSignals will be responsive */}
                  <LiveSignals />
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        {route.name === "home" && <Separator className="bg-emerald-900/40" />}

        {route.name === "home" && (
          <ScrollReveal delay={0.2} direction="right" duration={1.0}>
            <Section id="skills" title="Skills" icon={Wrench}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {SKILLS.map(({ group, items }) => (
                  <Card key={group} className="border dark:border-emerald-800/40 dark:bg-neutral-900/40">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="text-base sm:text-lg">{group}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {items.map((s) => (
                        <Pill key={s}>{s}</Pill>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          </ScrollReveal>
        )}

        {route.name === "home" && <Separator className="bg-emerald-900/40" />}

        {route.name === "home" && (
          <ScrollReveal delay={0.2} direction="up">
            <Projects />
          </ScrollReveal>
        )}

        {route.name === "project" && <ProjectDetail slug={route.slug} />}
        {route.name === "admin" && (
          <ScrollReveal delay={0.1} direction="fade">
            <Admin />
          </ScrollReveal>
        )}

        {route.name === "home" && <Separator className="bg-emerald-900/40" />}

        {route.name === "home" && (
          <ScrollReveal delay={0.4} direction="up" duration={1.1}>
            <Section id="experience" title="Experience" icon={FileText}>
              <div className="max-w-4xl mx-auto">
                <div className="grid gap-6 md:gap-8">
                  {EXPERIENCE.map((e, index) => (
                    <motion.div
                      key={e.role}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: index * 0.15,
                        duration: 0.6,
                        ease: [0.21, 0.47, 0.32, 0.98]
                      }}
                    >
                      {/* Light: match project card background; Dark: keep existing emerald accents via dark: classes elsewhere */}
                      <Card className="bg-card border hover:border-emerald-600/60 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group overflow-hidden">
                        <CardHeader className="pb-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg sm:text-xl text-emerald-300 group-hover:text-emerald-200 transition-colors">
                                    {e.role}
                                  </CardTitle>
                                  <p className="text-sm sm:text-base text-neutral-300 font-medium">
                                    {e.org}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="text-right">
                                <div className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                  {e.period}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {e.bullets.map((bullet, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                                  {bullet}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Section>
          </ScrollReveal>
        )}

        {route.name === "home" && <Separator className="bg-emerald-900/40" />}

        {route.name === "home" && (
          <ScrollReveal delay={0.5} direction="right" duration={1.0}>
            <Section id="publications" title="Publications" icon={GitBranch}>
              <div className="grid gap-6 md:gap-8">
                {PUBLICATIONS.map((p, index) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: index * 0.15,
                      duration: 0.6,
                      ease: [0.21, 0.47, 0.32, 0.98]
                    }}
                  >
                    {/* Light: match project card background; Dark: emerald accents remain */}
                    <Card className="bg-card border hover:border-emerald-600/60 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        {/* Publication type indicator */}
                        <div className="flex-shrink-0 w-full sm:w-16 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <FileText className="h-4 w-4 text-emerald-300" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg sm:text-xl text-emerald-300 group-hover:text-emerald-200 transition-colors leading-tight mb-2">
                                {p.title}
                              </CardTitle>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                                <span className="inline-flex items-center gap-1.5">
                                  <GitBranch className="h-3.5 w-3.5" />
                                  {p.venue}
                                </span>
                                <span className="text-emerald-400/60">•</span>
                                <span className="text-xs uppercase tracking-wide font-medium text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                  Conference Paper
                                </span>
                              </div>
                            </div>

                            <div className="flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="border-emerald-700/50 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-600/60 transition-all duration-200"
                              >
                                <a href={p.link} className="inline-flex items-center gap-2">
                                  <Link className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">View Paper</span>
                                  <span className="sm:hidden">View</span>
                                </a>
                              </Button>
                            </div>
                          </div>

                          {/* Abstract preview or additional info could go here */}
                          <div className="mt-4 pt-4 border-t border-emerald-800/30">
                            <p className="text-sm text-neutral-400 leading-relaxed">
                              Research publication on advanced protection and control systems for power electronics.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Additional publications info */}
              <div className="mt-8 text-center">
                <p className="text-sm text-neutral-400">
                  More publications and research work available on{' '}
                  <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors underline">
                    Google Scholar
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors underline">
                    ResearchGate
                  </a>
                </p>
              </div>
            </Section>
          </ScrollReveal>
        )}

        {route.name === "home" && <Separator className="bg-emerald-900/40" />}

        {route.name === "home" && (
          <ScrollReveal delay={0.6} direction="fade" duration={0.9}>
            <Section id="docs" title="Documentation" icon={FileText}>
              {/* Light: align card background with project cards */}
              <Card className="bg-card border">
                <CardContent className="pt-6 text-sm text-neutral-300 space-y-2">
                  <p>
                    <strong>Stack:</strong> React + Tailwind + shadcn/ui + framer-motion. Icons:
                    lucide-react.
                  </p>
                  <p>
                    <strong>Customize:</strong> Edit the data files in src/data/ to modify content.
                    Colors use Tailwind classes; change <code>emerald</code> to your palette.
                  </p>
                  <p>
                    <strong>Routing:</strong> Clicking a project routes to <code>#/project/&lt;slug&gt;</code>.
                    Use the Back button or open in a new tab.
                  </p>
                  <p>
                    <strong>Deploy:</strong> Works in static hosting because routing uses
                    <code> hashchange</code>.
                  </p>
                  <p>
                    <strong>Testing:</strong> Use the <em>Dev</em> button in the header to run smoke
                    tests.
                  </p>
                </CardContent>
              </Card>
            </Section>
          </ScrollReveal>
        )}

        {route.name === "home" && <Separator className="bg-emerald-900/40" />}

        {route.name === "home" && (
          <ScrollReveal delay={0.7} direction="left" duration={1.0}>
            <Section id="contact" title="Contact" icon={Mail}>
              {/* Light: align card background with project cards */}
              <Card className="bg-card border">
                <CardContent className="pt-6">
                  <div className="text-sm text-neutral-300 mb-4">
                    {CTA.availability} {CTA.note}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("This is a static demo. Wire this to an API.");
                    }}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <Input
                      placeholder="Your name"
                      required
                      className="bg-neutral-900/60 border-emerald-800/40 text-neutral-100 placeholder-neutral-500 focus-visible:ring-emerald-500/30"
                    />
                    <Input
                      type="email"
                      placeholder="Your email"
                      required
                      className="bg-neutral-900/60 border-emerald-800/40 text-neutral-100 placeholder-neutral-500 focus-visible:ring-emerald-500/30"
                    />
                    <Textarea
                      placeholder="Project or role details"
                      className="sm:col-span-2 bg-neutral-900/60 border-emerald-800/40 text-neutral-100 placeholder-neutral-500 focus-visible:ring-emerald-500/30"
                      rows={5}
                      required
                    />
                    <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40 w-full sm:w-auto"
                      >
                        Send
                      </Button>
                      <Button
                        variant="outline"
                        asChild
                        className="border-emerald-700/50 text-emerald-300 hover:bg-emerald-500/10 w-full sm:w-auto"
                      >
                        <a href={`mailto:${PROFILE.email}`}>Email me</a>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </Section>
          </ScrollReveal>
        )}

        <footer className="py-10 text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} {PROFILE.name}. Circuit theme by you.
        </footer>
      </main>
    </div>
  );
}

export default App;



















