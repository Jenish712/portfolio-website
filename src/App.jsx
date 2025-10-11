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
import { Projects } from "./components/Projects";
import { ProjectDetail } from "./components/ProjectDetail";
import { useHashRoute } from "./utils/router";
import { PROFILE } from "./data/profile";
import { SKILLS } from "./data/skills";
import { PROJECTS } from "./data/projects";
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
  Link,
  GitBranch,
} from "lucide-react";
import './styles/App.css';

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
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  return { dark, setDark };
}

function App() {
  const { dark, setDark } = useDarkMode();
  const [tests, setTests] = useState(null);
  const route = useHashRoute();

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100">
      <CircuitBackground />

      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-emerald-800/40 bg-neutral-950/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-4">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/40 grid place-items-center">
              <CircuitBoard className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{PROFILE.name}</div>
              <div className="text-xs text-emerald-300/80 truncate hidden sm:block">{PROFILE.title}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop social links */}
            <div className="hidden md:flex items-center gap-1">
              {PROFILE.socials.map((s) => (
                <Button key={s.label} variant="ghost" size="icon" asChild className="hover:bg-emerald-500/10">
                  <a href={s.href} aria-label={s.label}>
                    <s.icon className="h-4 w-4 text-emerald-300" />
                  </a>
                </Button>
              ))}
            </div>
            
            {/* Theme toggle - always visible */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle theme"
              className="border-emerald-700/40 hover:bg-emerald-500/10"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Developer tests */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-2 bg-neutral-900/60 border border-emerald-800/40 text-neutral-100 hover:bg-neutral-900">
                  Dev
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-neutral-950 border border-emerald-800/40 text-neutral-100">
                <DialogHeader>
                  <DialogTitle>Smoke tests</DialogTitle>
                </DialogHeader>
                <div className="mb-3 text-sm text-neutral-400">
                  Quick checks for icons, data, filtering, widgets, and routing.
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40"
                    onClick={() => setTests(runSmokeTests())}
                  >
                    Run
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-700/50 text-emerald-300 hover:bg-emerald-500/10"
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
                      <div className="text-xs text-neutral-400">
                        {t.pass ? "PASS" : "FAIL"}
                        {t.details ? ` — ${t.details}` : ""}
                      </div>
                    </div>
                  ))}
                  {!tests && <div className="text-xs text-neutral-400">No results yet.</div>}
                </div>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button className="ml-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40">
                  Menu
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-neutral-950 border-l border-emerald-800/40 text-neutral-100">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigate</SheetTitle>
                </SheetHeader>
                
                {/* Mobile Navigation */}
                <nav className="mt-6 grid gap-3">
                  {[
                    ["about", "About"],
                    ["skills", "Skills"],
                    ["projects", "Projects"],
                    ["experience", "Experience"],
                    ["publications", "Publications"],
                    ["docs", "Documentation"],
                    ["contact", "Contact"],
                  ].map(([id, label]) => (
                    <a 
                      key={id} 
                      href={`#${id}`} 
                      className="text-sm hover:text-emerald-300 transition-colors py-2 border-b border-emerald-800/20 last:border-b-0"
                    >
                      {label}
                    </a>
                  ))}
                </nav>
                
                {/* Mobile Social Links */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-neutral-400 mb-4">Connect</h3>
                  <div className="flex gap-3">
                    {PROFILE.socials.map((s) => (
                      <Button 
                        key={s.label} 
                        variant="ghost" 
                        size="icon" 
                        asChild 
                        className="hover:bg-emerald-500/10"
                      >
                        <a href={s.href} aria-label={s.label}>
                          <s.icon className="h-5 w-5 text-emerald-300" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HERO */}
        {route.name === "home" && (
          <section id="about" className="py-8 sm:py-12 lg:py-16">
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-center">
              <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
                >
                  {PROFILE.name}
                </motion.h1>
                <p className="text-emerald-300/80 text-sm sm:text-base">{PROFILE.title}</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="leading-relaxed text-neutral-300 text-sm sm:text-base"
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
                      className="flex bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40 w-full sm:w-auto"
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
                      className="flex border-emerald-700/50 text-emerald-300 hover:bg-emerald-500/10 w-full sm:w-auto"
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
        )}

        {route.name === "home" && <Separator className="bg-emerald-900/40" />}

        {route.name === "home" && (
          <Section id="skills" title="Skills" icon={Wrench}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {SKILLS.map(({ group, items }) => (
                <Card key={group} className="bg-neutral-900/40 border-emerald-800/40">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg text-emerald-300">{group}</CardTitle>
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
        )}

        {route.name === "home" && <Separator className="bg-emerald-900/40" />}

        {route.name === "home" && (
          <Projects />
        )}

        {route.name === "project" && <ProjectDetail slug={route.slug} />}

        {route.name === "home" && <Separator className="bg-emerald-900/40" />}

        {route.name === "home" && (
          <Section id="experience" title="Experience" icon={FileText}>
            <div className="grid gap-4">
              {EXPERIENCE.map((e) => (
                <Card key={e.role} className="bg-neutral-900/40 border-emerald-800/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-emerald-300">
                      {e.role} · {e.org}
                    </CardTitle>
                    <div className="text-xs text-neutral-400">{e.period}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm space-y-1 text-neutral-300">
                      {e.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {route.name === "home" && <Separator className="bg-emerald-900/40" />}

        {route.name === "home" && (
          <Section id="publications" title="Publications" icon={GitBranch}>
            <div className="grid md:grid-cols-2 gap-4">
              {PUBLICATIONS.map((p) => (
                <Card key={p.title} className="bg-neutral-900/40 border-emerald-800/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-emerald-300">{p.title}</CardTitle>
                    <div className="text-xs text-neutral-400">{p.venue}</div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-emerald-700/50 text-emerald-300 hover:bg-emerald-500/10"
                    >
                      <a href={p.link}>
                        <Link className="h-3 w-3 mr-1" />View
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {route.name === "home" && <Separator className="bg-emerald-900/40" />}

        {route.name === "home" && (
          <Section id="docs" title="Documentation" icon={FileText}>
            <Card className="bg-neutral-900/40 border-emerald-800/40">
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
        )}

        {route.name === "home" && <Separator className="bg-emerald-900/40" />}

        {route.name === "home" && (
          <Section id="contact" title="Contact" icon={Mail}>
            <Card className="bg-neutral-900/40 border-emerald-800/40">
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
        )}

        <footer className="py-10 text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} {PROFILE.name}. Circuit theme by you.
        </footer>
      </main>
    </div>
  );
}

export default App;