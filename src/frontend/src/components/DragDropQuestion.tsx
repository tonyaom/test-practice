import { RichTextDisplay } from "@/components/RichTextDisplay";
import { GripVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DragDropQuestionProps {
  items: string[];
  order: number[];
  onChange: (newOrder: number[]) => void;
}

const DRAG_HINT_KEY = "dragHintSeen";

export function DragDropQuestion({
  items,
  order,
  onChange,
}: DragDropQuestionProps) {
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  // Touch drag state
  const touchDragIdxRef = useRef<number | null>(null);
  const touchStartYRef = useRef(0);

  // Show mobile hint once
  const [showHint, setShowHint] = useState(() => {
    try {
      return !localStorage.getItem(DRAG_HINT_KEY);
    } catch {
      return false;
    }
  });

  function dismissHint() {
    setShowHint(false);
    try {
      localStorage.setItem(DRAG_HINT_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  // Sync order when items change
  useEffect(() => {
    if (order.length !== items.length) {
      onChange(items.map((_, i) => i));
    }
  }, [items, order.length, onChange]);

  const displayOrder =
    order.length === items.length ? order : items.map((_, i) => i);

  // Desktop drag handlers
  function handleDragStart(
    e: React.DragEvent<HTMLDivElement>,
    listIdx: number,
  ) {
    setDraggingIdx(listIdx);
    e.dataTransfer.effectAllowed = "move";
    dragNodeRef.current = e.currentTarget;
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>, listIdx: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIdx(listIdx);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, dropListIdx: number) {
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

  // Touch drag handlers for mobile
  function handleTouchStart(
    e: React.TouchEvent<HTMLDivElement>,
    listIdx: number,
  ) {
    touchDragIdxRef.current = listIdx;
    touchStartYRef.current = e.touches[0].clientY;
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    e.preventDefault();
    const y = e.touches[0].clientY;
    const items = document.querySelectorAll<HTMLDivElement>("[data-drag-item]");
    let targetIdx: number | null = null;
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect();
      if (y >= rect.top && y <= rect.bottom) {
        targetIdx = i;
        break;
      }
    }
    if (targetIdx !== null) setOverIdx(targetIdx);
  }

  function handleTouchEnd() {
    const from = touchDragIdxRef.current;
    const to = overIdx;
    if (from !== null && to !== null && from !== to) {
      const newOrder = [...displayOrder];
      const [moved] = newOrder.splice(from, 1);
      newOrder.splice(to, 0, moved);
      onChange(newOrder);
    }
    touchDragIdxRef.current = null;
    setDraggingIdx(null);
    setOverIdx(null);
  }

  return (
    <div className="space-y-2" data-ocid="drag_drop.list">
      <p className="text-sm text-muted-foreground mb-3">
        Drag items to arrange them in the correct order.
      </p>
      {/* Mobile hint */}
      {showHint && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground mb-2 sm:hidden">
          <span>Press and hold to drag items on mobile</span>
          <button
            type="button"
            onClick={dismissHint}
            className="ml-auto shrink-0 hover:text-foreground transition-colors"
          >
            ×
          </button>
        </div>
      )}
      {displayOrder.map((itemIdx, listIdx) => {
        const isDragging =
          draggingIdx === listIdx || touchDragIdxRef.current === listIdx;
        const isOver =
          overIdx === listIdx &&
          draggingIdx !== listIdx &&
          touchDragIdxRef.current !== listIdx;
        return (
          <div
            key={`drag-item-${itemIdx}`}
            data-drag-item
            draggable
            onDragStart={(e) => handleDragStart(e, listIdx)}
            onDragOver={(e) => handleDragOver(e, listIdx)}
            onDrop={(e) => handleDrop(e, listIdx)}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(e, listIdx)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            data-ocid={`drag_drop.item.${listIdx + 1}`}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg border cursor-grab active:cursor-grabbing
              bg-card select-none transition-all duration-150
              ${isDragging ? "opacity-40 scale-95 border-primary/40" : ""}
              ${isOver ? "border-accent bg-accent/5 shadow-md -translate-y-0.5" : "border-border hover:border-primary/30 hover:shadow-subtle"}
            `}
          >
            <GripVertical
              className="w-4 h-4 text-muted-foreground shrink-0"
              aria-hidden="true"
            />
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
              {listIdx + 1}
            </span>
            <span className="text-sm font-medium text-foreground min-w-0">
              <RichTextDisplay html={items[itemIdx]} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
