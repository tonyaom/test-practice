import { AlignLeft, CheckSquare, Circle, GripVertical } from "lucide-react";
import { QuestionType } from "../backend";

interface QuestionTypeIconProps {
  type: QuestionType;
  className?: string;
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.mcSingle]: "Multiple Choice – Single",
  [QuestionType.mcMulti]: "Multiple Choice – Multi",
  [QuestionType.textInput]: "Text Input",
  [QuestionType.dragOrder]: "Drag & Order",
};

export const QUESTION_TYPE_SHORT: Record<QuestionType, string> = {
  [QuestionType.mcSingle]: "MC Single",
  [QuestionType.mcMulti]: "MC Multi",
  [QuestionType.textInput]: "Text Input",
  [QuestionType.dragOrder]: "Drag Order",
};

export function QuestionTypeIcon({ type, className }: QuestionTypeIconProps) {
  const cls = className ?? "w-3.5 h-3.5";
  switch (type) {
    case QuestionType.mcSingle:
      return <Circle className={cls} />;
    case QuestionType.mcMulti:
      return <CheckSquare className={cls} />;
    case QuestionType.textInput:
      return <AlignLeft className={cls} />;
    case QuestionType.dragOrder:
      return <GripVertical className={cls} />;
    default:
      return <Circle className={cls} />;
  }
}
