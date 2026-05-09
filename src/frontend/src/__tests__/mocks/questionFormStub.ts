/**
 * Test stub for QuestionForm data types and helpers.
 * Provides QuestionFormData and defaultQuestionFormData without importing
 * React components or UI libraries.
 */
import { QuestionType } from "./backendStub";

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
  /** Optional rich-text explanation shown after the user answers. */
  explanation: string;
}

export function defaultQuestionFormData(): QuestionFormData {
  return {
    text: "",
    questionType: QuestionType.mcSingle,
    options: ["", "", "", ""],
    correctAnswers: [0],
    correctText: "",
    correctOrder: [0, 1, 2, 3],
    imageFile: null,
    imagePreviewUrl: null,
    sectionId: null,
    explanation: "",
  };
}
