import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlignLeft,
  ArrowLeft,
  BookOpen,
  Image,
  Layers,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import type { QuestionFormData } from "../../components/QuestionForm";
import {
  QuestionForm,
  defaultQuestionFormData,
} from "../../components/QuestionForm";
import {
  QUESTION_TYPE_LABELS,
  QuestionTypeIcon,
} from "../../components/QuestionTypeIcon";
import { RichTextDisplay } from "../../components/RichTextDisplay";
import { SectionDeleteDialog } from "../../components/SectionDeleteDialog";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import type { Question, Section, Test } from "../../types";

interface SectionFormState {
  name: string;
  description: string;
}

function defaultSectionForm(): SectionFormState {
  return { name: "", description: "" };
}

export function AdminTestDetailPage() {
  const { testId } = useParams({ from: "/admin/tests/$testId" });
  const { session } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const username = session?.username ?? "";

  // Question state
  const [questionModal, setQuestionModal] = useState<"create" | "edit" | null>(
    null,
  );
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [deleteQuestion, setDeleteQuestion] = useState<Question | null>(null);
  const [form, setForm] = useState<QuestionFormData>(defaultQuestionFormData());
  const [uploadProgress, setUploadProgress] = useState(0);

  // Section state
  const [sectionModal, setSectionModal] = useState<"create" | "edit" | null>(
    null,
  );
  const [editSection, setEditSection] = useState<Section | null>(null);
  const [deleteSectionTarget, setDeleteSectionTarget] =
    useState<Section | null>(null);
  const [sectionForm, setSectionForm] = useState<SectionFormState>(
    defaultSectionForm(),
  );
  // Drill-down: null = section list view, Section = show that section's questions
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const testIdBig = BigInt(testId);

  const { data: test } = useQuery<Test | null>({
    queryKey: ["test", testId],
    queryFn: async () => {
      if (!backend) return null;
      return backend.getTest(testIdBig);
    },
    enabled: !!backend,
  });

  const { data: questions = [], isLoading: questionsLoading } = useQuery<
    Question[]
  >({
    queryKey: ["questions", testId],
    queryFn: async () => {
      if (!backend) return [];
      return backend.listQuestionsForTest(testIdBig);
    },
    enabled: !!backend,
  });

  const { data: sections = [], isLoading: sectionsLoading } = useQuery<
    Section[]
  >({
    queryKey: ["sections", testId],
    queryFn: async () => {
      if (!backend) return [];
      return backend.listSectionsForTest(testIdBig);
    },
    enabled: !!backend,
  });

  // ── Section mutations ────────────────────────────────────────────────────────

  const createSectionMutation = useMutation({
    mutationFn: async () => {
      if (!backend) throw new Error("Not connected");
      return backend.createSection(username, testIdBig, {
        name: sectionForm.name.trim(),
        description: sectionForm.description.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", testId] });
      toast.success("Section created");
      setSectionModal(null);
      setSectionForm(defaultSectionForm());
    },
    onError: () => toast.error("Failed to create section"),
  });

  const updateSectionMutation = useMutation({
    mutationFn: async () => {
      if (!backend || !editSection) throw new Error("Not connected");
      return backend.updateSection(username, editSection.id, {
        name: sectionForm.name.trim(),
        description: sectionForm.description.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", testId] });
      toast.success("Section updated");
      setSectionModal(null);
      setEditSection(null);
      setSectionForm(defaultSectionForm());
    },
    onError: () => toast.error("Failed to update section"),
  });

  const deleteSectionMutation = useMutation({
    mutationFn: async (sectionId: bigint) => {
      if (!backend) throw new Error("Not connected");
      return backend.deleteSection(username, sectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", testId] });
      queryClient.invalidateQueries({ queryKey: ["questions", testId] });
      toast.success("Section deleted");
      setDeleteSectionTarget(null);
    },
    onError: () => toast.error("Failed to delete section"),
  });

  // ── Question mutations ───────────────────────────────────────────────────────

  async function buildBlob(): Promise<ExternalBlob | undefined> {
    if (!form.imageFile) return undefined;
    const bytes = new Uint8Array(await form.imageFile.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes);
    return blob.withUploadProgress((p) => setUploadProgress(p));
  }

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!backend) throw new Error("Not connected");
      const imageBlob = await buildBlob();
      return backend.addQuestion(username, testIdBig, {
        text: form.text,
        questionType: form.questionType,
        options: form.options.filter((o) => o.trim()),
        correctAnswers: form.correctAnswers.map(BigInt),
        correctText: form.correctText,
        correctOrder: form.correctOrder.map(BigInt),
        imageBlob,
        sectionId: form.sectionId !== null ? BigInt(form.sectionId) : undefined,
        explanation: form.explanation || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", testId] });
      toast.success("Question added");
      setQuestionModal(null);
      setUploadProgress(0);
    },
    onError: () => {
      toast.error("Failed to add question");
      setUploadProgress(0);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!backend || !editQuestion) throw new Error("Not connected");
      const imageBlob = await buildBlob();
      return backend.updateQuestion(username, editQuestion.id, {
        text: form.text,
        questionType: form.questionType,
        options: form.options.filter((o) => o.trim()),
        correctAnswers: form.correctAnswers.map(BigInt),
        correctText: form.correctText,
        correctOrder: form.correctOrder.map(BigInt),
        imageBlob,
        sectionId: form.sectionId !== null ? BigInt(form.sectionId) : undefined,
        explanation: form.explanation || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", testId] });
      toast.success("Question updated");
      setQuestionModal(null);
      setEditQuestion(null);
      setUploadProgress(0);
    },
    onError: () => {
      toast.error("Failed to update question");
      setUploadProgress(0);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (qId: bigint) => {
      if (!backend) throw new Error("Not connected");
      return backend.deleteQuestion(username, qId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", testId] });
      toast.success("Question deleted");
      setDeleteQuestion(null);
    },
    onError: () => toast.error("Failed to delete question"),
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function openCreate(preselectedSectionId?: number | null) {
    setForm(defaultQuestionFormData(preselectedSectionId ?? null));
    setEditQuestion(null);
    setQuestionModal("create");
  }

  function openEdit(q: Question) {
    const optCount = Math.max(q.options.length, 4);
    const opts = Array.from({ length: optCount }, (_, i) => q.options[i] ?? "");
    setForm({
      text: q.text,
      questionType: q.questionType,
      options: opts,
      correctAnswers: q.correctAnswers.map(Number),
      correctText: q.correctText,
      correctOrder:
        q.correctOrder.length > 0
          ? q.correctOrder.map(Number)
          : opts.map((_, i) => i),
      imageFile: null,
      imagePreviewUrl: q.imageBlob ? q.imageBlob.getDirectURL() : null,
      sectionId: q.sectionId != null ? Number(q.sectionId) : null,
      explanation: q.explanation ?? "",
      audioUrl: (q as Question & { audioUrl?: string }).audioUrl ?? "",
      audioStatus: (q as Question & { audioUrl?: string }).audioUrl
        ? "ready"
        : "idle",
      audioErrorMsg: "",
    });
    setEditQuestion(q);
    setQuestionModal("edit");
  }

  // Add question from drill-down: pre-select current section
  function openCreateInSection() {
    const sectionId =
      selectedSection && selectedSection.id !== BigInt(-1)
        ? Number(selectedSection.id)
        : null;
    openCreate(sectionId);
  }

  function openCreateSection() {
    setSectionForm(defaultSectionForm());
    setEditSection(null);
    setSectionModal("create");
  }

  function openEditSection(s: Section) {
    setSectionForm({ name: s.name, description: s.description });
    setEditSection(s);
    setSectionModal("edit");
  }

  async function handleDownloadAudio(
    url: string,
  ): Promise<{ success: boolean; error?: string }> {
    if (!backend) return { success: false, error: "Not connected" };

    // When creating a new question, there is no question ID yet.
    // The audio URL will be downloaded and stored when the question is saved.
    // Just mark it ready so the user can proceed without a confusing error.
    if (!editQuestion) {
      return { success: true };
    }

    try {
      const result = await backend.downloadAudio(
        username,
        editQuestion.id,
        url,
      );
      if (result.__kind__ === "ok") return { success: true };
      return { success: false, error: result.err };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  function getQuestionCountForSection(sId: bigint): number {
    return questions.filter((q) => q.sectionId === sId).length;
  }

  function getUncategorisedCount(): number {
    return questions.filter((q) => q.sectionId == null).length;
  }

  const sortedQuestions = [...questions].sort(
    (a, b) => Number(a.orderIndex) - Number(b.orderIndex),
  );

  // Sentinel object for the virtual "Uncategorised" section (id = -1n)
  const UNCATEGORISED_SENTINEL: Section = {
    id: BigInt(-1),
    testId: testIdBig,
    name: "Uncategorised",
    description: "Questions not assigned to any section",
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
  };

  // Questions filtered to the selected section (drill-down view)
  // BigInt(-1) is the sentinel for the Uncategorised virtual section
  const sectionQuestions = selectedSection
    ? selectedSection.id === BigInt(-1)
      ? sortedQuestions.filter((q) => q.sectionId == null)
      : sortedQuestions.filter((q) => q.sectionId === selectedSection.id)
    : [];

  const sectionOptions = sections.map((s) => ({
    id: Number(s.id),
    name: s.name,
  }));
  // sectionOptions uses Number() for the QuestionForm component which expects number IDs

  const isLoading = questionsLoading || sectionsLoading;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/admin"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-fast"
          data-ocid="admin.detail.back.link"
        >
          <ArrowLeft className="w-4 h-4" />
          My Tests
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">
          {test?.name ?? "Loading\u2026"}
        </span>
      </div>

      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          {test ? (
            <>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {test.name}
              </h1>
              {test.description && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {test.description}
                </p>
              )}
            </>
          ) : (
            <Skeleton className="h-7 w-48" />
          )}
          <p className="text-sm text-muted-foreground mt-1.5">
            <span className="font-semibold text-foreground">
              {questions.length}
            </span>{" "}
            question{questions.length !== 1 ? "s" : ""}
            {sections.length > 0 && (
              <>
                {" \u00b7 "}
                <span className="font-semibold text-foreground">
                  {sections.length}
                </span>{" "}
                section{sections.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>
        <Button
          onClick={() =>
            selectedSection ? openCreateInSection() : openCreate()
          }
          className="gap-2"
          data-ocid="admin.question.add_button"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </Button>
      </div>

      {selectedSection ? (
        /* ── Section drill-down view ─────────────────────────────────── */
        <div data-ocid="admin.detail.section.drilldown.panel">
          {/* Section header with back button */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedSection(null)}
                data-ocid="admin.detail.section.back_button"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sections
              </Button>
              <span className="text-muted-foreground">/</span>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h2 className="font-display font-semibold text-foreground">
                  {selectedSection.name}
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {sectionQuestions.length} question
                  {sectionQuestions.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>
            {/* Hide edit/delete buttons for the virtual Uncategorised sentinel */}
            {selectedSection.id !== BigInt(-1) && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => openEditSection(selectedSection)}
                  aria-label="Edit section"
                  data-ocid="admin.detail.section.drilldown.edit_button"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setDeleteSectionTarget(selectedSection)}
                  aria-label="Delete section"
                  data-ocid="admin.detail.section.drilldown.delete_button"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>

          {selectedSection.description && (
            <p className="text-sm text-muted-foreground mb-5 -mt-2">
              {selectedSection.description}
            </p>
          )}

          {/* Sticky Add Question button */}
          <div className="sticky top-[4.5rem] z-20 mb-4 flex justify-end">
            <Button
              onClick={openCreateInSection}
              size="sm"
              className="gap-2 shadow-md"
              data-ocid="admin.detail.section.drilldown.add_question.button"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </div>

          {/* Questions for this section */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : sectionQuestions.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-xl border border-dashed border-border"
              data-ocid="admin.detail.section.drilldown.empty_state"
            >
              <AlignLeft className="w-10 h-10 text-muted-foreground mb-3" />
              <h3 className="font-display font-semibold text-foreground mb-1">
                No questions in this section
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Add a question and assign it to this section
              </p>
              <Button
                variant="outline"
                onClick={openCreateInSection}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sectionQuestions.map((q, idx) => (
                <Card
                  key={String(q.id)}
                  className="shadow-subtle border-border"
                  data-ocid={`admin.detail.question.item.${idx + 1}`}
                >
                  <CardHeader className="pb-3 pt-4">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <RichTextDisplay
                          html={q.text}
                          className="font-medium text-foreground line-clamp-2 text-sm"
                        />
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <QuestionTypeIcon type={q.questionType} />
                            {QUESTION_TYPE_LABELS[q.questionType]}
                          </Badge>
                          {q.imageBlob && (
                            <Badge variant="outline" className="gap-1 text-xs">
                              <Image className="w-3 h-3" />
                              Has image
                            </Badge>
                          )}
                          {q.options.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {q.options.length} option
                              {q.options.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(q)}
                          aria-label="Edit question"
                          data-ocid={`admin.detail.question.edit_button.${idx + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteQuestion(q)}
                          aria-label="Delete question"
                          data-ocid={`admin.detail.question.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── Default view: sections list only, NO questions ─────────── */
        <div
          className="rounded-xl border border-border bg-card shadow-subtle"
          data-ocid="admin.detail.sections.panel"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <h2 className="font-display font-semibold text-foreground text-sm">
                Sections
              </h2>
              <span className="text-xs text-muted-foreground">
                ({sections.length})
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-8"
              onClick={openCreateSection}
              data-ocid="admin.section.add_button"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Section
            </Button>
          </div>

          {sectionsLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : sections.length === 0 && getUncategorisedCount() === 0 ? (
            <div
              className="flex flex-col items-center gap-2 py-8 text-center"
              data-ocid="admin.detail.sections.empty_state"
            >
              <BookOpen className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No sections yet. Add sections to organise your questions.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {[
                ...sections,
                ...(getUncategorisedCount() > 0
                  ? [UNCATEGORISED_SENTINEL]
                  : []),
              ].map((s, idx) => {
                const isUncategorised = s.id === BigInt(-1);
                const qCount = isUncategorised
                  ? getUncategorisedCount()
                  : getQuestionCountForSection(s.id);
                return (
                  <li
                    key={String(s.id)}
                    className="flex items-center gap-3 px-5 py-3 group"
                    data-ocid={`admin.detail.section.item.${idx + 1}`}
                  >
                    <button
                      type="button"
                      className="flex-1 min-w-0 text-left cursor-pointer"
                      onClick={() => setSelectedSection(s)}
                      data-ocid={`admin.detail.section.open_button.${idx + 1}`}
                    >
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {s.name}
                      </p>
                      {s.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {s.description}
                        </p>
                      )}
                    </button>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {qCount} question{qCount !== 1 ? "s" : ""}
                    </Badge>
                    {!isUncategorised && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                          onClick={() => openEditSection(s)}
                          aria-label="Edit section"
                          data-ocid={`admin.section.edit_button.${idx + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => setDeleteSectionTarget(s)}
                          aria-label="Delete section"
                          data-ocid={`admin.section.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Section Form Dialog */}
      <Dialog
        open={!!sectionModal}
        onOpenChange={(o) => {
          if (!o) {
            setSectionModal(null);
            setEditSection(null);
            setSectionForm(defaultSectionForm());
          }
        }}
      >
        <DialogContent data-ocid="admin.section_form.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {sectionModal === "create" ? "Add Section" : "Edit Section"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="section-name">Name</Label>
              <Input
                id="section-name"
                value={sectionForm.name}
                onChange={(e) =>
                  setSectionForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Chapter 1"
                data-ocid="admin.section.name_input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section-desc">
                Description
                <span className="text-muted-foreground font-normal text-xs ml-1">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="section-desc"
                value={sectionForm.description}
                onChange={(e) =>
                  setSectionForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="A short description of this section"
                rows={2}
                data-ocid="admin.section_form.description.textarea"
              />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setSectionModal(null);
                setEditSection(null);
                setSectionForm(defaultSectionForm());
              }}
              data-ocid="admin.section.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                sectionModal === "create"
                  ? createSectionMutation.mutate()
                  : updateSectionMutation.mutate()
              }
              disabled={
                !sectionForm.name.trim() ||
                createSectionMutation.isPending ||
                updateSectionMutation.isPending
              }
              data-ocid="admin.section.save_button"
            >
              {createSectionMutation.isPending ||
              updateSectionMutation.isPending
                ? "Saving\u2026"
                : sectionModal === "create"
                  ? "Add Section"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Section Confirm */}
      <SectionDeleteDialog
        open={!!deleteSectionTarget}
        onOpenChange={(o) => !o && setDeleteSectionTarget(null)}
        sectionName={deleteSectionTarget?.name ?? ""}
        questionCount={
          deleteSectionTarget
            ? getQuestionCountForSection(deleteSectionTarget.id)
            : 0
        }
        isPending={deleteSectionMutation.isPending}
        onConfirm={() =>
          deleteSectionTarget &&
          deleteSectionMutation.mutate(deleteSectionTarget.id)
        }
      />

      {/* Question Form Dialog */}
      <Dialog
        open={!!questionModal}
        onOpenChange={(o) => {
          if (!o) {
            setQuestionModal(null);
            setEditQuestion(null);
          }
        }}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.question.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {questionModal === "create" ? "Add Question" : "Edit Question"}
            </DialogTitle>
          </DialogHeader>
          <QuestionForm
            data={form}
            onChange={setForm}
            uploadProgress={uploadProgress}
            sections={sectionOptions}
            onDownloadAudio={handleDownloadAudio}
          />
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setQuestionModal(null);
                setEditQuestion(null);
              }}
              data-ocid="admin.question.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                questionModal === "create"
                  ? createMutation.mutate()
                  : updateMutation.mutate()
              }
              disabled={
                !form.text.trim() ||
                createMutation.isPending ||
                updateMutation.isPending ||
                form.audioStatus === "downloading"
              }
              data-ocid="admin.question.submit_button"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving\u2026"
                : questionModal === "create"
                  ? "Add Question"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Question Confirm */}
      <ConfirmDialog
        open={!!deleteQuestion}
        onOpenChange={(o) => !o && setDeleteQuestion(null)}
        title="Delete Question?"
        description="This will permanently delete this question. This action cannot be undone."
        confirmLabel="Delete Question"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() =>
          deleteQuestion && deleteMutation.mutate(deleteQuestion.id)
        }
        ocidPrefix="admin.delete_question"
      />
    </div>
  );
}
