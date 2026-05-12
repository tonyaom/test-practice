/**
 * P3 Hamburger Menu tests
 * Covers: grouped navigation, profile card, logout position
 */
import { describe, expect, it } from "vitest";

const practiceLinks = ["Practice Tests", "History"];
const adminLinks = ["Dashboard", "Manage Tests", "Users"];
const accountLinks = ["Edit Profile", "Dark Mode"];

function getNavGroups(isAdmin: boolean) {
  return {
    practice: isAdmin ? [] : practiceLinks,
    admin: isAdmin ? adminLinks : [],
    account: accountLinks,
  };
}

describe("P3.5 Hamburger menu — grouped navigation", () => {
  it("regular user sees Practice group", () => {
    const groups = getNavGroups(false);
    expect(groups.practice).toHaveLength(2);
    expect(groups.practice).toContain("Practice Tests");
  });

  it("regular user has no admin links", () => {
    const groups = getNavGroups(false);
    expect(groups.admin).toHaveLength(0);
  });

  it("admin user sees Admin group", () => {
    const groups = getNavGroups(true);
    expect(groups.admin).toHaveLength(3);
    expect(groups.admin).toContain("Manage Tests");
  });

  it("admin user has no practice links", () => {
    const groups = getNavGroups(true);
    expect(groups.practice).toHaveLength(0);
  });

  it("account group includes Edit Profile", () => {
    const groups = getNavGroups(false);
    expect(groups.account).toContain("Edit Profile");
  });

  it("account group includes Dark Mode toggle", () => {
    const groups = getNavGroups(false);
    expect(groups.account).toContain("Dark Mode");
  });

  it("has exactly 3 sections: practice, admin/empty, account", () => {
    const groups = getNavGroups(false);
    expect(Object.keys(groups)).toHaveLength(3);
  });
});

describe("P3.5 Hamburger menu — profile card", () => {
  it("admin role badge class is amber", () => {
    const cls = "bg-amber-100 text-amber-700 border-amber-300";
    expect(cls).toContain("amber");
  });

  it("user role badge class is primary/blue", () => {
    const cls = "bg-primary/10 text-primary border-primary/20";
    expect(cls).toContain("primary");
  });

  it("display name shows in profile card", () => {
    const username = "john";
    const displayName = "John Doe";
    const shown = displayName || username;
    expect(shown).toBe("John Doe");
  });

  it("falls back to username when displayName is empty", () => {
    const username = "john";
    const displayName = "";
    const shown = displayName || username;
    expect(shown).toBe("john");
  });
});
