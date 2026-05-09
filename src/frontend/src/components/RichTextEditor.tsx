import katex from "katex";
import "katex/dist/katex.min.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { MathEditorModal } from "./MathEditorModal";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  id?: string;
}

// Register KaTeX formula handler for Quill
function registerFormulaBlot() {
  try {
    // ReactQuill.Quill may be undefined in some bundler configurations;
    // fall back to importing Quill directly from 'quill'.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const QuillClass: any = ReactQuill.Quill ?? (window as any).Quill;
    if (!QuillClass) {
      console.error(
        "[RichTextEditor] Quill class not available — formula blot not registered",
      );
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = (QuillClass as any).imports?.["formats/formula"];
    if (existing) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Embed = (QuillClass as any).import("blots/embed");
    class FormulaBlot extends Embed {
      static blotName = "formula";
      static tagName = "span";
      static className = "ql-formula";

      static create(value: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const node = Embed.create(value) as HTMLElement;
        katex.render(value, node, {
          throwOnError: false,
          displayMode: false,
        });
        node.setAttribute("data-value", value);
        return node;
      }

      static value(domNode: HTMLElement) {
        return domNode.getAttribute("data-value");
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (QuillClass as any).register(FormulaBlot, true);
  } catch (err) {
    console.error("[RichTextEditor] Failed to register FormulaBlot:", err);
  }
}

const TOOLBAR_MODULES = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] as string[] }, { background: [] as string[] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "formula"],
  ["clean"],
];

const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "link",
  "formula",
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text…",
  minHeight = 150,
  id,
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const [mathModalOpen, setMathModalOpen] = useState(false);

  useEffect(() => {
    registerFormulaBlot();
  }, []);

  // Wire the Quill toolbar formula button to open our modal instead
  useEffect(() => {
    const editor = quillRef.current;
    if (!editor) return;

    const toolbarEl = (
      editor as unknown as {
        getEditor?: () => {
          getModule?: (name: string) => { container?: HTMLElement };
        };
      }
    )
      .getEditor?.()
      ?.getModule?.("toolbar")?.container;
    if (!toolbarEl) return;

    const formulaBtn =
      toolbarEl.querySelector<HTMLButtonElement>("button.ql-formula");
    if (!formulaBtn) return;

    const handler = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      setMathModalOpen(true);
    };
    formulaBtn.addEventListener("click", handler, true);
    return () => formulaBtn.removeEventListener("click", handler, true);
  });

  const handleChange = useCallback(
    (content: string) => {
      const isEmpty = content === "<p><br></p>" || content === "<p></p>";
      onChange(isEmpty ? "" : content);
    },
    [onChange],
  );

  const handleInsertFormula = useCallback(
    (latex: string, displayMode: boolean) => {
      const editor = quillRef.current?.getEditor?.();
      if (!editor) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const quillAny = editor as unknown as any;
      const range = quillAny.getSelection(true) as {
        index: number;
        length: number;
      } | null;
      const idx = range?.index ?? quillAny.getLength() - 1;
      if (range?.length) quillAny.deleteText(idx, range.length);
      if (displayMode) {
        // Insert as display-mode block via raw HTML delta
        quillAny.insertText(idx, ` $${latex}$ `, "user");
      } else {
        quillAny.insertEmbed(idx, "formula", latex, "user");
        quillAny.insertText(idx + 1, " ", "user");
      }
      quillAny.setSelection(idx + 2, 0, "user");
    },
    [],
  );

  const modules = useMemo(
    () => ({
      toolbar: TOOLBAR_MODULES,
    }),
    [],
  );

  return (
    <>
      <div
        className="rich-text-editor"
        style={{ minHeight }}
        data-ocid={id ?? "rich_text_editor"}
      >
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={FORMATS}
          placeholder={placeholder}
        />
      </div>
      <MathEditorModal
        open={mathModalOpen}
        onClose={() => setMathModalOpen(false)}
        onInsert={handleInsertFormula}
      />
    </>
  );
}
