import { c as createLucideIcon, G as useParams, aq as useSearch, H as useAuth, J as useBackend, r as reactExports, ah as useQuery, j as jsxRuntimeExports, T as Skeleton, a0 as BookOpen, O as Link, B as Button, W as Badge, aj as CircleCheck, _ as Card, $ as CardHeader, av as CardContent, Q as QuestionType, U as ArrowLeft, aw as LayoutDashboard } from "./index-CVHVWwCD.js";
import { R as RichTextDisplay } from "./RichTextDisplay-BX4daxAP.js";
import { g as getBookmarks, t as toggleBookmark } from "./bookmarkStorage-Dc7ejNei.js";
import { B as BookmarkCheck, a as Bookmark } from "./bookmark-D56mChNa.js";
import { C as ChevronDown } from "./chevron-down-CCbOFBaP.js";
import { C as CircleX } from "./circle-x-BztSZyG9.js";
import { A as ArrowRight } from "./arrow-right-NONeIZ2z.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode);
function ReviewModePage() {
  const { testId } = useParams({ from: "/tests/$testId/review" });
  const search = useSearch({ from: "/tests/$testId/review" });
  const sessionId = search.sessionId ?? "";
  const { session, isAdmin } = useAuth();
  const backend = useBackend();
  const username = (session == null ? void 0 : session.username) ?? "";
  const testIdBig = BigInt(testId);
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const [bookmarkIds, setBookmarkIds] = reactExports.useState(
    () => username ? getBookmarks(username, testId) : /* @__PURE__ */ new Set()
  );
  const [bookmarkOpen, setBookmarkOpen] = reactExports.useState(true);
  function handleRemoveBookmark(questionId) {
    if (!username) return;
    toggleBookmark(username, testId, Number(questionId));
    setBookmarkIds(getBookmarks(username, testId));
  }
  const { data: reviewData, isLoading } = useQuery({
    queryKey: ["testReview", testId, sessionId, username],
    queryFn: async () => {
      if (!backend || !username || !sessionId) return null;
      return backend.getTestReview(username, Number(testIdBig), sessionId);
    },
    enabled: !!backend && !!username && !!sessionId
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto px-4 py-12 space-y-4",
        "data-ocid": "review.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
        ]
      }
    );
  }
  if (!reviewData || reviewData.questions.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto px-4 py-12 text-center",
        "data-ocid": "review.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 mx-auto text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "No review data available." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tests/$testId/result", params: { testId }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              "data-ocid": "review.exit_button",
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                "Back to Results"
              ]
            }
          ) })
        ]
      }
    );
  }
  const questions = reviewData.questions;
  const total = questions.length;
  const safeIndex = Math.max(0, Math.min(currentIndex, total - 1));
  const current = questions[safeIndex];
  const hasPrev = safeIndex > 0;
  const hasNext = safeIndex < total - 1;
  const score = reviewData.totalScore;
  const correctCount = questions.filter((q) => q.isCorrect).length;
  const hasSections = reviewData.sectionScores.length > 0;
  const bookmarkedReviewQuestions = questions.filter(
    (rq) => bookmarkIds.has(String(rq.question.id))
  );
  function goTo(index) {
    setCurrentIndex(Math.max(0, Math.min(index, total - 1)));
  }
  function jumpToBookmarked(rq) {
    const idx = questions.findIndex(
      (q) => String(q.question.id) === String(rq.question.id)
    );
    if (idx !== -1) goTo(idx);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tests/$testId/result", params: { testId }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "gap-2",
            "data-ocid": "review.exit_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
              "Results"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-semibold text-foreground", children: "Review Answers" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-muted-foreground", children: [
          "Score:",
          " "
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: score >= 75 ? "text-accent border-accent/30 bg-accent/5" : score >= 60 ? "text-primary border-primary/30 bg-primary/5" : "text-destructive border-destructive/30 bg-destructive/5",
            "data-ocid": "review.score_badge",
            children: [
              score,
              "%"
            ]
          }
        )
      ] })
    ] }),
    bookmarkedReviewQuestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", "data-ocid": "review.bookmarks.panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setBookmarkOpen((v) => !v),
          className: "flex items-center justify-between w-full px-5 py-3.5 rounded-xl border border-border bg-card shadow-subtle hover:bg-muted/30 transition-colors",
          "aria-expanded": bookmarkOpen,
          "data-ocid": "review.bookmarks.toggle",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCheck, { className: "w-4 h-4 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground text-sm", children: "Bookmarked Questions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "question-count-badge", children: bookmarkedReviewQuestions.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChevronDown,
              {
                className: `w-4 h-4 text-muted-foreground transition-transform duration-200 ${bookmarkOpen ? "rotate-180" : ""}`
              }
            )
          ]
        }
      ),
      bookmarkOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-2", "data-ocid": "review.bookmarks.list", children: bookmarkedReviewQuestions.map((rq, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors",
          "data-ocid": `review.bookmarks.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => jumpToBookmarked(rq),
                className: "flex-1 text-left min-w-0",
                "data-ocid": `review.bookmarks.jump_button.${idx + 1}`,
                "aria-label": `Jump to bookmarked question ${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    rq.isCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 text-accent shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 text-destructive shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
                      "Q",
                      questions.indexOf(rq) + 1
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RichTextDisplay,
                    {
                      html: rq.question.text,
                      className: "text-sm text-foreground leading-snug line-clamp-2"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleRemoveBookmark(String(rq.question.id)),
                className: "bookmark-toggle bookmarked shrink-0",
                "aria-label": "Remove bookmark",
                "data-ocid": `review.bookmarks.remove_button.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-4 h-4", fill: "currentColor" })
              }
            )
          ]
        },
        String(rq.question.id)
      )) })
    ] }),
    hasSections && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", "data-ocid": "review.sections.panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-sm uppercase tracking-wide", children: "Section Scores" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: reviewData.sectionScores.map((sr, idx) => {
        const secPct = Number(sr.totalQuestions) > 0 ? Math.round(
          Number(sr.score) / Number(sr.totalQuestions) * 100
        ) : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-2.5 rounded-lg border border-border bg-card",
            "data-ocid": `review.section.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate min-w-0 mr-2", children: sr.sectionName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  Number(sr.score),
                  "/",
                  Number(sr.totalQuestions)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: secPct >= 75 ? "text-accent border-accent/30 bg-accent/5" : secPct >= 60 ? "text-primary border-primary/30 bg-primary/5" : "text-destructive border-destructive/30 bg-destructive/5",
                    children: [
                      secPct,
                      "%"
                    ]
                  }
                )
              ] })
            ]
          },
          String(sr.sectionId)
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 px-4 py-2.5 rounded-lg border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: correctCount }),
        " / ",
        total,
        " ",
        "correct"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "text-sm font-semibold text-foreground",
          "data-ocid": "review.question_counter",
          children: [
            safeIndex + 1,
            " / ",
            total
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-1.5 mb-5 flex-wrap", children: questions.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => goTo(i),
        className: `w-6 h-6 rounded-full text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-ring ${i === safeIndex ? "bg-primary text-primary-foreground scale-125" : q.isCorrect ? "bg-accent/20 text-accent hover:bg-accent/30" : "bg-destructive/20 text-destructive hover:bg-destructive/30"}`,
        "aria-label": `Go to question ${i + 1}`,
        "data-ocid": `review.dot.${i + 1}`,
        children: i + 1
      },
      String(q.question.id)
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "shadow-subtle overflow-hidden mb-6",
        "data-ocid": "review.question.card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CardHeader,
            {
              className: `pb-3 border-b border-border px-5 pt-4 ${current.isCorrect ? "bg-accent/5" : "bg-destructive/5"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                current.isCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-accent shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-5 h-5 text-destructive shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
                      "Question ",
                      safeIndex + 1,
                      " of ",
                      total
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: current.isCorrect ? "text-xs text-accent border-accent/30" : "text-xs text-destructive border-destructive/30",
                        "data-ocid": "review.question.correctness_badge",
                        children: current.isCorrect ? "Correct" : "Incorrect"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RichTextDisplay,
                    {
                      html: current.question.text,
                      className: "text-sm font-medium leading-relaxed"
                    }
                  )
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pt-4 pb-4 space-y-3", children: [
            (current.question.questionType === QuestionType.mcSingle || current.question.questionType === QuestionType.mcMulti) && current.question.options.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Answer options" }),
              current.question.options.map((opt, i) => {
                const isCorrectOpt = current.correctAnswer.split(", ").includes(opt);
                const isUserOpt = current.userAnswer.split(", ").includes(opt);
                let rowClass = "bg-muted/40 border-transparent text-muted-foreground";
                if (isCorrectOpt)
                  rowClass = "bg-accent/10 border-accent/30 text-accent font-medium";
                else if (isUserOpt && !isCorrectOpt)
                  rowClass = "bg-destructive/10 border-destructive/30 text-destructive";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm border transition-colors ${rowClass}`,
                    "data-ocid": `review.option.${i + 1}`,
                    children: [
                      isCorrectOpt ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 shrink-0" }) : isUserOpt ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 shrink-0 rounded-full border border-border flex items-center justify-center text-xs", children: i + 1 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RichTextDisplay, { html: opt, className: "flex-1 min-w-0" }),
                      isCorrectOpt && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto text-xs bg-accent/20 text-accent border-accent/30 shrink-0", children: "Correct" }),
                      isUserOpt && !isCorrectOpt && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto text-xs bg-destructive/20 text-destructive border-destructive/30 shrink-0", children: "Your answer" })
                    ]
                  },
                  `opt-${i}-${opt}`
                );
              })
            ] }),
            current.question.questionType !== QuestionType.mcSingle && current.question.questionType !== QuestionType.mcMulti && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-start gap-2.5 px-3 py-2.5 rounded-lg border ${current.isCorrect ? "bg-accent/10 border-accent/30" : "bg-destructive/10 border-destructive/30"}`,
                  "data-ocid": "review.your_answer",
                  children: [
                    current.isCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 shrink-0 text-accent mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 shrink-0 text-destructive mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `text-xs font-semibold uppercase tracking-wide block mb-0.5 ${current.isCorrect ? "text-accent" : "text-destructive"}`,
                          children: "Your answer"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RichTextDisplay,
                        {
                          html: current.userAnswer || "<em>No answer given</em>",
                          className: "text-sm font-medium"
                        }
                      )
                    ] })
                  ]
                }
              ),
              !current.isCorrect && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/30",
                  "data-ocid": "review.correct_answer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 shrink-0 text-accent mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-0.5", children: "Correct answer" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RichTextDisplay,
                        {
                          html: current.correctAnswer,
                          className: "text-sm font-medium text-accent"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            current.question.explanation && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "explanation-card",
                "data-ocid": "review.explanation_card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "explanation-label", children: "Explanation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "explanation-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RichTextDisplay, { html: current.question.explanation }) })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between gap-3",
        "data-ocid": "review.navigation",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => goTo(safeIndex - 1),
              disabled: !hasPrev,
              className: "gap-2 flex-1 sm:flex-none",
              "data-ocid": "review.prev_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                "Previous"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-muted-foreground", children: [
            safeIndex + 1,
            " / ",
            total
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => goTo(safeIndex + 1),
              disabled: !hasNext,
              className: "gap-2 flex-1 sm:flex-none",
              "data-ocid": "review.next_button",
              children: [
                "Next",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
              ]
            }
          )
        ]
      }
    ),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        className: "gap-2 text-muted-foreground",
        "data-ocid": "review.admin_dashboard_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-4 h-4" }),
          "Admin Dashboard"
        ]
      }
    ) }) })
  ] });
}
export {
  ReviewModePage
};
