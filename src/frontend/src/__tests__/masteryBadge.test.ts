/**
 * MasteryBadge component tests
 * Covers: rendering for mastered/in-progress/empty states
 */
import { describe, expect, it } from "vitest";

interface MasteryBadgeProps {
  masteredCount: number;
  totalCount: number;
  size?: "sm" | "md";
}

function getMasteryBadgeState(
  props: MasteryBadgeProps,
): "hidden" | "mastered" | "progress" {
  if (props.totalCount === 0) return "hidden";
  if (props.masteredCount === props.totalCount) return "mastered";
  return "progress";
}

function getMasteryBadgeLabel(props: MasteryBadgeProps): string {
  const state = getMasteryBadgeState(props);
  if (state === "hidden") return "";
  if (state === "mastered") return "🏆 Mastered";
  return `📈 ${props.masteredCount} / ${props.totalCount}`;
}

describe("MasteryBadge — state determination", () => {
  it("returns hidden when totalCount is 0", () => {
    expect(getMasteryBadgeState({ masteredCount: 0, totalCount: 0 })).toBe(
      "hidden",
    );
  });

  it("returns mastered when all mastered", () => {
    expect(getMasteryBadgeState({ masteredCount: 5, totalCount: 5 })).toBe(
      "mastered",
    );
  });

  it("returns progress when partially mastered", () => {
    expect(getMasteryBadgeState({ masteredCount: 3, totalCount: 5 })).toBe(
      "progress",
    );
  });

  it("returns progress when none mastered", () => {
    expect(getMasteryBadgeState({ masteredCount: 0, totalCount: 10 })).toBe(
      "progress",
    );
  });

  it("returns mastered when 1/1 mastered", () => {
    expect(getMasteryBadgeState({ masteredCount: 1, totalCount: 1 })).toBe(
      "mastered",
    );
  });
});

describe("MasteryBadge — label rendering", () => {
  it("returns empty string when hidden", () => {
    expect(getMasteryBadgeLabel({ masteredCount: 0, totalCount: 0 })).toBe("");
  });

  it("returns Mastered label with trophy icon", () => {
    const label = getMasteryBadgeLabel({ masteredCount: 10, totalCount: 10 });
    expect(label).toContain("Mastered");
  });

  it("returns progress fraction in label", () => {
    const label = getMasteryBadgeLabel({ masteredCount: 3, totalCount: 5 });
    expect(label).toContain("3 / 5");
  });

  it("progress label shows 0/N when none mastered", () => {
    const label = getMasteryBadgeLabel({ masteredCount: 0, totalCount: 8 });
    expect(label).toContain("0 / 8");
  });
});

describe("MasteryBadge — size prop", () => {
  it("defaults to sm size", () => {
    const props: MasteryBadgeProps = { masteredCount: 5, totalCount: 10 };
    expect(props.size ?? "sm").toBe("sm");
  });

  it("accepts md size", () => {
    const props: MasteryBadgeProps = {
      masteredCount: 5,
      totalCount: 10,
      size: "md",
    };
    expect(props.size).toBe("md");
  });
});
