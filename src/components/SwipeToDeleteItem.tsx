import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SwipeToDeleteItemProps = {
  children: React.ReactNode;
  onDelete: () => void;
  deleteLabel: string;
  className?: string;
};

const REVEAL_WIDTH = 84;
const SWIPE_THRESHOLD = 36;

export function SwipeToDeleteItem({ children, onDelete, deleteLabel, className }: SwipeToDeleteItemProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);

  const handleStart = (clientX: number) => {
    startXRef.current = clientX;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (startXRef.current === null) return;

    const delta = clientX - startXRef.current;
    const next = Math.min(0, Math.max(-REVEAL_WIDTH, delta));
    setTranslateX(next);
  };

  const handleEnd = () => {
    setIsDragging(false);

    if (translateX <= -SWIPE_THRESHOLD) {
      setTranslateX(-REVEAL_WIDTH);
    } else {
      setTranslateX(0);
    }

    startXRef.current = null;
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <div className="absolute inset-y-0 right-0 flex w-[84px] items-center justify-center bg-destructive">
        <Button
          type="button"
          variant="ghost"
          className="h-full w-full rounded-none text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground"
          onClick={onDelete}
          aria-label={deleteLabel}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div
        className={cn("touch-pan-y", !isDragging && "transition-transform duration-200")}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={(event) => handleStart(event.touches[0].clientX)}
        onTouchMove={(event) => handleMove(event.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {children}
      </div>
    </div>
  );
}
