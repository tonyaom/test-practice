import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const CONFIRM_PHRASE = "I want to delete";

interface SectionDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionName: string;
  questionCount: number;
  isPending: boolean;
  onConfirm: () => void;
}

export function SectionDeleteDialog({
  open,
  onOpenChange,
  sectionName,
  questionCount,
  isPending,
  onConfirm,
}: SectionDeleteDialogProps) {
  const [phrase, setPhrase] = useState("");
  const canDelete = phrase === CONFIRM_PHRASE;

  function handleOpenChange(next: boolean) {
    if (!next) setPhrase("");
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-ocid="admin.section_delete.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">Delete Section?</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <p className="text-sm text-muted-foreground">
            You are about to permanently delete{" "}
            <span className="font-semibold text-foreground">{sectionName}</span>
            .
            {questionCount > 0 && (
              <>
                {" "}
                This will also delete{" "}
                <span className="font-semibold text-destructive">
                  {questionCount} question{questionCount !== 1 ? "s" : ""}
                </span>{" "}
                inside it.
              </>
            )}
          </p>
          <div className="space-y-1.5">
            <Label className="text-sm">
              Type{" "}
              <span className="font-mono font-semibold text-destructive">
                {CONFIRM_PHRASE}
              </span>{" "}
              to confirm:
            </Label>
            <Input
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              autoComplete="off"
              data-ocid="admin.section.delete_confirm_input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
            data-ocid="admin.section_delete.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={!canDelete || isPending}
            data-ocid="admin.section.delete_confirm_button"
          >
            {isPending ? "Deleting…" : "Delete Section"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
