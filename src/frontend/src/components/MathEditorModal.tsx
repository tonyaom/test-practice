import katex from "katex";
import "katex/dist/katex.min.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useRef, useState } from "react";

interface MathEditorModalProps {
  open: boolean;
  onClose: () => void;
  onInsert: (latex: string, displayMode: boolean) => void;
  initialValue?: string;
}

const SYMBOL_GROUPS = [
  {
    label: "Greek",
    symbols: [
      { label: "α", latex: "\\alpha" },
      { label: "β", latex: "\\beta" },
      { label: "γ", latex: "\\gamma" },
      { label: "δ", latex: "\\delta" },
      { label: "ε", latex: "\\epsilon" },
      { label: "ζ", latex: "\\zeta" },
      { label: "η", latex: "\\eta" },
      { label: "θ", latex: "\\theta" },
      { label: "ι", latex: "\\iota" },
      { label: "κ", latex: "\\kappa" },
      { label: "λ", latex: "\\lambda" },
      { label: "μ", latex: "\\mu" },
      { label: "ν", latex: "\\nu" },
      { label: "ξ", latex: "\\xi" },
      { label: "π", latex: "\\pi" },
      { label: "ρ", latex: "\\rho" },
      { label: "σ", latex: "\\sigma" },
      { label: "τ", latex: "\\tau" },
      { label: "υ", latex: "\\upsilon" },
      { label: "φ", latex: "\\phi" },
      { label: "χ", latex: "\\chi" },
      { label: "ψ", latex: "\\psi" },
      { label: "ω", latex: "\\omega" },
    ],
  },
  {
    label: "Operators",
    symbols: [
      { label: "+", latex: "+" },
      { label: "-", latex: "-" },
      { label: "×", latex: "\\times" },
      { label: "÷", latex: "\\div" },
      { label: "=", latex: "=" },
      { label: "≠", latex: "\\neq" },
      { label: "<", latex: "<" },
      { label: ">", latex: ">" },
      { label: "≤", latex: "\\leq" },
      { label: "≥", latex: "\\geq" },
      { label: "±", latex: "\\pm" },
      { label: "∞", latex: "\\infty" },
      { label: "∑", latex: "\\sum" },
      { label: "∏", latex: "\\prod" },
      { label: "∫", latex: "\\int" },
      { label: "∂", latex: "\\partial" },
      { label: "√", latex: "\\sqrt{}" },
      { label: "∈", latex: "\\in" },
      { label: "∉", latex: "\\notin" },
      { label: "⊂", latex: "\\subset" },
      { label: "⊃", latex: "\\supset" },
      { label: "∩", latex: "\\cap" },
      { label: "∪", latex: "\\cup" },
      { label: "¬", latex: "\\neg" },
      { label: "∧", latex: "\\wedge" },
      { label: "∨", latex: "\\vee" },
      { label: "∀", latex: "\\forall" },
      { label: "∃", latex: "\\exists" },
    ],
  },
  {
    label: "Templates",
    symbols: [
      { label: "x²", latex: "x^{2}" },
      { label: "xₙ", latex: "x_{n}" },
      { label: "a/b", latex: "\\frac{a}{b}" },
      { label: "√x", latex: "\\sqrt{x}" },
      { label: "∛x", latex: "\\sqrt[3]{x}" },
      { label: "lim", latex: "\\lim_{x \\to \\infty}" },
      { label: "∑ᵢ", latex: "\\sum_{i=0}^{n}" },
      { label: "∫ab", latex: "\\int_{a}^{b}" },
      { label: "vec", latex: "\\vec{v}" },
      { label: "hat", latex: "\\hat{x}" },
      { label: "bar", latex: "\\bar{x}" },
      {
        label: "mat",
        latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
      },
    ],
  },
];

function renderPreview(latex: string, display: boolean): string {
  if (!latex.trim()) return "";
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: display,
      output: "htmlAndMathml",
    });
  } catch {
    return `<span style="color: var(--color-destructive)">${latex}</span>`;
  }
}

export function MathEditorModal({
  open,
  onClose,
  onInsert,
  initialValue = "",
}: MathEditorModalProps) {
  const [latex, setLatex] = useState(initialValue);
  const [displayMode, setDisplayMode] = useState(false);
  const [activeGroup, setActiveGroup] = useState("Greek");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewHtml = renderPreview(latex, displayMode);

  // Reset state when opened with a new value
  useEffect(() => {
    if (open) {
      setLatex(initialValue);
    }
  }, [open, initialValue]);

  const insertSymbol = useCallback(
    (symbolLatex: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        setLatex((prev) => prev + symbolLatex);
        return;
      }
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = latex.slice(0, start);
      const after = latex.slice(end);
      const newLatex = before + symbolLatex + after;
      setLatex(newLatex);
      // Restore cursor after the inserted symbol
      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPos = start + symbolLatex.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [latex],
  );

  const handleInsert = useCallback(() => {
    const trimmed = latex.trim();
    if (!trimmed) return;
    onInsert(trimmed, displayMode);
    onClose();
  }, [latex, displayMode, onInsert, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleInsert();
    },
    [onClose, handleInsert],
  );

  const currentGroup =
    SYMBOL_GROUPS.find((g) => g.label === activeGroup) ?? SYMBOL_GROUPS[0];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl w-full p-0 gap-0 overflow-hidden"
        data-ocid="math_editor.dialog"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="text-base font-semibold text-foreground">
            Math Formula Editor
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Left column — input + symbols */}
          <div className="p-4 space-y-3">
            {/* Mode toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Mode
              </span>
              <div className="flex rounded-md border border-border overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setDisplayMode(false)}
                  data-ocid="math_editor.inline_toggle"
                  className={`px-3 py-1.5 transition-colors ${
                    !displayMode
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Inline
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode(true)}
                  data-ocid="math_editor.display_toggle"
                  className={`px-3 py-1.5 transition-colors ${
                    displayMode
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Display
                </button>
              </div>
            </div>

            {/* LaTeX input */}
            <div className="space-y-1.5">
              <label
                htmlFor="math-latex-input"
                className="text-xs font-medium text-muted-foreground"
              >
                LaTeX
              </label>
              <textarea
                id="math-latex-input"
                ref={textareaRef}
                value={latex}
                onChange={(e) => setLatex(e.target.value)}
                placeholder="e.g. \\frac{a}{b} or \\sum_{i=0}^{n} x_i"
                rows={4}
                data-ocid="math_editor.latex_input"
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                Press{" "}
                <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-xs">
                  Ctrl+Enter
                </kbd>{" "}
                to insert.
              </p>
            </div>

            {/* Symbol palette */}
            <div className="space-y-2">
              <Tabs value={activeGroup} onValueChange={setActiveGroup}>
                <TabsList className="h-7 gap-1 bg-muted/40">
                  {SYMBOL_GROUPS.map((g) => (
                    <TabsTrigger
                      key={g.label}
                      value={g.label}
                      className="text-xs h-6 px-2"
                      data-ocid={`math_editor.symbol_tab.${g.label.toLowerCase()}`}
                    >
                      {g.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="grid grid-cols-8 gap-1">
                {currentGroup.symbols.map((sym) => (
                  <button
                    key={sym.latex}
                    type="button"
                    title={sym.latex}
                    onClick={() => insertSymbol(sym.latex)}
                    data-ocid="math_editor.symbol_button"
                    className="flex items-center justify-center h-8 w-full rounded border border-border bg-card text-sm hover:bg-primary/10 hover:border-primary/40 transition-colors cursor-pointer font-serif"
                  >
                    {sym.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — live preview */}
          <div className="p-4 space-y-2 bg-muted/20">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Preview
            </span>
            <div
              className="min-h-32 rounded-lg border border-border bg-card p-4 flex items-center justify-center"
              data-ocid="math_editor.preview"
            >
              {previewHtml ? (
                <div
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: admin-authored KaTeX output only
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                  className={`text-foreground ${
                    displayMode ? "text-center text-lg" : "text-sm"
                  }`}
                />
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Your formula will appear here…
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {displayMode
                ? "Display mode — formula rendered on its own line"
                : "Inline mode — formula flows with surrounding text"}
            </p>

            {/* Raw LaTeX for copy-paste */}
            {latex.trim() && (
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Raw LaTeX</span>
                <code className="block rounded border border-border bg-card px-2.5 py-1.5 text-xs font-mono text-foreground break-all">
                  {displayMode ? `$$${latex}$$` : `$${latex}$`}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-2 bg-card">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-ocid="math_editor.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleInsert}
            disabled={!latex.trim()}
            data-ocid="math_editor.insert_button"
          >
            Insert Formula
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
