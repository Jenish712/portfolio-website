import React from "react";
import ReactMarkdown from "react-markdown";

/**
 * MarkdownText - Safe Markdown renderer for project descriptions
 * Renders **bold**, *italic*, `code`, links, lists while staying theme-consistent
 */
export function MarkdownText({ children, className = "", inline = false }) {
  const Wrapper = inline ? 'span' : 'div';
  return (
    <Wrapper className={className}>
      <ReactMarkdown
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
        // linkTarget removed in react-markdown v10 (handled in custom <a> component)
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
          // Paragraphs as inline spans to safely render inside custom wrappers
          p: ({ children }) => (
            <span className="leading-relaxed">{children}</span>
          ),
          // List containers and items for Markdown-generated lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 pl-4 marker:text-emerald-400">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 pl-5">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
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
    </Wrapper>
  );
}
