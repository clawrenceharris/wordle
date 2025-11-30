import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";

interface CalendarProps {
  className?: string;
  selectedDate: Date;
  onDateSelect?: (date: Date) => void;
  markedDates?: Date[];
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export const Calendar = ({
  className,
  selectedDate,
  onDateSelect,
  markedDates = [],
}: CalendarProps) => {
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // current date info
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // whether the currently viewed month is in the future
  const isFutureMonth =
    viewYear > currentYear ||
    (viewYear === currentYear && viewMonth > currentMonth);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    // prevent advancing into future months
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    const nextIsFuture =
      nextYear > currentYear ||
      (nextYear === currentYear && nextMonth > currentMonth);
    if (nextIsFuture) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    onDateSelect?.(newDate);
  };

  const isDateMarked = useCallback(
    (day: number) => {
      return markedDates.some(
        (date) =>
          date.getDate() === day &&
          date.getMonth() === viewMonth &&
          date.getFullYear() === viewYear
      );
    },
    [markedDates, viewMonth, viewYear]
  );

  const isSelected = useCallback(
    (day: number) => {
      return (
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === viewMonth &&
        selectedDate.getFullYear() === viewYear
      );
    },
    [selectedDate, viewMonth, viewYear]
  );
  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // disable next arrow when viewing current month or a future month
  const isNextDisabled =
    viewYear > currentYear ||
    (viewYear === currentYear && viewMonth >= currentMonth);

  return (
    <div className={cn("w-full max-w-md mx-auto p-4", className)}>
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-border hover:bg-muted transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2">
          <select
            value={viewMonth}
            onChange={(e) => setViewMonth(Number(e.target.value))}
            className="px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground font-medium hover:bg-muted transition-colors cursor-pointer"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={viewYear}
            onChange={(e) => setViewYear(Number(e.target.value))}
            className="px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground font-medium hover:bg-muted transition-colors cursor-pointer"
          >
            {Array.from({ length: 10 }, (_, i) => viewYear - 5 + i).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            )}
          </select>
        </div>

        <button
          onClick={handleNextMonth}
          disabled={isNextDisabled}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full border-2 border-border transition-colors",
            " hover:bg-muted",
            isNextDisabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {DAYS.map((day, i) => (
          <div
            key={i}
            className="text-center font-bold text-foreground text-sm py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => (
          <div key={index} className="aspect-square">
            {day ? (
              (() => {
                // determine if this specific day should be disabled:
                const dayDisabled =
                  // entire viewed month is in the future
                  isFutureMonth ||
                  // or the viewed month is this month/year but day is after today
                  (viewMonth === currentMonth &&
                    viewYear === currentYear &&
                    day > currentDay);

                return (
                  <button
                    disabled={dayDisabled}
                    onClick={() => !dayDisabled && handleDateClick(day)}
                    className={cn(
                      "w-full  h-full flex flex-col items-center justify-center rounded-md border-2 transition-all",
                      " hover:border-muted-foreground",
                      isDateMarked(day)
                        ? "bg-accent-500 border-accent-500 text-foreground font-bold"
                        : "border-tile-border ",
                      isSelected(day) &&
                        !isDateMarked(day) &&
                        "bg-accent-500 border-accent-500!",
                      dayDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span className="text-sm">{day}</span>
                  </button>
                );
              })()
            ) : (
              <div />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
