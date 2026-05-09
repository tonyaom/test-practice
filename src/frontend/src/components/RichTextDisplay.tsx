import katex from "katex";
import "katex/dist/katex.min.css";
import { useEffect, useRef } from "react";

interface RichTextDisplayProps {
  html: string;
  className?: string;
}

/**
 * Renders rich HTML content (from the Quill editor) with KaTeX math support.
 * Handles:
 *  - HTML from the rich text editor (dangerouslySetInnerHTML)
 *  - Block math:  $$ ... $$ or \[ ... \]
 *  - Inline math: $ ... $ or \( ... \)
 * Content is admin-authored only, so XSS risk is managed.
 */
export function RichTextDisplay({
  html,
  className = "",
}: RichTextDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // After HTML is injected, walk the text nodes and replace math delimiters
  // with rendered KaTeX spans.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    renderMath(el);
  });

  return (
    <div
      ref={containerRef}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: admin-authored content only
      dangerouslySetInnerHTML={{ __html: html }}
      className={`rich-text-display ${className}`}
    />
  );
}

/** Walk all text nodes inside el and replace math delimiters with rendered KaTeX. */
function renderMath(el: HTMLElement) {
  // We collect text nodes in order, then process them.
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node !== null) {
    textNodes.push(node as Text);
    node = walker.nextNode();
  }

  for (const textNode of textNodes) {
    const raw = textNode.textContent ?? "";
    if (!hasMathDelimiter(raw)) continue;

    const fragment = buildMathFragment(raw);
    if (fragment) {
      textNode.parentNode?.replaceChild(fragment, textNode);
    }
  }
}

function hasMathDelimiter(text: string): boolean {
  return (
    text.includes("$$") ||
    text.includes("\\[") ||
    text.includes("\\]") ||
    text.includes("\\(") ||
    text.includes("\\)") ||
    /(?<!\\)\$/.test(text)
  );
}

type MathSegment =
  | { type: "text"; value: string }
  | { type: "math"; value: string; display: boolean };

/**
 * Parse a text string into segments of plain text and math.
 * Priority: $$...$$ and \[...\] (display), then $...$ and \(...\) (inline).
 */
function parseSegments(raw: string): MathSegment[] {
  const segments: MathSegment[] = [];
  // Combined regex: $$...$$ | \[...\] | $...$ | \(...\)
  const mathRe =
    /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$(?!\$)[^$\n]+?(?<!\\)\$|\\\([\s\S]+?\\\))/g;

  let lastIndex = 0;
  let match = mathRe.exec(raw);

  while (match !== null) {
    const before = raw.slice(lastIndex, match.index);
    if (before) segments.push({ type: "text", value: before });

    const full = match[1];
    let display = false;
    let formula = full;

    if (full.startsWith("$$") && full.endsWith("$$")) {
      display = true;
      formula = full.slice(2, -2);
    } else if (full.startsWith("\\[") && full.endsWith("\\]")) {
      display = true;
      formula = full.slice(2, -2);
    } else if (full.startsWith("\\(") && full.endsWith("\\)")) {
      display = false;
      formula = full.slice(2, -2);
    } else {
      // $...$
      display = false;
      formula = full.slice(1, -1);
    }

    segments.push({ type: "math", value: formula.trim(), display });
    lastIndex = match.index + full.length;
    match = mathRe.exec(raw);
  }

  const tail = raw.slice(lastIndex);
  if (tail) segments.push({ type: "text", value: tail });

  return segments;
}

/** Build a DocumentFragment from parsed segments. */
function buildMathFragment(raw: string): DocumentFragment | null {
  const segments = parseSegments(raw);
  if (segments.length === 1 && segments[0].type === "text") return null;

  const frag = document.createDocumentFragment();
  for (const seg of segments) {
    if (seg.type === "text") {
      frag.appendChild(document.createTextNode(seg.value));
    } else {
      const span = document.createElement("span");
      span.className = seg.display ? "katex-display-inline" : "katex-inline";
      try {
        katex.render(seg.value, span, {
          throwOnError: false,
          displayMode: seg.display,
          output: "htmlAndMathml",
        });
      } catch {
        span.textContent = seg.display ? `$$${seg.value}$$` : `$${seg.value}$`;
      }
      frag.appendChild(span);
    }
  }
  return frag;
}
