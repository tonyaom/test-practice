import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Link,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import {
  AlignLeft,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CheckSquare,
  Circle,
  Info,
  Layers,
  LayoutDashboard,
  Volume2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { QuestionRenderer } from "../../components/QuestionRenderer";
import { RichTextDisplay } from "../../components/RichTextDisplay";
import { SectionProgressBar } from "../../components/SectionProgressBar";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import { QuestionType } from "../../types";
import type { AnswerSubmission, Question } from "../../types";
import * as bookmarkStorage from "../../utils/bookmarkStorage";
import {
  FONT_SIZE_DEFAULT,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  getFontSize,
  setFontSize,
} from "../../utils/fontSizeStorage";
import {
  getTestCache,
  isCacheValid,
  saveTestCache,
} from "../../utils/offlineCache";
import {
  loadSession,
  loadStoredAnswers,
  removeSession,
  saveCompletedSessionSnapshot,
  saveSession,
  saveStoredAnswers,
} from "../../utils/testSessions";
import {
  clearElapsedSeconds,
  formatElapsed,
  getElapsedSeconds,
  setElapsedSeconds as persistElapsedSeconds,
} from "../../utils/timerStorage";

const QUESTION_TYPE_ICONS: Record<QuestionType, React.ReactNode> = {
  [QuestionType.mcSingle]: <Circle className="w-3.5 h-3.5" />,
  [QuestionType.mcMulti]: <CheckSquare className="w-3.5 h-3.5" />,
  [QuestionType.textInput]: <AlignLeft className="w-3.5 h-3.5" />,
  [QuestionType.dragOrder]: <Layers className="w-3.5 h-3.5" />,
};

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.mcSingle]: "Single Choice",
  [QuestionType.mcMulti]: "Multiple Choice",
  [QuestionType.textInput]: "Short Answer",
  [QuestionType.dragOrder]: "Ordering",
};

interface Answer {
  selectedOptions: number[];
  textAnswer: string;
  dragOrder: number[];
}

function emptyAnswer(q: Question): Answer {
  return {
    selectedOptions: [],
    textAnswer: "",
    dragOrder: q.options.map((_, i) => i),
  };
}

/** Fisher-Yates shuffle — returns a new array */
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Check if the current answer is correct for a given question.
 * Used to show feedback in the "answered" state.
 */
export function isAnswerCorrect(
  q: Question,
  a: Answer,
  optMap: number[] | undefined,
): boolean {
  const originalSelected = optMap
    ? a.selectedOptions.map((di) => optMap[di])
    : a.selectedOptions;

  if (
    q.questionType === QuestionType.mcSingle ||
    q.questionType === QuestionType.mcMulti
  ) {
    const correct = q.correctAnswers.map(Number).sort();
    const given = [...originalSelected].map(Number).sort();
    return (
      correct.length === given.length && correct.every((v, i) => v === given[i])
    );
  }
  if (q.questionType === QuestionType.textInput) {
    return (
      a.textAnswer.trim().toLowerCase() === q.correctText.trim().toLowerCase()
    );
  }
  if (q.questionType === QuestionType.dragOrder) {
    const correct = q.correctOrder.map(Number);
    const given = a.dragOrder.map(Number);
    return (
      correct.length === given.length && correct.every((v, i) => v === given[i])
    );
  }
  return false;
}

export function TakeTestPage() {
  const { testId } = useParams({ from: "/tests/$testId" });
  const navigate = useNavigate();
  const { session } = useAuth();
  const backend = useBackend();
  const username = session?.username ?? "";
  const testIdBig = BigInt(testId);

  // Read params from URL search
  const searchParams = useSearch({ strict: false }) as Record<string, string>;
  const shouldRandomizeAnswers = searchParams?.randomizeAnswers === "true";
  const shouldRandomizeQuestions = searchParams?.randomizeQuestions === "true";
  const urlSessionId = searchParams?.sessionId ?? "";
  /** Comma-separated section IDs from URL; empty string = entire test */
  const urlSections = searchParams?.sections ?? "";
  const selectedSectionIds: number[] = urlSections
    ? urlSections.split(",").map(Number).filter(Boolean)
    : [];
  /** When Try Again is used, exact question IDs to replay (comma-separated) */
  const urlQuestionIds = searchParams?.questionIds ?? "";
  const replayQuestionIds: string[] = urlQuestionIds
    ? urlQuestionIds.split(",").filter(Boolean)
    : [];

  // Stable refs so shuffled order is determined once at mount
  const initialRandomizeQuestions = useRef(shouldRandomizeQuestions);
  const initialRandomizeAnswers = useRef(shouldRandomizeAnswers);
  const sessionIdRef = useRef(
    urlSessionId ||
      Math.random().toString(36).slice(2) + Date.now().toString(36),
  );

  const { data: rawQuestions = [], isLoading } = useQuery<Question[]>({
    queryKey: ["questions", testId],
    queryFn: async () => {
      if (!backend) return [];
      // Try offline cache first
      const cached = getTestCache(testId);
      if (cached) {
        // Also check if the server version is newer
        try {
          const serverTest = await backend.getTest(testIdBig);
          if (
            serverTest &&
            isCacheValid(cached.updatedAt, String(serverTest.updatedAt))
          ) {
            // Cache is current — deserialise from cache
            return cached.questions.map((q) => ({
              id: BigInt(q.id),
              testId: BigInt(q.testId),
              orderIndex: BigInt(q.orderIndex),
              text: q.text,
              questionType: q.questionType as Question["questionType"],
              options: q.options,
              correctAnswers: q.correctAnswers.map(BigInt),
              correctText: q.correctText,
              correctOrder: q.correctOrder.map(BigInt),
              sectionId: q.sectionId != null ? BigInt(q.sectionId) : undefined,
              questionUpdatedAt: BigInt(q.questionUpdatedAt),
              explanation: q.explanation ?? undefined,
            }));
          }
          // Cache stale — fetch fresh and update cache
          if (serverTest) {
            const [qs, sects] = await Promise.all([
              backend.listQuestionsForTest(testIdBig),
              backend.listSectionsForTest(testIdBig),
            ]);
            saveTestCache(
              testId,
              {
                test: {
                  id: testId,
                  name: serverTest.name,
                  description: serverTest.description,
                  updatedAt: String(serverTest.updatedAt),
                },
                questions: qs.map((q) => ({
                  id: String(q.id),
                  testId: String(q.testId),
                  orderIndex: String(q.orderIndex),
                  text: q.text,
                  questionType: q.questionType,
                  options: q.options,
                  correctAnswers: q.correctAnswers.map(String),
                  correctText: q.correctText,
                  correctOrder: q.correctOrder.map(String),
                  sectionId:
                    q.sectionId != null ? String(q.sectionId) : undefined,
                  questionUpdatedAt: String(q.questionUpdatedAt),
                  explanation: q.explanation ?? undefined,
                })),
                sections: sects.map((s) => ({
                  id: String(s.id),
                  testId: String(s.testId),
                  name: s.name,
                  description: s.description,
                  updatedAt: String(s.updatedAt),
                })),
                updatedAt: String(serverTest.updatedAt),
              },
              String(serverTest.updatedAt),
            );
            return qs.sort(
              (a, b) => Number(a.orderIndex) - Number(b.orderIndex),
            );
          }
        } catch {
          // Network error — fall back to cache
          return cached.questions.map((q) => ({
            id: BigInt(q.id),
            testId: BigInt(q.testId),
            orderIndex: BigInt(q.orderIndex),
            text: q.text,
            questionType: q.questionType as Question["questionType"],
            options: q.options,
            correctAnswers: q.correctAnswers.map(BigInt),
            correctText: q.correctText,
            correctOrder: q.correctOrder.map(BigInt),
            sectionId: q.sectionId != null ? BigInt(q.sectionId) : undefined,
            questionUpdatedAt: BigInt(q.questionUpdatedAt),
            explanation: q.explanation ?? undefined,
          }));
        }
      }
      // No cache — fetch from backend
      const qs = await backend.listQuestionsForTest(testIdBig);
      return qs.sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex));
    },
    enabled: !!backend,
  });

  // Fetch mastery data (best-effort — no mastery = show all questions)
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
    enabled: !!backend && !!username,
  });

  // Build mastery map for quick lookup
  const masteryMap = new Map(masteryList.map((m) => [String(m.questionId), m]));

  // Filter to selected sections (if any); empty selectedSectionIds = entire test
  // -1 is the sentinel ID for the virtual "Uncategorised" section (questions with no sectionId)
  const UNCATEGORISED_SECTION_ID = -1;
  const sectionFiltered = rawQuestions.filter((q) => {
    if (selectedSectionIds.length === 0) return true;
    const sid = q.sectionId != null ? Number(q.sectionId) : undefined;
    // Check if the "Uncategorised" virtual section is selected
    if (sid === undefined) {
      return selectedSectionIds.includes(UNCATEGORISED_SECTION_ID);
    }
    return selectedSectionIds.includes(sid);
  });

  // If this is a Try Again replay, use only the exact question IDs from that session
  const isReplay = replayQuestionIds.length > 0;

  // Filter out mastered questions — unless ALL are mastered (allow retake)
  const allMastered =
    !isReplay &&
    sectionFiltered.length > 0 &&
    sectionFiltered.every((q) => masteryMap.get(String(q.id))?.isMastered);
  const filteredQuestions = isReplay
    ? rawQuestions.filter((q) => replayQuestionIds.includes(String(q.id)))
    : sectionFiltered.filter((q) => {
        if (allMastered) return true; // retake mode
        const mastery = masteryMap.get(String(q.id));
        return !mastery?.isMastered;
      });

  const { data: testInfo } = useQuery({
    queryKey: ["test", testId],
    queryFn: async () => {
      if (!backend) return null;
      return backend.getTest(testIdBig);
    },
    enabled: !!backend,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  /** Set of question IDs that have been "checked" (user clicked Check Answer) */
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [endTestDialogOpen, setEndTestDialogOpen] = useState(false);
  const restoredRef = useRef(false);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Font size state (numeric px value, e.g. 16)
  const [fontSize, setFontSizeState] = useState<number>(() => getFontSize());

  // ── Timer ──────────────────────────────────────────────────────────────────
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerInitialisedRef = useRef(false);

  // Load persisted elapsed time on first render (after sessionId is stable)
  useEffect(() => {
    if (timerInitialisedRef.current) return;
    timerInitialisedRef.current = true;
    const saved = getElapsedSeconds(sessionIdRef.current);
    setElapsedSeconds(saved);
  }, []);

  // Tick every second and persist
  useEffect(() => {
    const id = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        persistElapsedSeconds(sessionIdRef.current, next);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Bookmarks ──────────────────────────────────────────────────────────────
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Load bookmarks when username/testId are available
  useEffect(() => {
    if (!username || !testId) return;
    setBookmarkedIds(bookmarkStorage.getBookmarks(username, testId));
  }, [username, testId]);

  function handleToggleBookmark(questionId: string) {
    if (!username) return;
    const newState = bookmarkStorage.toggleBookmark(
      username,
      testId,
      Number(questionId),
    );
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (newState) next.add(questionId);
      else next.delete(questionId);
      return next;
    });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: testId and selectedSectionIds are derived from URL params (stable on mount)
  useEffect(() => {
    if (filteredQuestions.length === 0 || questions.length > 0) return;
    const ordered = initialRandomizeQuestions.current
      ? shuffle(filteredQuestions)
      : [...filteredQuestions];
    setQuestions(ordered);

    // Persist the final question IDs in the session so Try Again can replay them exactly.
    // Always write questionIds — even if no existing session (e.g. replay reuses the same sessionId
    // after the original session was removed on submit).
    const finalIds = ordered.map((q) => String(q.id));
    const existing = loadSession(sessionIdRef.current);
    if (existing) {
      saveSession({ ...existing, questionIds: finalIds });
    } else {
      // Session was removed (e.g. after submit) but we're replaying — create a minimal session
      // so the completed snapshot can capture the correct question IDs on next submit.
      saveSession({
        sessionId: sessionIdRef.current,
        testId,
        testName: "",
        startedAt: new Date().toISOString(),
        randomizeQuestions: initialRandomizeQuestions.current,
        randomizeAnswers: initialRandomizeAnswers.current,
        selectedSectionIds,
        questionIds: finalIds,
      });
    }

    // Restore stored answers from localStorage if available
    if (!restoredRef.current) {
      restoredRef.current = true;
      const stored = loadStoredAnswers(sessionIdRef.current);
      if (stored) {
        setAnswers(stored.answers);
        setCurrentIdx(stored.currentIdx);
      }
    }
  }, [questions.length, filteredQuestions]);

  // Build a stable mapping of questionId -> shuffled option indices for MC questions
  const shuffledOptionsMap = useMemo<Record<string, number[]>>(() => {
    if (!initialRandomizeAnswers.current || questions.length === 0) return {};
    const map: Record<string, number[]> = {};
    for (const q of questions) {
      if (
        q.questionType === QuestionType.mcSingle ||
        q.questionType === QuestionType.mcMulti
      ) {
        const originalIndices = q.options.map((_, i) => i);
        map[String(q.id)] = shuffle(originalIndices);
      }
    }
    return map;
  }, [questions]);

  // Persist answers to localStorage whenever they change
  useEffect(() => {
    if (questions.length === 0) return;
    saveStoredAnswers(sessionIdRef.current, { answers, currentIdx });
  }, [answers, currentIdx, questions.length]);

  // Ensure session metadata is saved (including selectedSectionIds)
  // NOTE: preserve existing questionIds if already set by the questions-loaded effect
  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedSectionIds is derived from URL (stable)
  useEffect(() => {
    if (!testInfo) return;
    const existing = loadSession(sessionIdRef.current);
    saveSession({
      sessionId: sessionIdRef.current,
      testId,
      testName: testInfo.name ?? "",
      startedAt: existing?.startedAt ?? new Date().toISOString(),
      randomizeQuestions: initialRandomizeQuestions.current,
      randomizeAnswers: initialRandomizeAnswers.current,
      selectedSectionIds,
      // Preserve questionIds that may have been written by the questions-loaded effect
      questionIds: existing?.questionIds,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId, testInfo]);

  function getAnswer(q: Question): Answer {
    return answers[String(q.id)] ?? emptyAnswer(q);
  }

  function setAnswer(qId: string, answer: Answer) {
    setAnswers((prev) => ({ ...prev, [qId]: answer }));
  }

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!backend) throw new Error("Not connected");
      const submissions: AnswerSubmission[] = questions.map((q) => {
        const a = getAnswer(q);
        const optMap = shuffledOptionsMap[String(q.id)];
        const originalSelectedOptions = optMap
          ? a.selectedOptions.map((displayIdx) => optMap[displayIdx])
          : a.selectedOptions;
        return {
          questionId: q.id,
          selectedOptions: originalSelectedOptions.map(BigInt),
          textAnswer: a.textAnswer,
          orderedItems: a.dragOrder.map(BigInt),
        };
      });
      return backend.submitTestAnswers(
        username,
        testIdBig,
        sessionIdRef.current,
        submissions,
      );
    },
    onSuccess: () => {
      // Snapshot the completed session's questionIds BEFORE removing the active session.
      // TestResultPage reads this snapshot so Try Again can replay the exact same questions.
      const completedSession = loadSession(sessionIdRef.current);
      saveCompletedSessionSnapshot(sessionIdRef.current, {
        questionIds:
          completedSession?.questionIds ?? questions.map((q) => String(q.id)),
        randomizeQuestions: initialRandomizeQuestions.current,
        randomizeAnswers: initialRandomizeAnswers.current,
        selectedSectionIds,
      });
      // Clean up this session + timer from localStorage
      removeSession(sessionIdRef.current);
      clearElapsedSeconds(sessionIdRef.current);
      navigate({
        to: "/tests/$testId/result",
        params: { testId },
        search: { sessionId: sessionIdRef.current },
      });
    },
    onError: () => toast.error("Failed to submit test. Please try again."),
  });

  const currentQuestion = questions[currentIdx];

  function handleOptionToggle(displayIdx: number) {
    if (!currentQuestion) return;
    // Prevent changing answer once checked
    if (checkedIds.has(String(currentQuestion.id))) return;
    const a = getAnswer(currentQuestion);
    const qId = String(currentQuestion.id);
    if (currentQuestion.questionType === QuestionType.mcSingle) {
      setAnswer(qId, { ...a, selectedOptions: [displayIdx] });
    } else {
      const has = a.selectedOptions.includes(displayIdx);
      setAnswer(qId, {
        ...a,
        selectedOptions: has
          ? a.selectedOptions.filter((x) => x !== displayIdx)
          : [...a.selectedOptions, displayIdx],
      });
    }
  }

  function handleTextChange(val: string) {
    if (!currentQuestion) return;
    if (checkedIds.has(String(currentQuestion.id))) return;
    const a = getAnswer(currentQuestion);
    setAnswer(String(currentQuestion.id), { ...a, textAnswer: val });
  }

  function handleDragOrderChange(order: number[]) {
    if (!currentQuestion) return;
    if (checkedIds.has(String(currentQuestion.id))) return;
    const a = getAnswer(currentQuestion);
    setAnswer(String(currentQuestion.id), { ...a, dragOrder: order });
  }

  function handleFontSizeChange(size: number) {
    setFontSizeState(size);
    setFontSize(size);
  }

  /** Mark current question as checked (reveal feedback), or advance if already checked */
  function handleCheckOrNext() {
    if (!currentQuestion) return;
    const qId = String(currentQuestion.id);

    if (!checkedIds.has(qId)) {
      // First click: reveal feedback + explanation
      setCheckedIds((prev) => new Set([...prev, qId]));

      // Check if correct — if yes, schedule auto-advance after 500ms
      const optMapForCheck = shuffledOptionsMap[qId];
      const answerForCheck = getAnswer(currentQuestion);
      const isCorrectNow = isAnswerCorrect(
        currentQuestion,
        answerForCheck,
        optMapForCheck,
      );

      if (isCorrectNow) {
        // Clear any prior timer
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

    // Second click (for incorrect answers): advance or submit
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      submitMutation.mutate();
    }
  }

  function handlePrev() {
    setCurrentIdx((i) => Math.max(0, i - 1));
  }

  // Cleanup auto-advance timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current)
        clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []);

  // Play audio whenever the current question changes
  // Track whether the current question has audio (for Play Again button visibility)
  const [currentQuestionHasAudio, setCurrentQuestionHasAudio] = useState(false);
  const currentAudioSrcRef = useRef<string | null>(null);

  useEffect(() => {
    const aq = questions[currentIdx];
    // Clean up previous audio src before setting new one
    if (currentAudioSrcRef.current) {
      URL.revokeObjectURL(currentAudioSrcRef.current);
      currentAudioSrcRef.current = null;
    }
    if (!aq) {
      setCurrentQuestionHasAudio(false);
      audioRef.current = null;
      return;
    }

    let audioSrc: string | null = null;
    let isBlobUrl = false;

    if (aq.audioBlob && aq.audioBlob.byteLength > 0) {
      // audioBlob is a Uint8Array — create a Blob from it
      const blob = new Blob([aq.audioBlob as Uint8Array<ArrayBuffer>], {
        type: "audio/mpeg",
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
      /* autoplay blocked by browser — Play Again button is always shown so user can manually play */
    });

    return () => {
      el.pause();
      if (isBlobUrl && audioSrc) {
        URL.revokeObjectURL(audioSrc);
        currentAudioSrcRef.current = null;
      }
    };
  }, [currentIdx, questions[currentIdx]]);

  if (isLoading || (filteredQuestions.length > 0 && questions.length === 0)) {
    return (
      <div
        className="max-w-3xl mx-auto px-4 py-8"
        data-ocid="test.loading_state"
      >
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-2.5 w-full mb-8 rounded-full" />
        <Card className="shadow-subtle">
          <CardHeader>
            <Skeleton className="h-6 w-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoading && questions.length === 0) {
    const isFiltered = selectedSectionIds.length > 0;
    return (
      <div
        className="max-w-3xl mx-auto px-4 py-16 text-center"
        data-ocid="test.empty_state"
      >
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 mx-auto">
          <LayoutDashboard className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="font-display font-semibold text-lg text-foreground mb-2">
          {isFiltered
            ? "No questions in selected sections"
            : "No questions yet"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {isFiltered
            ? "The sections you selected have no questions. Try selecting different sections or the entire test."
            : "This test has no questions yet. Please contact an admin to add questions."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/tests">
            <Button className="gap-2" data-ocid="test.back_tests_button">
              Back to Practice Tests
            </Button>
          </Link>
        </div>
      </div>
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

  const displayOptions = optMap
    ? optMap.map((origIdx) => q.options[origIdx])
    : q.options;

  const displayQuestion: Question =
    optMap &&
    (q.questionType === QuestionType.mcSingle ||
      q.questionType === QuestionType.mcMulti)
      ? { ...q, options: displayOptions }
      : q;

  function isDotAnswered(qItem: Question): boolean {
    const a = answers[String(qItem.id)];
    if (!a) return false;
    return a.selectedOptions.length > 0 || a.textAnswer.trim().length > 0;
  }

  /** Whether the current question has any answer entered */
  const hasAnswerEntered =
    answer.selectedOptions.length > 0 || answer.textAnswer.trim().length > 0;

  // ── Section progress computation ─────────────────────────────────────────
  // Build section name map from cached test data
  const cachedSections = (() => {
    try {
      return getTestCache(testId)?.sections ?? [];
    } catch {
      return [];
    }
  })();

  const sectionNameMap = new Map(cachedSections.map((s) => [s.id, s.name]));

  // Only show section progress when multiple sections are selected
  const showSectionProgress = selectedSectionIds.length > 1;

  interface SectionStat {
    id: number;
    name: string;
    answered: number;
    total: number;
  }

  // Single section stat for when only 1 section is selected
  const singleSectionStat: SectionStat | null =
    !showSectionProgress && selectedSectionIds.length === 1
      ? (() => {
          const sid = selectedSectionIds[0];
          const sectionQs = questions.filter(
            (sq) => sq.sectionId != null && Number(sq.sectionId) === sid,
          );
          return {
            id: sid,
            name: sectionNameMap.get(String(sid)) ?? `Section ${sid}`,
            answered: sectionQs.filter((sq) => isDotAnswered(sq)).length,
            total: sectionQs.length,
          };
        })()
      : null;

  const sectionStats: SectionStat[] = showSectionProgress
    ? selectedSectionIds.map((sId) => {
        const sectionQs = questions.filter(
          (sq) => sq.sectionId != null && Number(sq.sectionId) === sId,
        );
        const answeredCount = sectionQs.filter((sq) =>
          isDotAnswered(sq),
        ).length;
        return {
          id: sId,
          name: sectionNameMap.get(String(sId)) ?? `Section ${sId}`,
          answered: answeredCount,
          total: sectionQs.length,
        };
      })
    : [];

  return (
    <div
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      data-ocid="test.page"
    >
      {/* Top bar: back link + font size + End Test button */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <Link
          to="/tests"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="test.back_tests_link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tests
        </Link>
        <div className="flex items-center gap-3">
          {/* Font size slider */}
          <div
            className="flex items-center gap-2"
            data-ocid="test.font_size_control"
          >
            <span className="text-xs text-muted-foreground font-medium select-none whitespace-nowrap">
              Text Size
            </span>
            <input
              type="range"
              min={FONT_SIZE_MIN}
              max={FONT_SIZE_MAX}
              step={1}
              value={fontSize}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              aria-label={`Text size: ${fontSize}px`}
              data-ocid="test.font_size_slider"
              className="w-28 sm:w-36 accent-primary cursor-pointer"
            />
            <span className="text-xs text-muted-foreground tabular-nums w-8 text-right select-none">
              {fontSize}px
            </span>
          </div>
          <Link
            to="/tests"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="test.all_tests_link"
          >
            All Tests
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEndTestDialogOpen(true)}
            className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            data-ocid="test.end_test_button"
          >
            <XCircle className="w-4 h-4" />
            End Test
          </Button>
        </div>
      </div>

      {/* Sticky info bar: timer + section progress */}
      <div className="sticky top-2 z-10 mb-4 rounded-xl border border-border bg-card/90 backdrop-blur-sm shadow-subtle px-4 py-3 space-y-2.5">
        {/* Timer row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {testInfo?.name && (
              <span className="text-sm font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs">
                {testInfo.name}
              </span>
            )}
          </div>
          <span
            className="timer-display text-base sm:text-lg leading-none"
            data-ocid="test.timer_display"
            aria-label={`Elapsed time: ${formatElapsed(elapsedSeconds)}`}
          >
            {formatElapsed(elapsedSeconds)}
          </span>
        </div>

        {/* Section progress bars — only when multiple sections selected */}
        {showSectionProgress && sectionStats.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            data-ocid="test.sections_progress"
          >
            {sectionStats.map((stat) => (
              <SectionProgressBar
                key={stat.id}
                sectionName={stat.name}
                answered={stat.answered}
                total={stat.total}
              />
            ))}
          </div>
        )}

        {/* Single-section badge — when exactly one section selected */}
        {!showSectionProgress &&
          selectedSectionIds.length === 1 &&
          singleSectionStat && (
            <SectionProgressBar
              sectionName={singleSectionStat.name}
              answered={singleSectionStat.answered}
              total={singleSectionStat.total}
            />
          )}
      </div>

      {/* Question Card */}
      <Card
        className={`shadow-subtle mb-3 transition-colors duration-200 ${
          isChecked
            ? correct
              ? "border-accent/60 bg-accent/5"
              : "border-destructive/40 bg-destructive/5"
            : ""
        }`}
        data-ocid="test.question.card"
      >
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                {currentIdx + 1}
              </span>
              {/* Correct / Incorrect feedback badge */}
              {isChecked && (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    correct
                      ? "bg-accent/15 text-accent"
                      : "bg-destructive/15 text-destructive"
                  }`}
                  data-ocid="test.answer_feedback"
                >
                  {correct ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </>
                  )}
                </span>
              )}
            </div>
            <Badge variant="secondary" className="gap-1.5 shrink-0">
              {QUESTION_TYPE_ICONS[q.questionType]}
              {QUESTION_TYPE_LABELS[q.questionType]}
            </Badge>
          </div>
          {q.imageBlob && (
            <div className="w-full rounded-lg overflow-hidden border border-border mb-3">
              <img
                src={q.imageBlob.getDirectURL()}
                alt="Question illustration"
                className="w-full max-h-64 object-contain bg-muted/30"
              />
            </div>
          )}
          {currentQuestionHasAudio && (
            <div className="flex items-center gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(() => {});
                  }
                }}
                data-ocid="test.play_again_button"
                aria-label="Play audio again"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Play Again
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-5" style={{ fontSize: `${fontSize}px` }}>
          <QuestionRenderer
            question={displayQuestion}
            selectedOptions={answer.selectedOptions}
            textAnswer={answer.textAnswer}
            dragOrder={answer.dragOrder}
            onOptionToggle={handleOptionToggle}
            onTextChange={handleTextChange}
            onDragOrderChange={handleDragOrderChange}
            isBookmarked={bookmarkedIds.has(qId)}
            onToggleBookmark={() => handleToggleBookmark(qId)}
          />

          {/* Correct answer display — immediately shown when answer is incorrect */}
          {isChecked && !correct && (
            <div
              className="mt-4 flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/30"
              data-ocid="test.correct_answer_display"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-accent mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-0.5">
                  Correct answer
                </span>
                {(q.questionType === QuestionType.mcSingle ||
                  q.questionType === QuestionType.mcMulti) && (
                  <div className="space-y-1">
                    {q.correctAnswers.map((idx) => {
                      // Always use the ORIGINAL (un-shuffled) options for correct answer display
                      const origOpt = q.options[Number(idx)];
                      return origOpt ? (
                        <RichTextDisplay
                          key={String(idx)}
                          html={origOpt}
                          className="font-medium text-accent"
                        />
                      ) : null;
                    })}
                  </div>
                )}
                {q.questionType === QuestionType.textInput && (
                  <RichTextDisplay
                    html={q.correctText}
                    className="font-medium text-accent"
                  />
                )}
                {q.questionType === QuestionType.dragOrder && (
                  <div className="flex flex-wrap gap-1">
                    {q.correctOrder.map((idx, pos) => (
                      <span
                        key={`order-${pos}-${String(idx)}`}
                        className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded inline-flex items-center gap-1"
                      >
                        <span className="font-bold">{pos + 1}.</span>
                        <RichTextDisplay
                          html={q.options[Number(idx)] ?? ""}
                          className="inline"
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Explanation card — appears after answer is checked and explanation exists */}
          {isChecked && q.explanation && (
            <div
              className="explanation-card explanation-reveal mt-4"
              data-ocid="test.explanation_card"
            >
              <div className="explanation-label flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Explanation
              </div>
              <div className="explanation-text">
                <RichTextDisplay html={q.explanation} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation row */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="gap-2"
          data-ocid="test.prev_button"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <div
          className="flex flex-wrap gap-1.5 justify-center"
          data-ocid="test.dot_nav"
        >
          {questions.map((qItem, i) => {
            const answered = isDotAnswered(qItem);
            const checked = checkedIds.has(String(qItem.id));
            const isCurrent = i === currentIdx;
            return (
              <button
                type="button"
                key={String(qItem.id)}
                onClick={() => setCurrentIdx(i)}
                data-ocid={`test.nav_dot.${i + 1}`}
                aria-label={`Go to question ${i + 1}`}
                className={`w-7 h-7 rounded-full text-xs font-bold transition-all duration-150
                  ${
                    isCurrent
                      ? "ring-2 ring-primary ring-offset-1 bg-primary text-primary-foreground"
                      : checked
                        ? "bg-accent/80 text-accent-foreground"
                        : answered
                          ? "bg-accent/40 text-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/60"
                  }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleCheckOrNext}
          disabled={
            submitMutation.isPending || (!hasAnswerEntered && !isChecked)
          }
          className="gap-2"
          data-ocid={
            isChecked
              ? isLast
                ? "test.submit_button"
                : "test.next_button"
              : "test.check_button"
          }
        >
          {submitMutation.isPending ? (
            <span data-ocid="test.loading_state">Submitting…</span>
          ) : isChecked ? (
            correct ? null : isLast ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Submit Test
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Check Answer
            </>
          )}
        </Button>
      </div>

      {/* End Test confirmation dialog */}
      <Dialog open={endTestDialogOpen} onOpenChange={setEndTestDialogOpen}>
        <DialogContent data-ocid="test.end_test.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">End test early?</DialogTitle>
            <DialogDescription>
              Your progress so far will be submitted. Unanswered questions will
              be marked as incorrect. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setEndTestDialogOpen(false)}
              data-ocid="test.end_test.cancel_button"
            >
              Keep going
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setEndTestDialogOpen(false);
                submitMutation.mutate();
              }}
              disabled={submitMutation.isPending}
              data-ocid="test.end_test.confirm_button"
            >
              {submitMutation.isPending ? "Submitting…" : "End & Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
