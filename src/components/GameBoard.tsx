import { Row } from ".";
export const GameBoard = () => {
  return (
    <div className="flex items-center w-full max-w-sm mx-auto flex-col gap-2">
      {[...Array(6)].map((_, i) => (
        <Row index={i} key={i} />
      ))}
    </div>
  );
};
