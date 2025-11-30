import { useRef, useState } from "react";
import { motion, MotionProps } from "framer-motion";
import { Tile } from "./Tile";
import { LetterStatus } from "@/types";
import { getTileBackgroundColor } from "@/utils";

interface TileFlipProps extends MotionProps {
  letter?: string | null;
  status: LetterStatus;
  index: number;
}
export const TileFlip = ({
  letter,
  status,
  index,
  onAnimationComplete,
  ...props
}: TileFlipProps) => {
  const [showColor, setShowColor] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      className="transform-3d"
      style={{ perspective: 600 }}
      initial={{ rotateX: 0 }}
      animate={{ rotateX: 180 }}
      transition={{ delay: index * 0.2, duration: 0.6, ease: "easeInOut" }}
      onAnimationComplete={(def) => {
        setShowColor(true);
        onAnimationComplete?.(def);
      }}
      onUpdate={(latest) => {
        if ((latest.rotateX as number) >= 90 && !showColor) {
          setShowColor(true);
          tileRef.current?.classList.add(getTileBackgroundColor(status));
          flipRef.current?.classList.add(getTileBackgroundColor(status));
          flipRef.current?.classList.add("scale-y-[-1]");
        }
      }}
      {...props}
    >
      <div ref={flipRef} className={"tile-container"}>
        <Tile ref={tileRef} letter={letter} status={status} />
      </div>
    </motion.div>
  );
};
