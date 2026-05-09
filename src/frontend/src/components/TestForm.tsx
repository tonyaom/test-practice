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
import { Textarea } from "@/components/ui/textarea";

export interface TestFormData {
  name: string;
  description: string;
}

interface TestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: TestFormData;
  onChange: (data: TestFormData) => void;
  onSubmit: () => void;
  isPending: boolean;
  submitLabel: string;
  ocidPrefix?: string;
}

export function TestFormDialog({
  open,
  onOpenChange,
  title,
  data,
  onChange,
  onSubmit,
  isPending,
  submitLabel,
  ocidPrefix = "test_form",
}: TestFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid={`${ocidPrefix}.dialog`}>
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor={`${ocidPrefix}-name`}>Test Name</Label>
            <Input
              id={`${ocidPrefix}-name`}
              value={data.name}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              placeholder="e.g. Biology Chapter 5"
              data-ocid={`${ocidPrefix}.name_input`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${ocidPrefix}-desc`}>Description</Label>
            <Textarea
              id={`${ocidPrefix}-desc`}
              value={data.description}
              onChange={(e) =>
                onChange({ ...data, description: e.target.value })
              }
              placeholder="Brief description of the test…"
              rows={3}
              data-ocid={`${ocidPrefix}.description_input`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            data-ocid={`${ocidPrefix}.cancel_button`}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!data.name.trim() || isPending}
            data-ocid={`${ocidPrefix}.submit_button`}
          >
            {isPending ? "Saving…" : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
