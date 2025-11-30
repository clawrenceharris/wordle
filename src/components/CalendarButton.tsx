import React from "react";
import { Button } from "./ui";
import { Clock } from "lucide-react";
import { useModal } from "@/context";
import { PastPuzzlesModal } from "@/components";

interface CalendarButtonProps {
  date: Date;
  onChange: (date: Date) => void;
  showsDate?: boolean;
}
export const CalendarButton = ({
  date,
  onChange,
  showsDate = true,
}: CalendarButtonProps) => {
  const handleSubmit = (date: Date) => {
    onChange(date);
    closeModal();
  };
  const { openModal, closeModal } = useModal();

  const handleCalendarClick = () => {
    openModal({
      title: "Choose Past Puzzles",
      description: "Reverse time and play Wordle from previous puzzles",

      children: (
        <PastPuzzlesModal
          defaultDate={new Date(date)}
          onSubmit={handleSubmit}
        />
      ),
    });
  };
  return (
    <Button onClick={handleCalendarClick} variant="secondary">
      <Clock />
      {showsDate && date.toDateString()}
    </Button>
  );
};
