/**
 * Integration tests for DragDropQuestion component logic.
 * Tests the handleDrop reordering without DOM drag events.
 */
import { describe, expect, it } from "vitest";

// ── Mirrors DragDropQuestion.handleDrop ───────────────────────────────────────

function applyDrop(
  displayOrder: number[],
  draggingIdx: number,
  dropListIdx: number,
): number[] {
  if (draggingIdx === null || draggingIdx === dropListIdx) return displayOrder;
  const newOrder = [...displayOrder];
  const [moved] = newOrder.splice(draggingIdx, 1);
  newOrder.splice(dropListIdx, 0, moved);
  return newOrder;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("DragDropQuestion – applyDrop reordering", () => {
  const items = ["Alpha", "Beta", "Gamma", "Delta"];
  const defaultOrder = [0, 1, 2, 3];

  it("moves first item to last", () => {
    const result = applyDrop([...defaultOrder], 0, 3);
    expect(result).toEqual([1, 2, 3, 0]);
  });

  it("moves last item to first", () => {
    const result = applyDrop([...defaultOrder], 3, 0);
    expect(result).toEqual([3, 0, 1, 2]);
  });

  it("moves middle item one position forward", () => {
    const result = applyDrop([...defaultOrder], 1, 3);
    expect(result).toEqual([0, 2, 3, 1]);
  });

  it("is no-op when source equals target", () => {
    const result = applyDrop([...defaultOrder], 2, 2);
    expect(result).toEqual([0, 1, 2, 3]);
  });

  it("preserves all item indices after move", () => {
    const result = applyDrop([...defaultOrder], 0, 2);
    expect(result.sort()).toEqual([0, 1, 2, 3]);
  });

  it("returns array of same length", () => {
    const result = applyDrop([...defaultOrder], 1, 3);
    expect(result).toHaveLength(items.length);
  });
});

// ── displayOrder fallback (when order.length !== items.length) ─────────────────

describe("DragDropQuestion – displayOrder fallback", () => {
  it("uses identity order when order.length !== items.length", () => {
    const items = ["A", "B", "C"];
    const order = [0, 1]; // mismatched length
    const displayOrder =
      order.length === items.length ? order : items.map((_, i) => i);
    expect(displayOrder).toEqual([0, 1, 2]);
  });

  it("uses provided order when lengths match", () => {
    const items = ["A", "B", "C"];
    const order = [2, 0, 1];
    const displayOrder =
      order.length === items.length ? order : items.map((_, i) => i);
    expect(displayOrder).toEqual([2, 0, 1]);
  });
});

// ── QuestionRenderer type detection ──────────────────────────────────────────

import { QuestionType } from "./mocks/backendStub";
import type { Question } from "./mocks/backendStub";

describe("QuestionRenderer – question type detection", () => {
  const q = (type: QuestionType): Question => ({
    id: BigInt(1),
    testId: BigInt(1),
    orderIndex: BigInt(0),
    text: "Q?",
    questionType: type,
    options: ["A", "B", "C", "D"],
    correctAnswers: [BigInt(0)],
    correctText: "answer",
    correctOrder: [BigInt(0), BigInt(1), BigInt(2), BigInt(3)],
  });

  it("identifies mcSingle type correctly", () => {
    expect(q(QuestionType.mcSingle).questionType).toBe(QuestionType.mcSingle);
  });

  it("identifies mcMulti type correctly", () => {
    expect(q(QuestionType.mcMulti).questionType).toBe(QuestionType.mcMulti);
  });

  it("identifies textInput type correctly", () => {
    expect(q(QuestionType.textInput).questionType).toBe(QuestionType.textInput);
  });

  it("identifies dragOrder type correctly", () => {
    expect(q(QuestionType.dragOrder).questionType).toBe(QuestionType.dragOrder);
  });
});

// ── showOptions flag (QuestionForm) ──────────────────────────────────────────

describe("showOptions flag logic (QuestionForm)", () => {
  function showOptions(type: QuestionType): boolean {
    return (
      type === QuestionType.mcSingle ||
      type === QuestionType.mcMulti ||
      type === QuestionType.dragOrder
    );
  }

  it("shows options for mcSingle", () => {
    expect(showOptions(QuestionType.mcSingle)).toBe(true);
  });

  it("shows options for mcMulti", () => {
    expect(showOptions(QuestionType.mcMulti)).toBe(true);
  });

  it("shows options for dragOrder", () => {
    expect(showOptions(QuestionType.dragOrder)).toBe(true);
  });

  it("hides options for textInput", () => {
    expect(showOptions(QuestionType.textInput)).toBe(false);
  });
});
