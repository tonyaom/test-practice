import { c as createLucideIcon, N as useBackend, M as useAuth, T as useQuery, j as jsxRuntimeExports, at as ClipboardList, Y as Skeleton, V as Link, B as Button, _ as Badge } from "./index-DeYOekLN.js";
import { f as formatElapsed } from "./timerStorage-BL4fhgre.js";
import { T as Trophy } from "./trophy-CF2HsZxS.js";
import { S as Star } from "./star-CjqSweGP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "m9 14 2 2 4-4", key: "df797q" }]
];
const ClipboardCheck = createLucideIcon("clipboard-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode);
function getLifetimeSeconds() {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key == null ? void 0 : key.startsWith("timer:")) {
        const val = Number(localStorage.getItem(key));
        if (Number.isFinite(val) && val > 0) total += val;
      }
    }
    return total;
  } catch {
    return 0;
  }
}
function TestHistoryPage() {
  const backend = useBackend();
  const { session } = useAuth();
  const username = (session == null ? void 0 : session.username) ?? "";
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["test-history", username],
    queryFn: async () => {
      if (!backend || !username) return [];
      try {
        const raw = await backend.listMyTestResults(username);
        return raw;
      } catch {
        return [];
      }
    },
    enabled: !!backend && !!username
  });
  const lifetimeSeconds = getLifetimeSeconds();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
      "data-ocid": "history.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "w-6 h-6 text-primary" }),
            "Test History"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Your completed tests and scores" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Tests Completed" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl font-bold text-foreground", children: results.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Best Score" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-2xl font-bold text-foreground", children: [
              Math.max(
                ...results.map(
                  (r) => Number(r.totalQuestions) > 0 ? Math.round(
                    Number(r.score) / Number(r.totalQuestions) * 100
                  ) : 0
                )
              ),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl border border-border bg-card px-4 py-3 col-span-2 sm:col-span-1",
              "data-ocid": "history.lifetime_time",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Total Time (this device)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl font-bold text-foreground", children: lifetimeSeconds > 0 ? formatElapsed(lifetimeSeconds) : "—" })
              ]
            }
          )
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "history.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-border bg-card p-4 flex items-center gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/3" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 rounded-full" })
            ]
          },
          i
        )) }) : results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-24 text-center",
            "data-ocid": "history.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-8 h-8 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-lg text-foreground mb-2", children: "No completed tests yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm mb-6", children: "Complete a test to see your results here. Your scores and progress are tracked automatically." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tests", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "gap-2", "data-ocid": "history.go_practice_button", children: "Start Practicing" }) })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "history.results.list", children: results.map((result, idx) => {
          const score = Number(result.score);
          const total = Number(result.totalQuestions);
          const pct = total > 0 ? Math.round(score / total * 100) : 0;
          const passed = pct >= 70;
          const isPerfect = pct === 100;
          const hasSections = Array.isArray(result.sectionResults) && result.sectionResults.length > 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `rounded-xl border bg-card px-4 py-3 hover:shadow-subtle transition-all duration-200 ${isPerfect ? "border-accent/30" : passed ? "border-border" : "border-border"}`,
              "data-ocid": `history.results.item.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isPerfect ? "bg-accent/15 text-accent" : passed ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`,
                    children: isPerfect ? /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-5 h-5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: result.testId ? `Test #${String(result.testId)}` : "Unknown Test" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: new Date(
                    Number(result.completedAt) / 1e6
                  ).toLocaleDateString(void 0, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }) }),
                  hasSections && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mt-1.5", children: result.sectionResults.map((sr) => {
                    const secPct = Number(sr.totalQuestions) > 0 ? Math.round(
                      Number(sr.score) / Number(sr.totalQuestions) * 100
                    ) : 0;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs px-1.5 py-0",
                        children: [
                          sr.sectionName,
                          ": ",
                          secPct,
                          "%"
                        ]
                      },
                      String(sr.sectionId)
                    );
                  }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `font-mono text-sm font-bold tabular-nums ${isPerfect ? "text-accent" : passed ? "text-primary" : "text-muted-foreground"}`,
                      "data-ocid": `history.results.score.${idx + 1}`,
                      children: [
                        score,
                        "/",
                        total
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `text-xs font-bold px-2 py-0.5 rounded-full ${isPerfect ? "bg-accent/15 text-accent" : passed ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`,
                      children: [
                        pct,
                        "%"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/tests/$testId/result",
                      params: { testId: String(result.testId) },
                      search: { sessionId: result.sessionId },
                      "data-ocid": `history.results.view_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", children: "Review" })
                    }
                  )
                ] })
              ] })
            },
            result.sessionId
          );
        }) })
      ]
    }
  );
}
export {
  TestHistoryPage
};
