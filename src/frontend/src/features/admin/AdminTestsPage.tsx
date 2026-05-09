import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  ClipboardList,
  HardDrive,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import type { TestFormData } from "../../components/TestForm";
import { TestFormDialog } from "../../components/TestForm";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import type { Test } from "../../types";
import { clearAllCache } from "../../utils/offlineCache";

export function AdminTestsPage() {
  const { session } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const username = session?.username ?? "";

  const [createOpen, setCreateOpen] = useState(false);
  const [editTest, setEditTest] = useState<Test | null>(null);
  const [deleteTest, setDeleteTest] = useState<Test | null>(null);
  const [createForm, setCreateForm] = useState<TestFormData>({
    name: "",
    description: "",
  });
  const [editForm, setEditForm] = useState<TestFormData>({
    name: "",
    description: "",
  });

  const { data: tests = [], isLoading } = useQuery<Test[]>({
    queryKey: ["tests"],
    queryFn: async () => {
      if (!backend) return [];
      return backend.listTests();
    },
    enabled: !!backend,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!backend) throw new Error("Not connected");
      return backend.createTest(username, {
        name: createForm.name,
        description: createForm.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      toast.success("Test created successfully");
      setCreateOpen(false);
      setCreateForm({ name: "", description: "" });
    },
    onError: () => toast.error("Failed to create test"),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!backend || !editTest) throw new Error("Not connected");
      return backend.updateTest(username, editTest.id, {
        name: editForm.name,
        description: editForm.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      toast.success("Test updated successfully");
      setEditTest(null);
    },
    onError: () => toast.error("Failed to update test"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (testId: bigint) => {
      if (!backend) throw new Error("Not connected");
      return backend.deleteTest(username, testId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      toast.success("Test deleted");
      setDeleteTest(null);
    },
    onError: () => toast.error("Failed to delete test"),
  });

  function openCreate() {
    setCreateForm({ name: "", description: "" });
    setCreateOpen(true);
  }

  function openEdit(test: Test) {
    setEditForm({ name: test.name, description: test.description });
    setEditTest(test);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            My Tests
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create and manage your practice tests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearAllCache();
              toast.success("Local cache cleared");
            }}
            className="gap-1.5 text-muted-foreground"
            data-ocid="admin.tests.clear_cache_button"
          >
            <HardDrive className="w-4 h-4" />
            Clear Cache
          </Button>
          <Link to="/admin/users">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              data-ocid="admin.tests.view_users_button"
            >
              <Users className="w-4 h-4" />
              Users
            </Button>
          </Link>
          <Button
            onClick={openCreate}
            className="gap-2"
            data-ocid="admin.create_test.open_modal_button"
          >
            <Plus className="w-4 h-4" />
            New Test
          </Button>
        </div>
      </div>

      {/* Tests Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-subtle">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tests.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="admin.tests.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-lg text-foreground mb-2">
            No tests yet
          </h3>
          <p className="text-muted-foreground max-w-sm mb-6 text-sm">
            Create your first test to get started. Add questions and share with
            students.
          </p>
          <Button
            onClick={openCreate}
            className="gap-2"
            data-ocid="admin.tests.empty_cta.button"
          >
            <Plus className="w-4 h-4" />
            Create First Test
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test, idx) => (
            <Card
              key={String(test.id)}
              className="shadow-subtle hover:shadow-md transition-smooth group border-border"
              data-ocid={`admin.tests.item.${idx + 1}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-display text-base line-clamp-2 min-w-0">
                    {test.name}
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    Test
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 text-xs">
                  {test.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0">
                <Link
                  to="/admin/tests/$testId"
                  params={{ testId: String(test.id) }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
                    data-ocid={`admin.tests.manage.${idx + 1}`}
                  >
                    Manage
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => openEdit(test)}
                    aria-label="Edit test"
                    data-ocid={`admin.tests.edit_button.${idx + 1}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteTest(test)}
                    aria-label="Delete test"
                    data-ocid={`admin.tests.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <TestFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create New Test"
        data={createForm}
        onChange={setCreateForm}
        onSubmit={() => createMutation.mutate()}
        isPending={createMutation.isPending}
        submitLabel="Create Test"
        ocidPrefix="admin.create_test"
      />

      {/* Edit Dialog */}
      <TestFormDialog
        open={!!editTest}
        onOpenChange={(o) => !o && setEditTest(null)}
        title="Edit Test"
        data={editForm}
        onChange={setEditForm}
        onSubmit={() => updateMutation.mutate()}
        isPending={updateMutation.isPending}
        submitLabel="Save Changes"
        ocidPrefix="admin.edit_test"
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTest}
        onOpenChange={(o) => !o && setDeleteTest(null)}
        title="Delete Test?"
        description={
          <span>
            This will permanently delete{" "}
            <strong className="text-foreground">"{deleteTest?.name}"</strong>{" "}
            and all its questions. This action cannot be undone.
          </span>
        }
        confirmLabel="Delete Test"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteTest && deleteMutation.mutate(deleteTest.id)}
        ocidPrefix="admin.delete_test"
      />
    </div>
  );
}
