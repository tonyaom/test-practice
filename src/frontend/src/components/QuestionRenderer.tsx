import { RichTextDisplay } from "@/components/RichTextDisplay";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Question } from "../types";
import { QuestionType } from "../types";
import { DragDropQuestion } from "./DragDropQuestion";

interface QuestionRendererProps {
  question: Question;
  selectedOptions: number[];
  textAnswer: string;
  dragOrder: number[];
  onOptionToggle: (idx: number) => void;
  onTextChange: (val: string) => void;
  onDragOrderChange: (order: number[]) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export function QuestionRenderer({
  question,
  selectedOptions,
  textAnswer,
  dragOrder,
  onOptionToggle,
  onTextChange,
  onDragOrderChange,
  isBookmarked = false,
  onToggleBookmark,
}: QuestionRendererProps) {
  return (
    <div className="space-y-4">
      {/* Question text row with bookmark toggle */}
      <div className="flex items-start gap-2">
        <RichTextDisplay
          html={question.text}
          className="font-medium leading-relaxed mb-1 flex-1 min-w-0"
        />
        {onToggleBookmark && (
          <button
            type="button"
            onClick={onToggleBookmark}
            aria-label="Bookmark this question"
            aria-pressed={isBookmarked}
            data-ocid="question.bookmark_toggle"
            className={`bookmark-toggle shrink-0 mt-0.5${isBookmarked ? " bookmarked" : ""}`}
          >
            {isBookmarked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* MC Single */}
      {question.questionType === QuestionType.mcSingle && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          data-ocid="question.options_list"
        >
          {question.options.map((opt, idx) => {
            const isSelected = selectedOptions.includes(idx);
            const optId = `mc-single-${String(question.id)}-opt-${idx}`;
            return (
              <button
                key={optId}
                type="button"
                onClick={() => onOptionToggle(idx)}
                data-ocid={`question.option.${idx + 1}`}
                aria-pressed={isSelected}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-lg border text-left transition-all duration-150
                  ${
                    isSelected
                      ? "border-primary bg-primary/8 shadow-subtle"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                  }
                `}
              >
                <span
                  className={`
                    w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors
                    ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"}
                  `}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground block" />
                  )}
                </span>
                <RichTextDisplay
                  html={opt}
                  className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* MC Multi */}
      {question.questionType === QuestionType.mcMulti && (
        <div className="space-y-2.5" data-ocid="question.options_list">
          <p className="text-xs text-muted-foreground">
            Select all that apply.
          </p>
          {question.options.map((opt, idx) => {
            const isSelected = selectedOptions.includes(idx);
            const checkId = `mc-multi-${String(question.id)}-${idx}`;
            return (
              <label
                key={checkId}
                htmlFor={checkId}
                data-ocid={`question.option.${idx + 1}`}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all duration-150
                  ${
                    isSelected
                      ? "border-primary bg-primary/8"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                  }
                `}
              >
                <Checkbox
                  id={checkId}
                  checked={isSelected}
                  onCheckedChange={() => onOptionToggle(idx)}
                  data-ocid={`question.checkbox.${idx + 1}`}
                />
                <RichTextDisplay
                  html={opt}
                  className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}
                />
              </label>
            );
          })}
        </div>
      )}

      {/* Text Input */}
      {question.questionType === QuestionType.textInput && (
        <div className="space-y-2" data-ocid="question.text_input_section">
          <Label
            htmlFor="text-answer"
            className="text-sm font-medium text-foreground"
          >
            Your answer
          </Label>
          <Input
            id="text-answer"
            value={textAnswer}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Type your answer here…"
            data-ocid="question.text_input"
            className="bg-card border-input focus:border-primary transition-colors"
          />
        </div>
      )}

      {/* Drag & Drop */}
      {question.questionType === QuestionType.dragOrder && (
        <DragDropQuestion
          items={question.options}
          order={dragOrder}
          onChange={onDragOrderChange}
        />
      )}
    </div>
  );
}
