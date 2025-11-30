import React, { useState } from "react";
import { Calendar } from "./";
import { Button, DialogFooter } from "./ui";

interface PastPuzzlesModalProps {
  defaultDate?: Date;
  onSubmit: (date: Date) => void;
}

export const PastPuzzlesModal = ({
  onSubmit,
  defaultDate = new Date(),
}: PastPuzzlesModalProps) => {
  const [date, setDate] = useState(defaultDate);

  return (
    <div>
      <Calendar onDateSelect={(d) => setDate(d)} selectedDate={date} />
      <DialogFooter>
        <Button onClick={() => onSubmit(date)}>Done</Button>
      </DialogFooter>
    </div>
  );
};
