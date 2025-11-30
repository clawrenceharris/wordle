"use client";
import { useModal, useMatch, useGame } from "@/context";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CreateMatchModal, Button, CalendarButton } from "@/components";

export const WordleHeader = () => {
  const { startMatch, isLoading, match, leaveMatch } = useMatch();
  const { date, game, changeDate, isGameOver } = useGame();
  const { openModal, closeModal } = useModal();

  const handleSubmit = async (code?: string) => {
    const match = await startMatch(code);
    if (match) closeModal();
  };
  const handleEndMatch = async (code: string) => {
    await leaveMatch(code);
    closeModal();
  };

  const handleOpenModal = () => {
    openModal({
      title: "Play with a Friend!",
      description:
        "Get a new code or enter an existing one to start a match with a friend!",
      showsSubmitButton: false,
      children: (
        <CreateMatchModal onEndMatch={handleEndMatch} onSubmit={handleSubmit} />
      ),
    });
  };

  return (
    <header className="sticky top-0 p-5 border-b border-b-muted-foreground flex items-center justify-between w-full">
      <Link href="/">
        <Image
          className="rounded-full"
          width={50}
          height={50}
          alt="Wordle logo"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAk1BMVEX///8AAABqqmTRsDbw8PDb29sRERFimVxqpGSrq6v29vYBAAMeHh4TGBJztW1srmbp6elRek7XtTchHAjhvjoZFw4/ZjyIiIhDYkDevD5+ayF0ZSrU1NSWlpZfX183NzdycnIgMB5KSkrCwsJ6enpnZ2cmJiaPeiiGcSNLPxQsQys6VTgeHA8WHRVUgVDtyUJdjFlnAg0NAAABnUlEQVRoge2Y21LCQAxAm1p6WegFRAoI5Y6IqP3/rzNbHSGLdpcVh0FzHjPZM51tmkzjOAzDMIyGrHEymaE6moMFk7GBWhQ26krvaeVTWzfade4FJq0ycUgDoOWQiHDGAEsS83I8qLuZFUChhCq5QiWnoH0iat1iDTCyk3v46PU14/nHGd/IczXWAmiw/ErlOctZ/vtytednX8uP+quRfBxR8IPxlVCE46pQY76J/AdcWL7MKUu8lofNZnjII8C2T3kykn/xQnfdDmEwBGgnKSF5tizF2+4NoSPlqUtI43PJ769CPmI5y1l+ffIXK7nacmVveR0QuigvEwUjeUsFp8DujoJpfqxw+TEHTYo85VfQWPM4Ty8vA0oJEIcV+1gfoKekBUZ3HtLZmAZNiJP3gvikJ0uRYFgtoVJie/k+1rOtc5aznOV/UO5q/4nEBLsiPWUqD0G3hpKbv5lLjpnJ03QLMK93y2kMszI8RPZzN6RgP2+TQIBuiDRyuaaxRd0ZntO+qt8qftzMdO2fzLpYGKglwjsZk6dmGIb557wBiNNKFXEoKOgAAAAASUVORK5CYII="
        />
      </Link>
      <h1 className="text-4xl font-bold">Wordle</h1>
      <div className="flex items-center gap-2">
        {game && (
          <CalendarButton showsDate={false} date={date} onChange={changeDate} />
        )}
        {!match ? (
          <Button variant="accent" onClick={handleOpenModal}>
            Play with a friend!
          </Button>
        ) : (
          <>
            {!isGameOver && (
              <Button
                variant="destructive"
                onClick={() => leaveMatch(match.code)}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Quit"}
              </Button>
            )}
            <Button
              className="bg-foreground/10"
              variant="ghost"
              onClick={handleOpenModal}
            >
              {!isGameOver ? match.code : "Match Ended"}
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
