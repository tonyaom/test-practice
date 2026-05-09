import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle2,
  GripVertical,
  Image,
  Loader2,
  Minus,
  Music,
  Plus,
  Upload,
  X,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { QuestionType } from "../backend";
import {
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  getFontSize,
  setFontSize,
} from "../utils/fontSizeStorage";
import { QUESTION_TYPE_LABELS, QuestionTypeIcon } from "./QuestionTypeIcon";
import { RichTextEditor } from "./RichTextEditor";

export { getFontSize, setFontSize };

export interface QuestionFormData {
  text: string;
  questionType: QuestionType;
  options: string[];
  correctAnswers: number[]; // indices
  correctText: string;
  correctOrder: number[]; // indices representing order of options
  imageFile: File | null;
  imagePreviewUrl: string | null;
  sectionId: number | null;
  /** Optional rich-text explanation shown after the user answers. Supports math via MathEditorModal. */
  explanation: string;
  /** Audio URL to download and store in backend */
  audioUrl: string;
  /** Audio download status */
  audioStatus: "idle" | "downloading" | "ready" | "error";
  /** Audio download error message */
  audioErrorMsg: string;
}

export function defaultQuestionFormData(
  sectionId: number | null = null,
): QuestionFormData {
  return {
    text: "",
    questionType: QuestionType.mcSingle,
    options: ["", "", "", ""],
    correctAnswers: [0],
    correctText: "",
    correctOrder: [0, 1, 2, 3],
    imageFile: null,
    imagePreviewUrl: null,
    sectionId,
    explanation: "",
    audioUrl: "",
    audioStatus: "idle",
    audioErrorMsg: "",
  };
}

export interface SectionOption {
  id: number;
  name: string;
}

interface QuestionFormProps {
  data: QuestionFormData;
  onChange: (data: QuestionFormData) => void;
  uploadProgress?: number;
  sections?: SectionOption[];
  onDownloadAudio?: (
    url: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

export function QuestionForm({
  data,
  onChange,
  uploadProgress = 0,
  sections = [],
  onDownloadAudio,
}: QuestionFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);
  const [fontSize, setFontSizeState] = useState<number>(() => getFontSize());

  function handleFontSizeChange(size: number) {
    setFontSizeState(size);
    setFontSize(size);
  }

  function update(partial: Partial<QuestionFormData>) {
    onChange({ ...data, ...partial });
  }

  function handleTypeChange(type: QuestionType) {
    const filledOpts = data.options.filter((o) => o.trim());
    const optCount = Math.max(filledOpts.length, 4);
    const opts = Array.from(
      { length: optCount },
      (_, i) => data.options[i] ?? "",
    );
    update({
      questionType: type,
      options: opts,
      correctAnswers: [0],
      correctOrder: opts.map((_, i) => i),
    });
  }

  function handleOptionChange(index: number, value: string) {
    const next = [...data.options];
    next[index] = value;
    update({ options: next });
  }

  function addOption() {
    const nextOpts = [...data.options, ""];
    update({
      options: nextOpts,
      correctOrder: [...data.correctOrder, nextOpts.length - 1],
    });
  }

  function removeOption(index: number) {
    if (data.options.length <= 2) return;
    const next = data.options.filter((_, i) => i !== index);
    const nextCorrect = data.correctAnswers
      .filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));
    const nextOrder = data.correctOrder
      .filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));
    update({
      options: next,
      correctAnswers: nextCorrect,
      correctOrder: nextOrder,
    });
  }

  function toggleCorrect(index: number) {
    if (data.questionType === QuestionType.mcSingle) {
      update({ correctAnswers: [index] });
    } else {
      const has = data.correctAnswers.includes(index);
      update({
        correctAnswers: has
          ? data.correctAnswers.filter((i) => i !== index)
          : [...data.correctAnswers, index],
      });
    }
  }

  // Drag-and-drop for correct order
  function onDragStart(index: number) {
    dragItemIndex.current = index;
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function onDrop(targetIndex: number) {
    const from = dragItemIndex.current;
    if (from === null || from === targetIndex) {
      setDragOverIndex(null);
      return;
    }
    const next = [...data.correctOrder];
    const [removed] = next.splice(from, 1);
    next.splice(targetIndex, 0, removed);
    update({ correctOrder: next });
    dragItemIndex.current = null;
    setDragOverIndex(null);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const url = URL.createObjectURL(file);
    update({ imageFile: file, imagePreviewUrl: url });
  }

  function clearImage() {
    if (data.imagePreviewUrl) URL.revokeObjectURL(data.imagePreviewUrl);
    update({ imageFile: null, imagePreviewUrl: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAudioUrlChange(url: string) {
    update({ audioUrl: url, audioStatus: "idle", audioErrorMsg: "" });
  }

  async function handleAudioDownload() {
    if (!data.audioUrl.trim()) return;
    update({ audioStatus: "downloading", audioErrorMsg: "" });
    if (onDownloadAudio) {
      const result = await onDownloadAudio(data.audioUrl.trim());
      if (result.success) {
        update({ audioStatus: "ready", audioErrorMsg: "" });
      } else {
        update({
          audioStatus: "error",
          audioErrorMsg: result.error ?? "Download failed",
        });
      }
    } else {
      // No handler provided — mark ready as placeholder
      update({ audioStatus: "ready", audioErrorMsg: "" });
    }
  }

  function handleAudioRetry() {
    update({ audioStatus: "downloading", audioErrorMsg: "" });
    handleAudioDownload();
  }

  function clearAudio() {
    update({ audioUrl: "", audioStatus: "idle", audioErrorMsg: "" });
  }

  const fontSizeStyle: React.CSSProperties = { fontSize: `${fontSize}px` };

  const showOptions =
    data.questionType === QuestionType.mcSingle ||
    data.questionType === QuestionType.mcMulti ||
    data.questionType === QuestionType.dragOrder;

  return (
    <div className="space-y-5">
      {/* Font size controls */}
      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs text-muted-foreground">Text size:</span>
        <input
          type="range"
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          step={1}
          value={fontSize}
          onChange={(e) => handleFontSizeChange(Number(e.target.value))}
          aria-label={`Font size: ${fontSize}px`}
          data-ocid="question_form.font_size_slider"
          className="w-28 sm:w-36 accent-primary cursor-pointer"
        />
        <span className="text-xs text-muted-foreground tabular-nums w-8 text-right select-none">
          {fontSize}px
        </span>
      </div>

      {/* Section assignment */}
      {sections.length > 0 && (
        <div className="space-y-2">
          <Label>Section</Label>
          <Select
            value={
              data.sectionId !== null ? String(data.sectionId) : "uncategorized"
            }
            onValueChange={(v) =>
              update({ sectionId: v === "uncategorized" ? null : Number(v) })
            }
          >
            <SelectTrigger data-ocid="admin.question_form.section.select">
              <SelectValue placeholder="Uncategorized" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uncategorized">Uncategorized</SelectItem>
              {sections.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Type */}
      <div className="space-y-2">
        <Label>Question Type</Label>
        <Select
          value={data.questionType}
          onValueChange={(v) => handleTypeChange(v as QuestionType)}
        >
          <SelectTrigger data-ocid="admin.question_form.type.select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(QuestionType).map((t) => (
              <SelectItem key={t} value={t}>
                <span className="flex items-center gap-2">
                  <QuestionTypeIcon type={t} />
                  {QUESTION_TYPE_LABELS[t]}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Question text */}
      <div className="space-y-2" data-ocid="admin.question.text_input">
        <Label>Question Text</Label>
        <RichTextEditor
          value={data.text}
          onChange={(html) => update({ text: html })}
          placeholder="Enter the question…"
          minHeight={150}
          id="admin.question_form.text.editor"
        />
      </div>

      {/* Image upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Image className="w-4 h-4 text-muted-foreground" />
          Question Image
          <span className="text-muted-foreground font-normal text-xs">
            (optional)
          </span>
        </Label>
        {data.imagePreviewUrl ? (
          <div className="relative inline-block">
            <img
              src={data.imagePreviewUrl}
              alt="Question preview"
              className="max-h-40 rounded-lg border border-border object-contain bg-muted"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:opacity-90 transition-fast"
              aria-label="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <label
            className="flex items-center gap-3 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-fast"
            data-ocid="admin.question_form.image.dropzone"
          >
            <Upload className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Click to upload image
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 5 MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="bg-muted rounded-full h-1.5">
            <div
              className="bg-accent rounded-full h-1.5 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Audio URL */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Music className="w-4 h-4 text-muted-foreground" />
          Audio
          <span className="text-muted-foreground font-normal text-xs">
            (optional — paste MP3 URL)
          </span>
        </Label>
        <div className="flex gap-2">
          <Input
            value={data.audioUrl}
            onChange={(e) => handleAudioUrlChange(e.target.value)}
            onBlur={() => {
              if (data.audioUrl.trim() && data.audioStatus === "idle")
                handleAudioDownload();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAudioDownload();
              }
            }}
            placeholder="https://example.com/audio.mp3"
            className="flex-1"
            data-ocid="admin.question_form.audio_url.input"
          />
          {data.audioUrl.trim() && data.audioStatus !== "ready" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAudioDownload}
              disabled={data.audioStatus === "downloading"}
              data-ocid="admin.question_form.audio_download.button"
            >
              {data.audioStatus === "downloading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Download"
              )}
            </Button>
          )}
          {data.audioUrl.trim() && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearAudio}
              aria-label="Clear audio"
              data-ocid="admin.question_form.audio_clear.button"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Download progress */}
        {data.audioStatus === "downloading" && (
          <div
            className="flex items-center gap-2 text-xs text-muted-foreground"
            data-ocid="admin.question_form.audio.loading_state"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Downloading audio…
          </div>
        )}

        {/* Error state with retry */}
        {data.audioStatus === "error" && (
          <div
            className="flex items-start gap-2.5 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30"
            data-ocid="admin.question_form.audio.error_state"
          >
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-destructive">
                {data.audioErrorMsg ||
                  "Download failed: URL not accessible. Max file size is 2MB."}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAudioRetry}
              className="shrink-0 text-xs h-7 border-destructive/40 text-destructive hover:bg-destructive/10"
              data-ocid="admin.question_form.audio.retry_button"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Ready state with preview player */}
        {data.audioStatus === "ready" && (
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-accent/10 border border-accent/30"
            data-ocid="admin.question_form.audio.success_state"
          >
            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
            <span className="text-xs font-medium text-accent flex-1">
              Audio ready
            </span>
            <audio
              src={data.audioUrl}
              controls
              className="h-7 max-w-48"
              data-ocid="admin.question_form.audio.preview_player"
            >
              <track kind="captions" />
            </audio>
          </div>
        )}
      </div>

      <Separator />

      {/* Options list for MC / dragOrder */}
      {showOptions && (
        <div className="space-y-3">
          <Label>
            {data.questionType === QuestionType.dragOrder
              ? "Items (set the correct order below)"
              : "Answer Options"}
          </Label>
          <div className="space-y-2" style={fontSizeStyle}>
            {data.options.map((opt, i) => {
              const isCorrect = data.correctAnswers.includes(i);
              const optKey = `opt-${i}`;
              return (
                <div key={optKey} className="flex items-center gap-2">
                  {/* Correct toggle — only for MC types */}
                  {(data.questionType === QuestionType.mcSingle ||
                    data.questionType === QuestionType.mcMulti) && (
                    <button
                      type="button"
                      onClick={() => toggleCorrect(i)}
                      aria-label={isCorrect ? "Mark incorrect" : "Mark correct"}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-fast ${
                        isCorrect
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-background hover:border-accent/60"
                      }`}
                      data-ocid={`admin.question.correct_checkbox.${i + 1}`}
                    >
                      {isCorrect && (
                        <span className="block w-2 h-2 rounded-full bg-accent-foreground" />
                      )}
                    </button>
                  )}
                  {data.questionType === QuestionType.dragOrder && (
                    <span className="w-6 h-6 rounded bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center shrink-0">
                      {i}
                    </span>
                  )}
                  <Input
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    data-ocid={`admin.question.option_input.${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    disabled={data.options.length <= 2}
                    className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive disabled:opacity-30 transition-fast"
                    aria-label="Remove option"
                    data-ocid={`admin.question_form.remove_option.${i + 1}`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={addOption}
            data-ocid="admin.question_form.add_option.button"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Option
          </Button>
          {(data.questionType === QuestionType.mcSingle ||
            data.questionType === QuestionType.mcMulti) && (
            <p className="text-xs text-muted-foreground">
              {data.questionType === QuestionType.mcSingle
                ? "Click the circle to mark the correct answer."
                : "Click circles to mark all correct answers."}
            </p>
          )}
        </div>
      )}

      {/* Drag order — correct sequence editor */}
      {data.questionType === QuestionType.dragOrder &&
        data.options.some((o) => o.trim()) && (
          <div className="space-y-2">
            <Label>Correct Order</Label>
            <p className="text-xs text-muted-foreground">
              Drag items to set the correct order.
            </p>
            <div className="space-y-1.5">
              {data.correctOrder.map((optIdx, pos) => {
                const posKey = `order-pos-${pos}`;
                const label = data.options[optIdx] || `Option ${optIdx}`;
                const isDragOver = dragOverIndex === pos;
                return (
                  <div
                    key={posKey}
                    draggable
                    onDragStart={() => onDragStart(pos)}
                    onDragOver={(e) => onDragOver(e, pos)}
                    onDrop={() => onDrop(pos)}
                    onDragLeave={() => setDragOverIndex(null)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-grab active:cursor-grabbing transition-fast ${
                      isDragOver
                        ? "border-primary bg-primary/5"
                        : "border-border bg-muted/30 hover:bg-muted/50"
                    }`}
                    data-ocid={`admin.question_form.order_item.${pos + 1}`}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {pos + 1}
                    </span>
                    <span className="text-sm text-foreground truncate min-w-0">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Text input answer */}
      {data.questionType === QuestionType.textInput && (
        <div className="space-y-2">
          <Label>Correct Answer</Label>
          <Input
            value={data.correctText}
            onChange={(e) => update({ correctText: e.target.value })}
            placeholder="Expected answer text"
            data-ocid="admin.question_form.correct_text.input"
          />
          <p className="text-xs text-muted-foreground">
            The student's answer will be compared (case-insensitive) to this
            text.
          </p>
        </div>
      )}

      <Separator />

      {/* Answer Explanation */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          Answer Explanation
          <span className="text-muted-foreground font-normal text-xs">
            (optional)
          </span>
        </Label>
        <p className="text-xs text-muted-foreground -mt-1">
          Shown to users after they answer this question
        </p>
        <div
          className="border-l-2 border-accent pl-3 rounded-sm"
          data-ocid="admin.question_form.explanation.editor"
        >
          <RichTextEditor
            value={data.explanation}
            onChange={(html) => update({ explanation: html })}
            placeholder="Explain the correct answer, add hints, or include a formula…"
            minHeight={120}
            id="admin.question_form.explanation.editor"
          />
        </div>
      </div>
    </div>
  );
}
