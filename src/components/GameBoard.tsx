import React from "react";
import { Row } from ".";
export const GameBoard = () => {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(6)].map((_, i) => (
        <Row index={i} key={i} />
      ))}
    </div>
  );
};
