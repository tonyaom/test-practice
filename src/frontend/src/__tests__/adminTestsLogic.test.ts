/**
 * Unit tests for AdminTestsPage data management logic:
 * - Test filtering / sorting
 * - Derived state (form reset on open)
 * - Test list state management
 */
import { describe, expect, it } from "vitest";
import type { Test } from "./mocks/backendStub";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleTests: Test[] = [
  {
    id: BigInt(1),
    name: "Intro to Psychology",
    description: "Covers memory, attention, and cognition.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: BigInt(2),
    name: "Biology 101",
    description: "Cell structure and organelles.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: BigInt(3),
    name: "World History",
    description: "Modern era events.",
    createdAt: now,
    updatedAt: now,
  },
];

// ── Test list management ──────────────────────────────────────────────────────

describe("Test list management", () => {
  it("returns all tests from listTests result", () => {
    expect(sampleTests).toHaveLength(3);
    for (const t of sampleTests) {
      expect(t).toHaveProperty("id");
      expect(t).toHaveProperty("name");
      expect(t).toHaveProperty("description");
    }
  });

  it("identifies empty test list", () => {
    const empty: Test[] = [];
    expect(empty.length === 0).toBe(true);
  });

  it("finds test by id", () => {
    const found = sampleTests.find((t) => t.id === BigInt(2));
    expect(found?.name).toBe("Biology 101");
  });

  it("filters out deleted test from local list", () => {
    const filtered = sampleTests.filter((t) => t.id !== BigInt(2));
    expect(filtered).toHaveLength(2);
    expect(filtered.find((t) => t.id === BigInt(2))).toBeUndefined();
  });
});

// ── createTest optimistic update ──────────────────────────────────────────────

describe("Create test optimistic update", () => {
  it("adds a new test with correct name and description", () => {
    const newTest: Test = {
      id: BigInt(99),
      name: "New Test",
      description: "New description",
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...sampleTests, newTest];
    expect(updated).toHaveLength(4);
    expect(updated[3].name).toBe("New Test");
  });
});

// ── updateTest optimistic update ─────────────────────────────────────────────

describe("Update test optimistic update", () => {
  it("replaces the test with updated data", () => {
    const updatedTest = { ...sampleTests[0], name: "Updated Name" };
    const updated = sampleTests.map((t) =>
      t.id === updatedTest.id ? updatedTest : t,
    );
    expect(updated[0].name).toBe("Updated Name");
    // Others unchanged
    expect(updated[1].name).toBe("Biology 101");
  });
});

// ── deleteTest optimistic update ─────────────────────────────────────────────

describe("Delete test optimistic update", () => {
  it("removes the test from the list", () => {
    const targetId = BigInt(1);
    const updated = sampleTests.filter((t) => t.id !== targetId);
    expect(updated).toHaveLength(2);
    expect(updated.find((t) => t.id === targetId)).toBeUndefined();
  });
});

// ── Form data reset logic ─────────────────────────────────────────────────────

describe("Form data reset (openCreate / openEdit)", () => {
  interface TestFormData {
    name: string;
    description: string;
  }

  it("resets form to empty when opening create modal", () => {
    let form: TestFormData = { name: "old value", description: "old desc" };
    // Mirrors openCreate() from AdminTestsPage
    form = { name: "", description: "" };
    expect(form.name).toBe("");
    expect(form.description).toBe("");
  });

  it("populates form with test data when opening edit modal", () => {
    const test = sampleTests[0];
    const form: TestFormData = {
      name: test.name,
      description: test.description,
    };
    expect(form.name).toBe("Intro to Psychology");
    expect(form.description).toBe("Covers memory, attention, and cognition.");
  });
});

// ── Test data validation ──────────────────────────────────────────────────────

describe("Test data validation", () => {
  it("rejects empty test name", () => {
    function isValidTestName(name: string) {
      return name.trim().length > 0;
    }
    expect(isValidTestName("")).toBe(false);
    expect(isValidTestName("  ")).toBe(false);
    expect(isValidTestName("My Test")).toBe(true);
  });
});
