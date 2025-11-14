import { JSX, useEffect, useState } from "react";

export const Celebration = ({ onPlayAgain }: { onPlayAgain: () => void }) => {
  const [confetti, setConfetti] = useState<JSX.Element[]>([]);
  useEffect(() => {
    // Create confetti elements
    const colors = ["#54cbe2", "#c893fb", "#f59e0b", "#16a34a", "#ec4899"];
    const confettiCount = 100;
    const newConfetti: JSX.Element[] = [];

    for (let i = 0; i < confettiCount; i++) {
      const left = `${Math.random() * 100}%`;
      const width = `${Math.random() * 10 + 5}px`;
      const height = `${Math.random() * 10 + 5}px`;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const animationDuration = `${Math.random() * 3 + 2}s`;
      const animationDelay = `${Math.random() * 2}s`;

      newConfetti.push(
        <div
          key={i}
          style={{
            position: "absolute",
            left,
            top: "-20px",
            width,
            height,
            backgroundColor: color,
            borderRadius: "50%",
            animation: `confettiDrop ${animationDuration} ease-in ${animationDelay} forwards`,
          }}
        />
      );
    }
  }, []);

  return (
    <div className="rank-up-celebration">
      <div className="confetti">{confetti}</div>

      <p className="celebration-message">Great Job! You won!</p>

      <div className="celebration-actions">
        <button onClick={onPlayAgain} className="btn btn-primary">
          Play Again
        </button>
      </div>
    </div>
  );
};
