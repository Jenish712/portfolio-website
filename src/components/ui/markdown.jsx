import React from "react";
import ReactMarkdown from "react-markdown";

/**
 * MarkdownText - Safe Markdown renderer for project descriptions
 * Renders **bold**, *italic*, `code`, links, lists while staying theme-consistent
 */
export function MarkdownText({ children, className = "" }) {
  return (
    <ReactMarkdown
      className={className}
      // Whitelist safe inline/block elements only (no raw HTML)
      allowedElements={[
        "p",
        "strong",
        "em",
        "code",
        "a",
        "ul",
        "ol",
        "li",
        "br",
        "blockquote",
      ]}
      unwrapDisallowed
      linkTarget="_blank"
      rel="noopener noreferrer"
      components={{
        // Bold text: use theme foreground for emphasis
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        // Italic text
        em: ({ children }) => <em className="italic">{children}</em>,
        // Inline code: muted background pill
        code: ({ children }) => (
          <code className="rounded bg-muted px-1.5 py-0.5 text-[0.9em] font-mono text-foreground">
            {children}
          </code>
        ),
        // Links: use primary color
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary hover:text-primary/80 transition-colors"
          >
            {children}
          </a>
        ),
        // Paragraph: preserve leading
        p: ({ children }) => (
          <span className="inline leading-relaxed">{children}</span>
        ),
        // List items
        li: ({ children }) => (
          <li className="ml-4 list-disc leading-relaxed">{children}</li>
        ),
        // Unordered list
        ul: ({ children }) => <ul className="space-y-1">{children}</ul>,
        // Ordered list
        ol: ({ children }) => (
          <ol className="space-y-1 list-decimal ml-4">{children}</ol>
        ),
        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground">
            {children}
          </blockquote>
        ),
      }}
    >
      {children || ""}
    </ReactMarkdown>
  );
}
