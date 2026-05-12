import { G as useParams, ap as useNavigate, H as useAuth, J as useBackend, aq as useSearch, M as useDataSyncContext, aB as loadCompletedSessionSnapshot, ar as loadSession, ah as useQuery, r as reactExports, j as jsxRuntimeExports, T as Skeleton, O as Link, B as Button, aw as LayoutDashboard, aC as RotateCcw, aD as generateSessionId, _ as Card, $ as CardHeader, W as Badge, av as CardContent, aj as CircleCheck, a0 as BookOpen, Q as QuestionType, aE as ClipboardList } from "./index-CVHVWwCD.js";
import { P as Progress } from "./progress-DH3zRfsd.js";
import { R as RichTextDisplay } from "./RichTextDisplay-BX4daxAP.js";
import { g as getBookmarks, t as toggleBookmark } from "./bookmarkStorage-Dc7ejNei.js";
import { B as BookmarkCheck, a as Bookmark } from "./bookmark-D56mChNa.js";
import { C as ChevronDown } from "./chevron-down-CCbOFBaP.js";
import { C as CircleX } from "./circle-x-BztSZyG9.js";
import { T as Trophy } from "./trophy-CGKXgmIJ.js";
import { S as Star } from "./star-BHVzUVdz.js";
function TestResultPage() {
  const { testId } = useParams({ from: "/tests/$testId/result" });
  const navigate = useNavigate();
  const { session, isAdmin } = useAuth();
  const backend = useBackend();
  const username = (session == null ? void 0 : session.username) ?? "";
  const testIdBig = BigInt(testId);
  const searchParams = useSearch({ strict: false });
  const urlSessionId = (searchParams == null ? void 0 : searchParams.sessionId) ?? "";
  const { getTest: getCachedTest, getQuestions: getCachedQuestions } = useDataSyncContext();
  const completedSnapshot = urlSessionId ? loadCompletedSessionSnapshot(urlSessionId) : null;
  const originalSession = completedSnapshot ? null : urlSessionId ? loadSession(urlSessionId) : null;
  const replayQuestionIds = (completedSnapshot == null ? void 0 : completedSnapshot.questionIds) ?? (originalSession == null ? void 0 : originalSession.questionIds) ?? [];
  const sessionRandomizeQuestions = (completedSnapshot == null ? void 0 : completedSnapshot.randomizeQuestions) ?? (originalSession == null ? void 0 : originalSession.randomizeQuestions) ?? true;
  const sessionRandomizeAnswers = (completedSnapshot == null ? void 0 : completedSnapshot.randomizeAnswers) ?? (originalSession == null ? void 0 : originalSession.randomizeAnswers) ?? true;
  const sessionSelectedSectionIds = (completedSnapshot == null ? void 0 : completedSnapshot.selectedSectionIds) ?? (originalSession == null ? void 0 : originalSession.selectedSectionIds) ?? [];
  const { data: result, isLoading: resultLoading } = useQuery({
    queryKey: ["testResult", testId, username],
    queryFn: async () => {
      if (!backend) return null;
      return backend.getTestResult(username, testIdBig);
    },
    enabled: !!backend
  });
  const { data: questions = [] } = useQuery({
    queryKey: ["questions", testId],
    queryFn: async () => {
      const cachedQs = getCachedQuestions(testId);
      if (cachedQs.length > 0) {
        return cachedQs.map((q) => ({
          id: BigInt(q.id),
          testId: BigInt(q.testId),
          orderIndex: BigInt(q.orderIndex),
          text: q.text,
          questionType: q.questionType,
          options: q.options,
          correctAnswers: q.correctAnswers.map(BigInt),
          correctText: q.correctText,
          correctOrder: q.correctOrder.map(BigInt),
          sectionId: q.sectionId != null ? BigInt(q.sectionId) : void 0,
          questionUpdatedAt: BigInt(q.questionUpdatedAt),
          explanation: q.explanation ?? void 0
        })).sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex));
      }
      if (!backend) return [];
      const qs = await backend.listQuestionsForTest(testIdBig);
      return qs.sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex));
    },
    enabled: true
  });
  const { data: test } = useQuery({
    queryKey: ["test", testId],
    queryFn: async () => {
      const cached = getCachedTest(testId);
      if (cached) {
        return {
          id: BigInt(cached.id),
          name: cached.name,
          description: cached.description,
          updatedAt: BigInt(cached.updatedAt),
          createdAt: BigInt(0)
        };
      }
      if (!backend) return null;
      return backend.getTest(testIdBig);
    },
    enabled: true
  });
  const { data: masteryList = [] } = useQuery({
    queryKey: ["mastery", testId, username],
    queryFn: async () => {
      if (!backend || !username) return [];
      try {
        return await backend.getMasteryForTest(username, Number(testId));
      } catch {
        return [];
      }
    },
    enabled: !!backend && !!username
  });
  const masteryMap = new Map(masteryList.map((m) => [String(m.questionId), m]));
  const [bookmarkIds, setBookmarkIds] = reactExports.useState(
    () => username ? getBookmarks(username, testId) : /* @__PURE__ */ new Set()
  );
  const [bookmarkOpen, setBookmarkOpen] = reactExports.useState(true);
  const bookmarkedQuestions = questions.filter(
    (q) => bookmarkIds.has(String(q.id))
  );
  function handleRemoveBookmark(questionId) {
    if (!username) return;
    toggleBookmark(username, testId, Number(questionId));
    setBookmarkIds(getBookmarks(username, testId));
  }
  if (resultLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto px-4 py-12 space-y-4",
        "data-ocid": "result.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
        ]
      }
    );
  }
  if (!result) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto px-4 py-12 text-center",
        "data-ocid": "result.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Result not found." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tests", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", "data-ocid": "result.back_tests_button", children: "Back to Practice Tests" }) }),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { "data-ocid": "result.back_admin_button", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-4 h-4 mr-2" }),
              "Admin Dashboard"
            ] }) })
          ] })
        ]
      }
    );
  }
  const score = Number(result.score);
  const total = Number(result.totalQuestions);
  const percentage = total > 0 ? Math.round(score / total * 100) : 0;
  function getGrade() {
    if (percentage >= 90)
      return { label: "Excellent!", colorClass: "text-accent" };
    if (percentage >= 75)
      return { label: "Good job!", colorClass: "text-primary" };
    if (percentage >= 60)
      return {
        label: "Keep practicing",
        colorClass: "text-secondary-foreground"
      };
    return { label: "Needs improvement", colorClass: "text-destructive" };
  }
  const grade = getGrade();
  const qMap = new Map(questions.map((q) => [String(q.id), q]));
  const incorrectResults = result.questionResults.filter((qr) => !qr.isCorrect);
  const correctResults = result.questionResults.filter((qr) => qr.isCorrect);
  const sectionResultsList = Array.isArray(
    result == null ? void 0 : result.sectionResults
  ) ? result.sectionResults : [];
  const hasSectionResults = sectionResultsList.length > 0;
  const sectionMap = hasSectionResults ? new Map(
    sectionResultsList.map((sr) => [sr.sectionId, sr.sectionName])
  ) : /* @__PURE__ */ new Map();
  function renderCorrectAnswer(q, className = "text-sm font-medium text-accent") {
    if (q.questionType === QuestionType.textInput) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        RichTextDisplay,
        {
          html: q.correctText || "—",
          className
        }
      );
    }
    if (q.questionType === QuestionType.mcSingle || q.questionType === QuestionType.mcMulti) {
      const correctOpts = q.correctAnswers.map((idx) => q.options[Number(idx)]).filter(Boolean);
      if (correctOpts.length === 0)
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className, children: "—" });
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: correctOpts.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(RichTextDisplay, { html: opt, className }, opt)) });
    }
    if (q.questionType === QuestionType.dragOrder) {
      const orderedOpts = q.correctOrder.map((idx) => q.options[Number(idx)]).filter(Boolean);
      if (orderedOpts.length === 0)
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className, children: "—" });
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: orderedOpts.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1 text-xs bg-accent/15 text-accent px-2 py-0.5 rounded",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
              i + 1,
              "."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RichTextDisplay, { html: opt, className: "inline" })
          ]
        },
        opt
      )) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className, children: "—" });
  }
  function getSectionName(q) {
    const qSectionId = q.sectionId;
    if (qSectionId == null) {
      return hasSectionResults ? "Uncategorised" : null;
    }
    if (!hasSectionResults) return null;
    return sectionMap.get(qSectionId) ?? null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        className: "w-full gap-2",
        onClick: () => navigate({
          to: "/tests/$testId",
          params: { testId },
          search: replayQuestionIds.length > 0 ? {
            // Generate a fresh session ID so the replay is independent of the old session.
            sessionId: generateSessionId(),
            randomizeQuestions: String(sessionRandomizeQuestions),
            randomizeAnswers: String(sessionRandomizeAnswers),
            sections: (sessionSelectedSectionIds == null ? void 0 : sessionSelectedSectionIds.length) ? sessionSelectedSectionIds.join(",") : "",
            questionIds: replayQuestionIds.join(",")
          } : {
            randomizeQuestions: "true",
            randomizeAnswers: "true",
            sections: ""
          }
        }),
        "data-ocid": "result.try_again_top_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" }),
          "Try Again"
        ]
      }
    ) }),
    bookmarkedQuestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", "data-ocid": "result.bookmarks.panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setBookmarkOpen((v) => !v),
          className: "flex items-center justify-between w-full px-5 py-3.5 rounded-xl border border-border bg-card shadow-subtle hover:bg-muted/30 transition-colors",
          "aria-expanded": bookmarkOpen,
          "data-ocid": "result.bookmarks.toggle",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCheck, { className: "w-4 h-4 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground text-sm", children: "Bookmarked Questions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "question-count-badge", children: bookmarkedQuestions.length })
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
      bookmarkOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-3", "data-ocid": "result.bookmarks.list", children: bookmarkedQuestions.map((q, idx) => {
        const qSectionName = getSectionName(q);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "border-accent/20 shadow-subtle overflow-hidden",
            "data-ocid": `result.bookmarks.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border bg-accent/5 px-5 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCheck, { className: "w-4 h-4 text-accent shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
                      "Question ",
                      idx + 1
                    ] }),
                    qSectionName && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs text-muted-foreground border-border",
                        children: qSectionName
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RichTextDisplay,
                    {
                      html: q.text,
                      className: "text-sm font-medium leading-relaxed"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleRemoveBookmark(String(q.id)),
                    className: "bookmark-toggle bookmarked shrink-0",
                    "aria-label": "Remove bookmark",
                    "data-ocid": `result.bookmarks.remove_button.${idx + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-4 h-4", fill: "currentColor" })
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pt-3 pb-4 space-y-3", children: [
                (() => {
                  const qr = result.questionResults.find(
                    (r) => String(r.questionId) === String(q.id)
                  );
                  if (!qr) return null;
                  const correct = renderCorrectAnswer(q);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `flex items-start gap-2.5 px-3 py-2.5 rounded-lg border ${qr.isCorrect ? "bg-accent/10 border-accent/30" : "bg-destructive/10 border-destructive/30"}`,
                        children: [
                          qr.isCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 shrink-0 text-accent mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 shrink-0 text-destructive mt-0.5" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: `text-xs font-semibold uppercase tracking-wide block mb-0.5 ${qr.isCorrect ? "text-accent" : "text-destructive"}`,
                                children: "Your answer"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: qr.isCorrect ? correct : "Incorrect" })
                          ] })
                        ]
                      }
                    ),
                    !qr.isCorrect && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/30", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 shrink-0 text-accent mt-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-0.5", children: "Correct answer" }),
                        correct
                      ] })
                    ] })
                  ] });
                })(),
                q.explanation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "explanation-card", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "explanation-label", children: "Explanation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "explanation-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RichTextDisplay, { html: q.explanation }) })
                ] })
              ] })
            ]
          },
          String(q.id)
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "shadow-subtle mb-6 overflow-hidden",
        "data-ocid": "result.score.card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border-b border-border px-6 py-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-10 h-10 text-primary" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-1", children: "Test Complete!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: test == null ? void 0 : test.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6 pb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-5xl font-bold text-foreground mb-1", children: [
                percentage,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-semibold text-lg ${grade.colorClass}`, children: grade.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-1", children: [
                "You answered ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: score }),
                " ",
                "out of ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: total }),
                " ",
                "questions correctly"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: percentage, className: "h-3 rounded-full" })
          ] })
        ]
      }
    ),
    masteryList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", "data-ocid": "result.mastery.panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-sm uppercase tracking-wide", children: "Mastery Progress" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
        {
          label: "Mastered",
          count: masteryList.filter((m) => m.isMastered).length,
          colorClass: "text-accent",
          bg: "bg-accent/5 border-accent/20"
        },
        {
          label: "Streak 4",
          count: masteryList.filter(
            (m) => !m.isMastered && Number(m.correctStreak) === 4
          ).length,
          colorClass: "text-primary",
          bg: "bg-primary/5 border-primary/20"
        },
        {
          label: "In Progress",
          count: masteryList.filter(
            (m) => !m.isMastered && Number(m.correctStreak) > 0 && Number(m.correctStreak) < 4
          ).length,
          colorClass: "text-foreground",
          bg: "bg-muted/40 border-border"
        },
        {
          label: "Not Started",
          count: masteryList.filter((m) => Number(m.correctStreak) === 0).length,
          colorClass: "text-muted-foreground",
          bg: "bg-muted/20 border-border"
        }
      ].map(({ label, count, colorClass, bg }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex flex-col items-center px-3 py-3 rounded-lg border ${bg}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `font-display text-2xl font-bold ${colorClass}`,
                children: count
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground mt-0.5", children: label })
          ]
        },
        label
      )) }),
      correctResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Questions answered correctly this session contribute toward mastery (5 correct answers in a row to master)." })
    ] }),
    hasSectionResults && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", "data-ocid": "result.sections.panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-sm uppercase tracking-wide", children: "Section Scores" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: sectionResultsList.map((sr, idx) => {
        const secPct = Number(sr.totalQuestions) > 0 ? Math.round(
          Number(sr.score) / Number(sr.totalQuestions) * 100
        ) : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card",
            "data-ocid": `result.section.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate min-w-0 mr-2", children: sr.sectionName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                  Number(sr.score),
                  " / ",
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
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 mt-2 rounded-lg border border-border bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
            score,
            " / ",
            total
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: percentage >= 75 ? "text-accent border-accent/30 bg-accent/5" : percentage >= 60 ? "text-primary border-primary/30 bg-primary/5" : "text-destructive border-destructive/30 bg-destructive/5",
              children: [
                percentage,
                "%"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Question Breakdown" }),
        incorrectResults.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1.5 bg-accent/10 text-accent border-accent/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
          "All correct!"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "gap-1.5 text-destructive border-destructive/30",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
              incorrectResults.length,
              " incorrect"
            ]
          }
        )
      ] }),
      incorrectResults.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-10 rounded-xl border border-accent/20 bg-accent/5 text-center",
          "data-ocid": "result.breakdown_list.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-10 h-10 text-accent mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Perfect score \\u2014 no mistakes!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "You answered every question correctly." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "result.breakdown_list", children: incorrectResults.map((qr, idx) => {
        const q = qMap.get(String(qr.questionId));
        const isMultiCorrect = (q == null ? void 0 : q.questionType) === QuestionType.mcMulti || (q == null ? void 0 : q.questionType) === QuestionType.mcSingle;
        const correctIdxSet = new Set(
          (q == null ? void 0 : q.correctAnswers.map(Number)) ?? []
        );
        const sectionName = q ? getSectionName(q) : null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "border-destructive/20 shadow-subtle overflow-hidden",
            "data-ocid": `result.question.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border bg-destructive/5 px-5 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-5 h-5 text-destructive shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
                      "Question ",
                      idx + 1
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs text-destructive border-destructive/30",
                        children: "Incorrect"
                      }
                    ),
                    sectionName && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs text-muted-foreground border-border",
                        "data-ocid": `result.question.section_badge.${idx + 1}`,
                        children: sectionName
                      }
                    ),
                    q && (() => {
                      const m = masteryMap.get(String(q.id));
                      const streak = m ? Number(m.correctStreak) : 0;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Badge,
                        {
                          variant: "outline",
                          className: "text-xs text-muted-foreground border-border gap-1",
                          "data-ocid": `result.question.mastery_badge.${idx + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-2.5 h-2.5" }),
                            streak,
                            "/5"
                          ]
                        }
                      );
                    })()
                  ] }),
                  q ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RichTextDisplay,
                    {
                      html: q.text,
                      className: "text-sm font-medium leading-relaxed"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground leading-relaxed", children: "Question not found" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pt-4 pb-4 space-y-3", children: [
                q && isMultiCorrect && q.options.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Answer options" }),
                  q.options.map((opt, i) => {
                    const isCorrectOpt = correctIdxSet.has(i);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm border transition-colors ${isCorrectOpt ? "bg-accent/10 border-accent/30 text-accent font-medium" : "bg-muted/40 border-transparent text-muted-foreground"}`,
                        children: [
                          isCorrectOpt ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 shrink-0 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 shrink-0 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground", children: i + 1 }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            RichTextDisplay,
                            {
                              html: opt,
                              className: "flex-1 min-w-0 text-sm"
                            }
                          ),
                          isCorrectOpt && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto text-xs bg-accent/20 text-accent border-accent/30 shrink-0", children: "Correct" })
                        ]
                      },
                      `opt-${i}-${opt}`
                    );
                  })
                ] }),
                q && !isMultiCorrect && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 shrink-0 text-accent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-0.5", children: "Correct answer" }),
                    renderCorrectAnswer(q)
                  ] })
                ] }),
                (q == null ? void 0 : q.explanation) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "explanation-card", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "explanation-label", children: "Explanation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "explanation-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RichTextDisplay, { html: q.explanation }) })
                ] })
              ] })
            ]
          },
          String(qr.questionId)
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "flex-1 gap-2",
          onClick: () => navigate({
            to: "/tests/$testId/review",
            params: { testId },
            search: { sessionId: result.sessionId }
          }),
          "data-ocid": "result.review_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-4 h-4" }),
            "Review Answers"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tests", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "w-full gap-2",
          "data-ocid": "result.back_tests_button",
          children: "All Tests"
        }
      ) }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full gap-2", "data-ocid": "result.home_button", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-4 h-4" }),
        "Admin Dashboard"
      ] }) })
    ] })
  ] });
}
export {
  TestResultPage
};
