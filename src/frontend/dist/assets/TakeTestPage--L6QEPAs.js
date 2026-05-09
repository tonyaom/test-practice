import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, Q as QuestionType, ab as Checkbox, L as Label, I as Input, K as useParams, ac as useNavigate, M as useAuth, N as useBackend, ad as useSearch, T as useQuery, ae as loadSession, af as saveSession, ag as loadStoredAnswers, ah as saveStoredAnswers, U as useMutation, Y as Skeleton, a1 as Card, a2 as CardHeader, ai as CardContent, aj as LayoutDashboard, V as Link, B as Button, ak as getTestCache, W as ArrowLeft, G as CircleCheck, _ as Badge, w as Dialog, x as DialogContent, y as DialogHeader, z as DialogTitle, al as DialogDescription, J as DialogFooter, Z as Layers, a6 as ue, am as saveCompletedSessionSnapshot, an as removeSession, ao as isCacheValid, ap as saveTestCache } from "./index-DeYOekLN.js";
import { R as RichTextDisplay } from "./RichTextDisplay-B_N3KOLW.js";
import { G as GripVertical, g as getFontSize, F as FONT_SIZE_MAX, a as FONT_SIZE_MIN, s as setFontSize, A as AlignLeft, S as SquareCheckBig } from "./fontSizeStorage-BZdAnR9_.js";
import { g as getBookmarks, t as toggleBookmark } from "./bookmarkStorage-Dc7ejNei.js";
import { g as getElapsedSeconds, s as setElapsedSeconds, f as formatElapsed, c as clearElapsedSeconds } from "./timerStorage-BL4fhgre.js";
import { C as CircleX } from "./circle-x-DExGOtPe.js";
import { A as ArrowRight } from "./arrow-right-B82RM01A.js";
import { C as Circle } from "./circle-BDdQekIi.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
];
const Volume2 = createLucideIcon("volume-2", __iconNode);
function DragDropQuestion({
  items,
  order,
  onChange
}) {
  const [draggingIdx, setDraggingIdx] = reactExports.useState(null);
  const [overIdx, setOverIdx] = reactExports.useState(null);
  const dragNodeRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (order.length !== items.length) {
      onChange(items.map((_, i) => i));
    }
  }, [items, order.length, onChange]);
  const displayOrder = order.length === items.length ? order : items.map((_, i) => i);
  function handleDragStart(e, listIdx) {
    setDraggingIdx(listIdx);
    e.dataTransfer.effectAllowed = "move";
    dragNodeRef.current = e.currentTarget;
  }
  function handleDragOver(e, listIdx) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIdx(listIdx);
  }
  function handleDrop(e, dropListIdx) {
    e.preventDefault();
    if (draggingIdx === null || draggingIdx === dropListIdx) return;
    const newOrder = [...displayOrder];
    const [moved] = newOrder.splice(draggingIdx, 1);
    newOrder.splice(dropListIdx, 0, moved);
    onChange(newOrder);
    setDraggingIdx(null);
    setOverIdx(null);
  }
  function handleDragEnd() {
    setDraggingIdx(null);
    setOverIdx(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "drag_drop.list", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Drag items to arrange them in the correct order." }),
    displayOrder.map((itemIdx, listIdx) => {
      const isDragging = draggingIdx === listIdx;
      const isOver = overIdx === listIdx && draggingIdx !== listIdx;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          draggable: true,
          onDragStart: (e) => handleDragStart(e, listIdx),
          onDragOver: (e) => handleDragOver(e, listIdx),
          onDrop: (e) => handleDrop(e, listIdx),
          onDragEnd: handleDragEnd,
          "data-ocid": `drag_drop.item.${listIdx + 1}`,
          className: `
              flex items-center gap-3 px-4 py-3 rounded-lg border cursor-grab active:cursor-grabbing
              bg-card select-none transition-all duration-150
              ${isDragging ? "opacity-40 scale-95 border-primary/40" : ""}
              ${isOver ? "border-accent bg-accent/5 shadow-md -translate-y-0.5" : "border-border hover:border-primary/30 hover:shadow-subtle"}
            `,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0", children: listIdx + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RichTextDisplay, { html: items[itemIdx] }) })
          ]
        },
        `drag-item-${itemIdx}`
      );
    })
  ] });
}
function QuestionRenderer({
  question,
  selectedOptions,
  textAnswer,
  dragOrder,
  onOptionToggle,
  onTextChange,
  onDragOrderChange,
  isBookmarked = false,
  onToggleBookmark
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        RichTextDisplay,
        {
          html: question.text,
          className: "font-medium leading-relaxed mb-1 flex-1 min-w-0"
        }
      ),
      onToggleBookmark && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onToggleBookmark,
          "aria-label": "Bookmark this question",
          "aria-pressed": isBookmarked,
          "data-ocid": "question.bookmark_toggle",
          className: `bookmark-toggle shrink-0 mt-0.5${isBookmarked ? " bookmarked" : ""}`,
          children: isBookmarked ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z" })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z" })
            }
          )
        }
      )
    ] }),
    question.questionType === QuestionType.mcSingle && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
        "data-ocid": "question.options_list",
        children: question.options.map((opt, idx) => {
          const isSelected = selectedOptions.includes(idx);
          const optId = `mc-single-${String(question.id)}-opt-${idx}`;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onOptionToggle(idx),
              "data-ocid": `question.option.${idx + 1}`,
              "aria-pressed": isSelected,
              className: `
                  flex items-center gap-3 px-4 py-3.5 rounded-lg border text-left transition-all duration-150
                  ${isSelected ? "border-primary bg-primary/8 shadow-subtle" : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"}
                `,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `
                    w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors
                    ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"}
                  `,
                    children: isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary-foreground block" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RichTextDisplay,
                  {
                    html: opt,
                    className: `font-medium ${isSelected ? "text-primary" : "text-foreground"}`
                  }
                )
              ]
            },
            optId
          );
        })
      }
    ),
    question.questionType === QuestionType.mcMulti && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", "data-ocid": "question.options_list", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Select all that apply." }),
      question.options.map((opt, idx) => {
        const isSelected = selectedOptions.includes(idx);
        const checkId = `mc-multi-${String(question.id)}-${idx}`;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: checkId,
            "data-ocid": `question.option.${idx + 1}`,
            className: `
                  flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all duration-150
                  ${isSelected ? "border-primary bg-primary/8" : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"}
                `,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  id: checkId,
                  checked: isSelected,
                  onCheckedChange: () => onOptionToggle(idx),
                  "data-ocid": `question.checkbox.${idx + 1}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                RichTextDisplay,
                {
                  html: opt,
                  className: `font-medium ${isSelected ? "text-primary" : "text-foreground"}`
                }
              )
            ]
          },
          checkId
        );
      })
    ] }),
    question.questionType === QuestionType.textInput && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "question.text_input_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Label,
        {
          htmlFor: "text-answer",
          className: "text-sm font-medium text-foreground",
          children: "Your answer"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "text-answer",
          value: textAnswer,
          onChange: (e) => onTextChange(e.target.value),
          placeholder: "Type your answer here…",
          "data-ocid": "question.text_input",
          className: "bg-card border-input focus:border-primary transition-colors"
        }
      )
    ] }),
    question.questionType === QuestionType.dragOrder && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DragDropQuestion,
      {
        items: question.options,
        order: dragOrder,
        onChange: onDragOrderChange
      }
    )
  ] });
}
function SectionProgressBar({
  sectionName,
  answered,
  total,
  className = ""
}) {
  const pct = total > 0 ? Math.min(100, Math.round(answered / total * 100)) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-1 ${className}`, "data-ocid": "test.section_progress", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground truncate max-w-[60%]", children: sectionName }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "question-count-badge",
            style: {
              height: "1.25rem",
              minWidth: "1.25rem",
              fontSize: "0.625rem",
              padding: "0 0.375rem"
            },
            title: `${total} question${total !== 1 ? "s" : ""} in section`,
            "data-ocid": "test.section_progress.question_count",
            children: [
              total,
              " Q"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono tabular-nums text-muted-foreground", children: [
          answered,
          "/",
          total
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "section-progress-bar",
        role: "progressbar",
        tabIndex: 0,
        "aria-valuenow": answered,
        "aria-valuemin": 0,
        "aria-valuemax": total,
        "aria-label": `${sectionName}: ${answered} of ${total} answered`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "section-progress-bar-fill h-full",
            style: { width: `${pct}%` }
          }
        )
      }
    )
  ] });
}
const QUESTION_TYPE_ICONS = {
  [QuestionType.mcSingle]: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "w-3.5 h-3.5" }),
  [QuestionType.mcMulti]: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-3.5 h-3.5" }),
  [QuestionType.textInput]: /* @__PURE__ */ jsxRuntimeExports.jsx(AlignLeft, { className: "w-3.5 h-3.5" }),
  [QuestionType.dragOrder]: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-3.5 h-3.5" })
};
const QUESTION_TYPE_LABELS = {
  [QuestionType.mcSingle]: "Single Choice",
  [QuestionType.mcMulti]: "Multiple Choice",
  [QuestionType.textInput]: "Short Answer",
  [QuestionType.dragOrder]: "Ordering"
};
function emptyAnswer(q) {
  return {
    selectedOptions: [],
    textAnswer: "",
    dragOrder: q.options.map((_, i) => i)
  };
}
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function isAnswerCorrect(q, a, optMap) {
  const originalSelected = optMap ? a.selectedOptions.map((di) => optMap[di]) : a.selectedOptions;
  if (q.questionType === QuestionType.mcSingle || q.questionType === QuestionType.mcMulti) {
    const correct = q.correctAnswers.map(Number).sort();
    const given = [...originalSelected].map(Number).sort();
    return correct.length === given.length && correct.every((v, i) => v === given[i]);
  }
  if (q.questionType === QuestionType.textInput) {
    return a.textAnswer.trim().toLowerCase() === q.correctText.trim().toLowerCase();
  }
  if (q.questionType === QuestionType.dragOrder) {
    const correct = q.correctOrder.map(Number);
    const given = a.dragOrder.map(Number);
    return correct.length === given.length && correct.every((v, i) => v === given[i]);
  }
  return false;
}
function TakeTestPage() {
  const { testId } = useParams({ from: "/tests/$testId" });
  const navigate = useNavigate();
  const { session } = useAuth();
  const backend = useBackend();
  const username = (session == null ? void 0 : session.username) ?? "";
  const testIdBig = BigInt(testId);
  const searchParams = useSearch({ strict: false });
  const shouldRandomizeAnswers = (searchParams == null ? void 0 : searchParams.randomizeAnswers) === "true";
  const shouldRandomizeQuestions = (searchParams == null ? void 0 : searchParams.randomizeQuestions) === "true";
  const urlSessionId = (searchParams == null ? void 0 : searchParams.sessionId) ?? "";
  const urlSections = (searchParams == null ? void 0 : searchParams.sections) ?? "";
  const selectedSectionIds = urlSections ? urlSections.split(",").map(Number).filter(Boolean) : [];
  const urlQuestionIds = (searchParams == null ? void 0 : searchParams.questionIds) ?? "";
  const replayQuestionIds = urlQuestionIds ? urlQuestionIds.split(",").filter(Boolean) : [];
  const initialRandomizeQuestions = reactExports.useRef(shouldRandomizeQuestions);
  const initialRandomizeAnswers = reactExports.useRef(shouldRandomizeAnswers);
  const sessionIdRef = reactExports.useRef(
    urlSessionId || Math.random().toString(36).slice(2) + Date.now().toString(36)
  );
  const { data: rawQuestions = [], isLoading } = useQuery({
    queryKey: ["questions", testId],
    queryFn: async () => {
      if (!backend) return [];
      const cached = getTestCache(testId);
      if (cached) {
        try {
          const serverTest = await backend.getTest(testIdBig);
          if (serverTest && isCacheValid(cached.updatedAt, String(serverTest.updatedAt))) {
            return cached.questions.map((q2) => ({
              id: BigInt(q2.id),
              testId: BigInt(q2.testId),
              orderIndex: BigInt(q2.orderIndex),
              text: q2.text,
              questionType: q2.questionType,
              options: q2.options,
              correctAnswers: q2.correctAnswers.map(BigInt),
              correctText: q2.correctText,
              correctOrder: q2.correctOrder.map(BigInt),
              sectionId: q2.sectionId != null ? BigInt(q2.sectionId) : void 0,
              questionUpdatedAt: BigInt(q2.questionUpdatedAt),
              explanation: q2.explanation ?? void 0
            }));
          }
          if (serverTest) {
            const [qs2, sects] = await Promise.all([
              backend.listQuestionsForTest(testIdBig),
              backend.listSectionsForTest(testIdBig)
            ]);
            saveTestCache(
              testId,
              {
                test: {
                  id: testId,
                  name: serverTest.name,
                  description: serverTest.description,
                  updatedAt: String(serverTest.updatedAt)
                },
                questions: qs2.map((q2) => ({
                  id: String(q2.id),
                  testId: String(q2.testId),
                  orderIndex: String(q2.orderIndex),
                  text: q2.text,
                  questionType: q2.questionType,
                  options: q2.options,
                  correctAnswers: q2.correctAnswers.map(String),
                  correctText: q2.correctText,
                  correctOrder: q2.correctOrder.map(String),
                  sectionId: q2.sectionId != null ? String(q2.sectionId) : void 0,
                  questionUpdatedAt: String(q2.questionUpdatedAt),
                  explanation: q2.explanation ?? void 0
                })),
                sections: sects.map((s) => ({
                  id: String(s.id),
                  testId: String(s.testId),
                  name: s.name,
                  description: s.description,
                  updatedAt: String(s.updatedAt)
                })),
                updatedAt: String(serverTest.updatedAt)
              },
              String(serverTest.updatedAt)
            );
            return qs2.sort(
              (a, b) => Number(a.orderIndex) - Number(b.orderIndex)
            );
          }
        } catch {
          return cached.questions.map((q2) => ({
            id: BigInt(q2.id),
            testId: BigInt(q2.testId),
            orderIndex: BigInt(q2.orderIndex),
            text: q2.text,
            questionType: q2.questionType,
            options: q2.options,
            correctAnswers: q2.correctAnswers.map(BigInt),
            correctText: q2.correctText,
            correctOrder: q2.correctOrder.map(BigInt),
            sectionId: q2.sectionId != null ? BigInt(q2.sectionId) : void 0,
            questionUpdatedAt: BigInt(q2.questionUpdatedAt),
            explanation: q2.explanation ?? void 0
          }));
        }
      }
      const qs = await backend.listQuestionsForTest(testIdBig);
      return qs.sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex));
    },
    enabled: !!backend
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
  const UNCATEGORISED_SECTION_ID = -1;
  const sectionFiltered = rawQuestions.filter((q2) => {
    if (selectedSectionIds.length === 0) return true;
    const sid = q2.sectionId != null ? Number(q2.sectionId) : void 0;
    if (sid === void 0) {
      return selectedSectionIds.includes(UNCATEGORISED_SECTION_ID);
    }
    return selectedSectionIds.includes(sid);
  });
  const isReplay = replayQuestionIds.length > 0;
  const allMastered = !isReplay && sectionFiltered.length > 0 && sectionFiltered.every((q2) => {
    var _a;
    return (_a = masteryMap.get(String(q2.id))) == null ? void 0 : _a.isMastered;
  });
  const filteredQuestions = isReplay ? rawQuestions.filter((q2) => replayQuestionIds.includes(String(q2.id))) : sectionFiltered.filter((q2) => {
    if (allMastered) return true;
    const mastery = masteryMap.get(String(q2.id));
    return !(mastery == null ? void 0 : mastery.isMastered);
  });
  const { data: testInfo } = useQuery({
    queryKey: ["test", testId],
    queryFn: async () => {
      if (!backend) return null;
      return backend.getTest(testIdBig);
    },
    enabled: !!backend
  });
  const [questions, setQuestions] = reactExports.useState([]);
  const [currentIdx, setCurrentIdx] = reactExports.useState(0);
  const [answers, setAnswers] = reactExports.useState({});
  const [checkedIds, setCheckedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [endTestDialogOpen, setEndTestDialogOpen] = reactExports.useState(false);
  const restoredRef = reactExports.useRef(false);
  const autoAdvanceTimerRef = reactExports.useRef(
    null
  );
  const audioRef = reactExports.useRef(null);
  const [fontSize, setFontSizeState] = reactExports.useState(() => getFontSize());
  const [elapsedSeconds, setElapsedSeconds$1] = reactExports.useState(0);
  const timerInitialisedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (timerInitialisedRef.current) return;
    timerInitialisedRef.current = true;
    const saved = getElapsedSeconds(sessionIdRef.current);
    setElapsedSeconds$1(saved);
  }, []);
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      setElapsedSeconds$1((prev) => {
        const next = prev + 1;
        setElapsedSeconds(sessionIdRef.current, next);
        return next;
      });
    }, 1e3);
    return () => clearInterval(id);
  }, []);
  const [bookmarkedIds, setBookmarkedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    if (!username || !testId) return;
    setBookmarkedIds(getBookmarks(username, testId));
  }, [username, testId]);
  function handleToggleBookmark(questionId) {
    if (!username) return;
    const newState = toggleBookmark(
      username,
      testId,
      Number(questionId)
    );
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (newState) next.add(questionId);
      else next.delete(questionId);
      return next;
    });
  }
  reactExports.useEffect(() => {
    if (filteredQuestions.length === 0 || questions.length > 0) return;
    const ordered = initialRandomizeQuestions.current ? shuffle(filteredQuestions) : [...filteredQuestions];
    setQuestions(ordered);
    const finalIds = ordered.map((q2) => String(q2.id));
    const existing = loadSession(sessionIdRef.current);
    if (existing) {
      saveSession({ ...existing, questionIds: finalIds });
    } else {
      saveSession({
        sessionId: sessionIdRef.current,
        testId,
        testName: "",
        startedAt: (/* @__PURE__ */ new Date()).toISOString(),
        randomizeQuestions: initialRandomizeQuestions.current,
        randomizeAnswers: initialRandomizeAnswers.current,
        selectedSectionIds,
        questionIds: finalIds
      });
    }
    if (!restoredRef.current) {
      restoredRef.current = true;
      const stored = loadStoredAnswers(sessionIdRef.current);
      if (stored) {
        setAnswers(stored.answers);
        setCurrentIdx(stored.currentIdx);
      }
    }
  }, [questions.length, filteredQuestions]);
  const shuffledOptionsMap = reactExports.useMemo(() => {
    if (!initialRandomizeAnswers.current || questions.length === 0) return {};
    const map = {};
    for (const q2 of questions) {
      if (q2.questionType === QuestionType.mcSingle || q2.questionType === QuestionType.mcMulti) {
        const originalIndices = q2.options.map((_, i) => i);
        map[String(q2.id)] = shuffle(originalIndices);
      }
    }
    return map;
  }, [questions]);
  reactExports.useEffect(() => {
    if (questions.length === 0) return;
    saveStoredAnswers(sessionIdRef.current, { answers, currentIdx });
  }, [answers, currentIdx, questions.length]);
  reactExports.useEffect(() => {
    if (!testInfo) return;
    const existing = loadSession(sessionIdRef.current);
    saveSession({
      sessionId: sessionIdRef.current,
      testId,
      testName: testInfo.name ?? "",
      startedAt: (existing == null ? void 0 : existing.startedAt) ?? (/* @__PURE__ */ new Date()).toISOString(),
      randomizeQuestions: initialRandomizeQuestions.current,
      randomizeAnswers: initialRandomizeAnswers.current,
      selectedSectionIds,
      // Preserve questionIds that may have been written by the questions-loaded effect
      questionIds: existing == null ? void 0 : existing.questionIds
    });
  }, [testId, testInfo]);
  function getAnswer(q2) {
    return answers[String(q2.id)] ?? emptyAnswer(q2);
  }
  function setAnswer(qId2, answer2) {
    setAnswers((prev) => ({ ...prev, [qId2]: answer2 }));
  }
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!backend) throw new Error("Not connected");
      const submissions = questions.map((q2) => {
        const a = getAnswer(q2);
        const optMap2 = shuffledOptionsMap[String(q2.id)];
        const originalSelectedOptions = optMap2 ? a.selectedOptions.map((displayIdx) => optMap2[displayIdx]) : a.selectedOptions;
        return {
          questionId: q2.id,
          selectedOptions: originalSelectedOptions.map(BigInt),
          textAnswer: a.textAnswer,
          orderedItems: a.dragOrder.map(BigInt)
        };
      });
      return backend.submitTestAnswers(
        username,
        testIdBig,
        sessionIdRef.current,
        submissions
      );
    },
    onSuccess: () => {
      const completedSession = loadSession(sessionIdRef.current);
      saveCompletedSessionSnapshot(sessionIdRef.current, {
        questionIds: (completedSession == null ? void 0 : completedSession.questionIds) ?? questions.map((q2) => String(q2.id)),
        randomizeQuestions: initialRandomizeQuestions.current,
        randomizeAnswers: initialRandomizeAnswers.current,
        selectedSectionIds
      });
      removeSession(sessionIdRef.current);
      clearElapsedSeconds(sessionIdRef.current);
      navigate({
        to: "/tests/$testId/result",
        params: { testId },
        search: { sessionId: sessionIdRef.current }
      });
    },
    onError: () => ue.error("Failed to submit test. Please try again.")
  });
  const currentQuestion = questions[currentIdx];
  function handleOptionToggle(displayIdx) {
    if (!currentQuestion) return;
    if (checkedIds.has(String(currentQuestion.id))) return;
    const a = getAnswer(currentQuestion);
    const qId2 = String(currentQuestion.id);
    if (currentQuestion.questionType === QuestionType.mcSingle) {
      setAnswer(qId2, { ...a, selectedOptions: [displayIdx] });
    } else {
      const has = a.selectedOptions.includes(displayIdx);
      setAnswer(qId2, {
        ...a,
        selectedOptions: has ? a.selectedOptions.filter((x) => x !== displayIdx) : [...a.selectedOptions, displayIdx]
      });
    }
  }
  function handleTextChange(val) {
    if (!currentQuestion) return;
    if (checkedIds.has(String(currentQuestion.id))) return;
    const a = getAnswer(currentQuestion);
    setAnswer(String(currentQuestion.id), { ...a, textAnswer: val });
  }
  function handleDragOrderChange(order) {
    if (!currentQuestion) return;
    if (checkedIds.has(String(currentQuestion.id))) return;
    const a = getAnswer(currentQuestion);
    setAnswer(String(currentQuestion.id), { ...a, dragOrder: order });
  }
  function handleFontSizeChange(size) {
    setFontSizeState(size);
    setFontSize(size);
  }
  function handleCheckOrNext() {
    if (!currentQuestion) return;
    const qId2 = String(currentQuestion.id);
    if (!checkedIds.has(qId2)) {
      setCheckedIds((prev) => /* @__PURE__ */ new Set([...prev, qId2]));
      const optMapForCheck = shuffledOptionsMap[qId2];
      const answerForCheck = getAnswer(currentQuestion);
      const isCorrectNow = isAnswerCorrect(
        currentQuestion,
        answerForCheck,
        optMapForCheck
      );
      if (isCorrectNow) {
        if (autoAdvanceTimerRef.current)
          clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = setTimeout(() => {
          autoAdvanceTimerRef.current = null;
          if (currentIdx < questions.length - 1) {
            setCurrentIdx((i) => i + 1);
          } else {
            submitMutation.mutate();
          }
        }, 500);
      }
      return;
    }
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      submitMutation.mutate();
    }
  }
  function handlePrev() {
    setCurrentIdx((i) => Math.max(0, i - 1));
  }
  reactExports.useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current)
        clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []);
  const [currentQuestionHasAudio, setCurrentQuestionHasAudio] = reactExports.useState(false);
  const currentAudioSrcRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const aq = questions[currentIdx];
    if (currentAudioSrcRef.current) {
      URL.revokeObjectURL(currentAudioSrcRef.current);
      currentAudioSrcRef.current = null;
    }
    if (!aq) {
      setCurrentQuestionHasAudio(false);
      audioRef.current = null;
      return;
    }
    let audioSrc = null;
    let isBlobUrl = false;
    if (aq.audioBlob && aq.audioBlob.byteLength > 0) {
      const blob = new Blob([aq.audioBlob], {
        type: "audio/mpeg"
      });
      audioSrc = URL.createObjectURL(blob);
      isBlobUrl = true;
      currentAudioSrcRef.current = audioSrc;
    } else if (aq.audioUrl && aq.audioUrl.trim().length > 0) {
      audioSrc = aq.audioUrl.trim();
    }
    if (!audioSrc) {
      setCurrentQuestionHasAudio(false);
      audioRef.current = null;
      return;
    }
    setCurrentQuestionHasAudio(true);
    const el = new Audio(audioSrc);
    el.volume = 1;
    audioRef.current = el;
    el.play().catch(() => {
    });
    return () => {
      el.pause();
      if (isBlobUrl && audioSrc) {
        URL.revokeObjectURL(audioSrc);
        currentAudioSrcRef.current = null;
      }
    };
  }, [currentIdx, questions[currentIdx]]);
  if (isLoading || filteredQuestions.length > 0 && questions.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-3xl mx-auto px-4 py-8",
        "data-ocid": "test.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-full mb-8 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-full" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" })
            ] })
          ] })
        ]
      }
    );
  }
  if (!isLoading && questions.length === 0) {
    const isFiltered = selectedSectionIds.length > 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-3xl mx-auto px-4 py-16 text-center",
        "data-ocid": "test.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-8 h-8 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-lg text-foreground mb-2", children: isFiltered ? "No questions in selected sections" : "No questions yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: isFiltered ? "The sections you selected have no questions. Try selecting different sections or the entire test." : "This test has no questions yet. Please contact an admin to add questions." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tests", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "gap-2", "data-ocid": "test.back_tests_button", children: "Back to Practice Tests" }) }) })
        ]
      }
    );
  }
  if (!currentQuestion) return null;
  const q = currentQuestion;
  const answer = getAnswer(q);
  const isLast = currentIdx === questions.length - 1;
  const qId = String(q.id);
  const isChecked = checkedIds.has(qId);
  const optMap = shuffledOptionsMap[qId];
  const correct = isChecked ? isAnswerCorrect(q, answer, optMap) : null;
  const displayOptions = optMap ? optMap.map((origIdx) => q.options[origIdx]) : q.options;
  const displayQuestion = optMap && (q.questionType === QuestionType.mcSingle || q.questionType === QuestionType.mcMulti) ? { ...q, options: displayOptions } : q;
  function isDotAnswered(qItem) {
    const a = answers[String(qItem.id)];
    if (!a) return false;
    return a.selectedOptions.length > 0 || a.textAnswer.trim().length > 0;
  }
  const hasAnswerEntered = answer.selectedOptions.length > 0 || answer.textAnswer.trim().length > 0;
  const cachedSections = (() => {
    var _a;
    try {
      return ((_a = getTestCache(testId)) == null ? void 0 : _a.sections) ?? [];
    } catch {
      return [];
    }
  })();
  const sectionNameMap = new Map(cachedSections.map((s) => [s.id, s.name]));
  const showSectionProgress = selectedSectionIds.length > 1;
  const singleSectionStat = !showSectionProgress && selectedSectionIds.length === 1 ? (() => {
    const sid = selectedSectionIds[0];
    const sectionQs = questions.filter(
      (sq) => sq.sectionId != null && Number(sq.sectionId) === sid
    );
    return {
      id: sid,
      name: sectionNameMap.get(String(sid)) ?? `Section ${sid}`,
      answered: sectionQs.filter((sq) => isDotAnswered(sq)).length,
      total: sectionQs.length
    };
  })() : null;
  const sectionStats = showSectionProgress ? selectedSectionIds.map((sId) => {
    const sectionQs = questions.filter(
      (sq) => sq.sectionId != null && Number(sq.sectionId) === sId
    );
    const answeredCount = sectionQs.filter(
      (sq) => isDotAnswered(sq)
    ).length;
    return {
      id: sId,
      name: sectionNameMap.get(String(sId)) ?? `Section ${sId}`,
      answered: answeredCount,
      total: sectionQs.length
    };
  }) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
      "data-ocid": "test.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/tests",
              className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
              "data-ocid": "test.back_tests_link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                "Back to Tests"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2",
                "data-ocid": "test.font_size_control",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium select-none whitespace-nowrap", children: "Text Size" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "range",
                      min: FONT_SIZE_MIN,
                      max: FONT_SIZE_MAX,
                      step: 1,
                      value: fontSize,
                      onChange: (e) => handleFontSizeChange(Number(e.target.value)),
                      "aria-label": `Text size: ${fontSize}px`,
                      "data-ocid": "test.font_size_slider",
                      className: "w-28 sm:w-36 accent-primary cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums w-8 text-right select-none", children: [
                    fontSize,
                    "px"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/tests",
                className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
                "data-ocid": "test.all_tests_link",
                children: "All Tests"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setEndTestDialogOpen(true),
                className: "gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive",
                "data-ocid": "test.end_test_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
                  "End Test"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-2 z-10 mb-4 rounded-xl border border-border bg-card/90 backdrop-blur-sm shadow-subtle px-4 py-3 space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: (testInfo == null ? void 0 : testInfo.name) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs", children: testInfo.name }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "timer-display text-base sm:text-lg leading-none",
                "data-ocid": "test.timer_display",
                "aria-label": `Elapsed time: ${formatElapsed(elapsedSeconds)}`,
                children: formatElapsed(elapsedSeconds)
              }
            )
          ] }),
          showSectionProgress && sectionStats.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
              "data-ocid": "test.sections_progress",
              children: sectionStats.map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                SectionProgressBar,
                {
                  sectionName: stat.name,
                  answered: stat.answered,
                  total: stat.total
                },
                stat.id
              ))
            }
          ),
          !showSectionProgress && selectedSectionIds.length === 1 && singleSectionStat && /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionProgressBar,
            {
              sectionName: singleSectionStat.name,
              answered: singleSectionStat.answered,
              total: singleSectionStat.total
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: `shadow-subtle mb-3 transition-colors duration-200 ${isChecked ? correct ? "border-accent/60 bg-accent/5" : "border-destructive/40 bg-destructive/5" : ""}`,
            "data-ocid": "test.question.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-4 border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0", children: currentIdx + 1 }),
                    isChecked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${correct ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"}`,
                        "data-ocid": "test.answer_feedback",
                        children: correct ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                          " Correct"
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
                          " Incorrect"
                        ] })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1.5 shrink-0", children: [
                    QUESTION_TYPE_ICONS[q.questionType],
                    QUESTION_TYPE_LABELS[q.questionType]
                  ] })
                ] }),
                q.imageBlob && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full rounded-lg overflow-hidden border border-border mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: q.imageBlob.getDirectURL(),
                    alt: "Question illustration",
                    className: "w-full max-h-64 object-contain bg-muted/30"
                  }
                ) }),
                currentQuestionHasAudio && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    className: "gap-1.5 text-xs",
                    onClick: () => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(() => {
                        });
                      }
                    },
                    "data-ocid": "test.play_again_button",
                    "aria-label": "Play audio again",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-3.5 h-3.5" }),
                      "Play Again"
                    ]
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-5", style: { fontSize: `${fontSize}px` }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  QuestionRenderer,
                  {
                    question: displayQuestion,
                    selectedOptions: answer.selectedOptions,
                    textAnswer: answer.textAnswer,
                    dragOrder: answer.dragOrder,
                    onOptionToggle: handleOptionToggle,
                    onTextChange: handleTextChange,
                    onDragOrderChange: handleDragOrderChange,
                    isBookmarked: bookmarkedIds.has(qId),
                    onToggleBookmark: () => handleToggleBookmark(qId)
                  }
                ),
                isChecked && !correct && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "mt-4 flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/30",
                    "data-ocid": "test.correct_answer_display",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 shrink-0 text-accent mt-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-0.5", children: "Correct answer" }),
                        (q.questionType === QuestionType.mcSingle || q.questionType === QuestionType.mcMulti) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: q.correctAnswers.map((idx) => {
                          const origOpt = q.options[Number(idx)];
                          return origOpt ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            RichTextDisplay,
                            {
                              html: origOpt,
                              className: "font-medium text-accent"
                            },
                            String(idx)
                          ) : null;
                        }) }),
                        q.questionType === QuestionType.textInput && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          RichTextDisplay,
                          {
                            html: q.correctText,
                            className: "font-medium text-accent"
                          }
                        ),
                        q.questionType === QuestionType.dragOrder && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: q.correctOrder.map((idx, pos) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "text-xs bg-accent/15 text-accent px-2 py-0.5 rounded inline-flex items-center gap-1",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                                pos + 1,
                                "."
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                RichTextDisplay,
                                {
                                  html: q.options[Number(idx)] ?? "",
                                  className: "inline"
                                }
                              )
                            ]
                          },
                          `order-${pos}-${String(idx)}`
                        )) })
                      ] })
                    ]
                  }
                ),
                isChecked && q.explanation && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "explanation-card explanation-reveal mt-4",
                    "data-ocid": "test.explanation_card",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "explanation-label flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3.5 h-3.5" }),
                        "Explanation"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "explanation-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RichTextDisplay, { html: q.explanation }) })
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: handlePrev,
              disabled: currentIdx === 0,
              className: "gap-2",
              "data-ocid": "test.prev_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                "Previous"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex flex-wrap gap-1.5 justify-center",
              "data-ocid": "test.dot_nav",
              children: questions.map((qItem, i) => {
                const answered = isDotAnswered(qItem);
                const checked = checkedIds.has(String(qItem.id));
                const isCurrent = i === currentIdx;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setCurrentIdx(i),
                    "data-ocid": `test.nav_dot.${i + 1}`,
                    "aria-label": `Go to question ${i + 1}`,
                    className: `w-7 h-7 rounded-full text-xs font-bold transition-all duration-150
                  ${isCurrent ? "ring-2 ring-primary ring-offset-1 bg-primary text-primary-foreground" : checked ? "bg-accent/80 text-accent-foreground" : answered ? "bg-accent/40 text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/60"}`,
                    children: i + 1
                  },
                  String(qItem.id)
                );
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleCheckOrNext,
              disabled: submitMutation.isPending || !hasAnswerEntered && !isChecked,
              className: "gap-2",
              "data-ocid": isChecked ? isLast ? "test.submit_button" : "test.next_button" : "test.check_button",
              children: submitMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-ocid": "test.loading_state", children: "Submitting…" }) : isChecked ? correct ? null : isLast ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                "Submit Test"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "Next",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                "Check Answer"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: endTestDialogOpen, onOpenChange: setEndTestDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "test.end_test.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "End test early?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Your progress so far will be submitted. Unanswered questions will be marked as incorrect. This cannot be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setEndTestDialogOpen(false),
                "data-ocid": "test.end_test.cancel_button",
                children: "Keep going"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                onClick: () => {
                  setEndTestDialogOpen(false);
                  submitMutation.mutate();
                },
                disabled: submitMutation.isPending,
                "data-ocid": "test.end_test.confirm_button",
                children: submitMutation.isPending ? "Submitting…" : "End & Submit"
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
export {
  TakeTestPage,
  isAnswerCorrect
};
