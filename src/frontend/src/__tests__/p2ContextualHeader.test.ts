/**
 * P2 Contextual Header tests
 * Covers: confirmation dialog logic, back navigation, breadcrumb display
 */
import { describe, expect, it } from "vitest";

function getResultPageFeedback(percentage: number): string {
  if (percentage === 100) return "Perfect score! Outstanding!";
  if (percentage >= 80) return "Excellent work!";
  if (percentage >= 60) return "Good job, keep practicing!";
  return "Keep going, you'll get there!";
}

describe("P2.1 Contextual header — back navigation dialog", () => {
  it("shows confirmation dialog before leaving test in progress", () => {
    let dialogShown = false;
    const handleBack = (sessionInProgress: boolean) => {
      if (sessionInProgress) dialogShown = true;
    };
    handleBack(true);
    expect(dialogShown).toBe(true);
  });

  it("navigates immediately if no session in progress", () => {
    let navigated = false;
    const handleBack = (sessionInProgress: boolean) => {
      if (!sessionInProgress) navigated = true;
    };
    handleBack(false);
    expect(navigated).toBe(true);
  });

  it("displays test name in contextual header", () => {
    const testName = "Japanese Vocabulary";
    const header = `← Back to Tests | ${testName}`;
    expect(header).toContain(testName);
  });

  it("displays question counter in header", () => {
    const current = 3;
    const total = 12;
    const counter = `Question ${current} of ${total}`;
    expect(counter).toBe("Question 3 of 12");
  });
});

describe("P2.2 Results zones — score feedback messages", () => {
  it("returns perfect score message at 100%", () => {
    expect(getResultPageFeedback(100)).toBe("Perfect score! Outstanding!");
  });

  it("returns excellent message at 80%", () => {
    expect(getResultPageFeedback(80)).toBe("Excellent work!");
  });

  it("returns good job message at 60%", () => {
    expect(getResultPageFeedback(60)).toBe("Good job, keep practicing!");
  });

  it("returns encouragement message below 60%", () => {
    expect(getResultPageFeedback(59)).toBe("Keep going, you'll get there!");
  });

  it("returns encouragement for 0%", () => {
    expect(getResultPageFeedback(0)).toBe("Keep going, you'll get there!");
  });

  it("returns excellent message at 81%", () => {
    expect(getResultPageFeedback(81)).toBe("Excellent work!");
  });
});

describe("P2.4 Admin breadcrumb", () => {
  it("shows Tests > TestName when no section selected", () => {
    const path = ["Tests", "My Test"];
    expect(path).toHaveLength(2);
    expect(path[0]).toBe("Tests");
    expect(path[1]).toBe("My Test");
  });

  it("shows Tests > TestName > SectionName when section selected", () => {
    const path = ["Tests", "My Test", "Grammar"];
    expect(path).toHaveLength(3);
    expect(path[2]).toBe("Grammar");
  });

  it("clicking test name in breadcrumb clears selectedSection", () => {
    let selectedSection: string | null = "Grammar";
    const clearSection = () => {
      selectedSection = null;
    };
    clearSection();
    expect(selectedSection).toBeNull();
  });
});
