import React, { useMemo, useState } from "react";
import { Section, Pill } from "./ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { MarkdownText } from "./ui/markdown";
import {
  ArrowLeft,
  ExternalLink,
  Link,
  CircuitBoard,
  Github,
  Calendar,
  Users,
  Zap,
  CheckCircle,
  Code2,
  Clipboard,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import { getProjectBySlug } from "../data/projects-store";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const linkIcons = {
  Code: Github,
  GitHub: Github,
  Demo: ExternalLink,
  Live: ExternalLink,
  Docs: Link,
  Design: ExternalLink,
  Report: Link,
  Roadmap: Link,
};

const MotionCard = motion(Card);

function CodeSnippet({ snippet, id, onCopy, copied }) {
  return (
    <MotionCard
      key={id}
      className="bg-card dark:bg-neutral-950/40 border dark:border-emerald-800/40 overflow-visible"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader className="gap-2">
        <CardTitle className="flex items-center gap-2 text-emerald-300 text-base">
          <Code2 className="h-5 w-5" />
          {snippet.title || "Code snippet"}
        </CardTitle>
        <div className="flex items-center justify-between" role="group" aria-label="Code snippet actions">
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="sr-only">Language:</span>
            <span className="px-2 py-0.5 rounded-full border dark:border-emerald-700/40 bg-emerald-500/5 uppercase tracking-wide">
              {(snippet.language || 'code').toString()}
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            className="border text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={copied ? "Copied code" : "Copy code"}
            onClick={() => onCopy(id, snippet.code)}
          >
            {/* Mobile: icon only, Desktop: icon + label */}
            <span className="sm:hidden">
              {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-sm">
              {copied ? (<><Check className="h-4 w-4" />Copied</>) : (<><Clipboard className="h-4 w-4" />Copy</>)}
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative overflow-x-auto code-scroll pb-2" style={{ maxWidth: '100%', width: '100%', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ minWidth: '100%', width: 'max-content' }}>
            <SyntaxHighlighter
              language={snippet.language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1rem',
                borderRadius: '0.75rem',
                background: 'rgba(17, 24, 39, 0.7)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                display: 'inline-block',
                width: 'max-content',
                minWidth: '100%',
                maxWidth: 'none',
                overflowX: 'visible'
              }}
              codeTagProps={{
                style: {
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre',
                  wordBreak: 'keep-all',
                  overflowWrap: 'normal'
                }
              }}
              wrapLongLines={false}
            >
              {snippet.code}
            </SyntaxHighlighter>
          </div>
      </CardContent>
    </MotionCard>
  );
}

export function ProjectDetail({ slug }) {
  const [copiedId, setCopiedId] = useState(null);
  const project = useMemo(() => getProjectBySlug(slug), [slug]);

  if (!project) {
    return (
      <Section id="project" title="Project not found" icon={CircuitBoard}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <CircuitBoard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Project Not Found</h3>
            <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or may have been moved.</p>
          <Button onClick={() => window.history.back()} className="bg-emerald-600 hover:bg-emerald-500">
            <ArrowLeft className="h-4 w-4 mr-2" />Go Back
          </Button>
        </motion.div>
      </Section>
    );
  }

  const handleCopy = (id, code) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const scrollBack = () => window.history.back();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Section id="project" title="" icon={CircuitBoard}>
        <div className="space-y-10">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl border dark:border-emerald-900/30 bg-card dark:bg-neutral-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-teal-500/10" />
            <div className="relative p-6 sm:p-8 lg:p-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                 <Button
                   onClick={scrollBack}
                   variant="outline"
                   className="border text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
                 >
                  <ArrowLeft className="h-4 w-4 mr-2" />Back to Projects
                </Button>
                <div className="flex flex-wrap gap-3">
                  {project.links?.map((link) => {
                    const Icon = linkIcons[link.label] || ExternalLink;
                    return (
                        <Button
                          key={link.label}
                          asChild
                          variant="outline"
                          className="border text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
                        >
                        <a href={link.url || link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  {project.title}
                </h1>
                <MarkdownText className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                  {project.description}
                </MarkdownText>
                <div className="flex flex-wrap gap-2">
                  {(project.tech || []).map((tech) => (
                    <Pill key={tech} variant="secondary" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                      {tech}
                    </Pill>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] gap-6 md:gap-8 lg:gap-12 overflow-x-hidden">
            {/* Main article */}
            <div className="space-y-8 order-2 lg:order-1 min-w-0">
              {project.detailSections?.map((section, index) => (
                <motion.article
                  key={`${section.heading}-${index}`}
                  className="rounded-3xl border dark:border-emerald-900/30 bg-card dark:bg-neutral-900/40 p-6 sm:p-8 space-y-5"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h2 className="text-xl font-semibold">{section.heading}</h2>
                  </div>

                  {section.body?.map((paragraph, i) => (
                    <MarkdownText key={i} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </MarkdownText>
                  ))}

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground marker:text-emerald-400">
                      {section.bullets.map((item, idx) => (
                        <li key={idx}>
                          <MarkdownText inline>{item}</MarkdownText>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.image && (
                    <figure className="overflow-hidden rounded-2xl border dark:border-emerald-800/40 bg-card dark:bg-neutral-900/40">
                      <img
                        src={section.image.src}
                        alt={section.image.alt}
                        className="w-full h-auto max-h-[28rem] object-cover"
                      />
                      {(section.image.caption || section.image.alt) && (
                        <figcaption className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground border-t border dark:border-emerald-800/40">
                          <ImageIcon className="h-4 w-4" />
                          <span>{section.image.caption || section.image.alt}</span>
                        </figcaption>
                      )}
                    </figure>
                  )}

                  {section.codeSnippets?.map((snippet, snippetIndex) => (
                    <CodeSnippet
                      key={`${index}-${snippetIndex}`}
                      snippet={snippet}
                      id={`${index}-${snippetIndex}`}
                      copied={copiedId === `${index}-${snippetIndex}`}
                      onCopy={handleCopy}
                    />
                  ))}
                </motion.article>
              ))}

              {project.highlights && project.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (project.detailSections?.length || 1) }}
                >
                  <Card className="border dark:border-emerald-900/40 dark:bg-neutral-900/40">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                        <Zap className="h-5 w-5" />
                        Key Highlights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {project.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                          <MarkdownText className="text-muted-foreground flex-1">
                            {highlight}
                          </MarkdownText>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {project.gallery && project.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-200">Gallery</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.gallery.map((item, index) => (
                      <figure
                        key={index}
                        className="rounded-2xl border dark:border-emerald-800/40 bg-card dark:bg-neutral-900/40 overflow-hidden"
                      >
                        <img src={item.src} alt={item.alt} className="w-full h-auto max-h-[22rem] object-cover" />
                        {(item.caption || item.alt) && (
                          <figcaption className="px-4 py-3 text-sm text-muted-foreground border-t border dark:border-emerald-800/40">
                            {item.caption || item.alt}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6 order-1 lg:order-2 min-w-0">
              <MotionCard
                className="border dark:border-emerald-900/40 dark:bg-neutral-900/40"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CardHeader>
                  <CardTitle className="text-emerald-700 dark:text-emerald-300 text-lg">Project Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 text-sm text-muted-foreground">
                  {project.timeline && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">Timeline</p>
                        <p className="font-medium">{project.timeline}</p>
                      </div>
                    </div>
                  )}
                  {project.team && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">Team</p>
                        <p className="font-medium">{project.team}</p>
                      </div>
                    </div>
                  )}
                  {project.category && (
                    <div className="flex items-start gap-3">
                      <CircuitBoard className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase text-muted-foreground mb-2">Category</p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.category.split(/[,&]+/).map((cat, idx) => (
                            <Pill 
                              key={idx} 
                              variant="secondary" 
                              className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-xs px-2.5 py-1"
                            >
                              {cat.trim()}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {project.metrics?.map((metric) => (
                    <div key={metric.label} className="rounded-xl border dark:border-emerald-800/40 px-3 py-3">
                      <p className="text-xs uppercase text-muted-foreground">{metric.label}</p>
                      <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">{metric.value}</p>
                    </div>
                  ))}
                </CardContent>
              </MotionCard>

              <MotionCard
                className="border dark:border-emerald-900/40 dark:bg-neutral-900/40"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardHeader>
                  <CardTitle className="text-emerald-700 dark:text-emerald-300 text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="space-y-2">
                    {project.content?.map((line, idx) => (
                      <p key={idx} className="leading-relaxed text-left lg:text-justify-pretty">
                        {line}
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags?.map((tag) => (
                      <Pill key={tag} className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-xs">
                        {tag}
                      </Pill>
                    ))}
                  </div>
                </CardContent>
              </MotionCard>
            </div>
          </div>
        </div>
      </Section>
    </motion.div>
  );
}











