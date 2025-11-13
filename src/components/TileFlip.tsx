import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Tile } from "./Tile";
import { LetterStatus } from "@/types";
import { getBackgroundColor } from "@/utils";

export const TileFlip = ({
  letter,
  status,
  index,
}: {
  letter: string;
  status: LetterStatus;
  index: number;
}) => {
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
      onAnimationComplete={() => setShowColor(true)}
      onUpdate={(latest) => {
        if ((latest.rotateX as number) >= 90 && !showColor) {
          setShowColor(true);
          console.log(status);
          tileRef.current?.classList.add(getBackgroundColor(status));
          flipRef.current?.classList.add(getBackgroundColor(status));
          flipRef.current?.classList.add("scale-y-[-1]");
        }
      }}
    >
      <div ref={flipRef} className={"tile-container"}>
        <Tile ref={tileRef} letter={letter} status={status} />
      </div>
    </motion.div>
  );
};
