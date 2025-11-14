import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="fixed top-0">
      <nav className="flex gap-4 p-4">
        <Link href="/">
          <Image
            className="rounded-full"
            width={50}
            height={50}
            alt="Wordle logo"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAk1BMVEX///8AAABqqmTRsDbw8PDb29sRERFimVxqpGSrq6v29vYBAAMeHh4TGBJztW1srmbp6elRek7XtTchHAjhvjoZFw4/ZjyIiIhDYkDevD5+ayF0ZSrU1NSWlpZfX183NzdycnIgMB5KSkrCwsJ6enpnZ2cmJiaPeiiGcSNLPxQsQys6VTgeHA8WHRVUgVDtyUJdjFlnAg0NAAABnUlEQVRoge2Y21LCQAxAm1p6WegFRAoI5Y6IqP3/rzNbHSGLdpcVh0FzHjPZM51tmkzjOAzDMIyGrHEymaE6moMFk7GBWhQ26krvaeVTWzfade4FJq0ycUgDoOWQiHDGAEsS83I8qLuZFUChhCq5QiWnoH0iat1iDTCyk3v46PU14/nHGd/IczXWAmiw/ErlOctZ/vtytednX8uP+quRfBxR8IPxlVCE46pQY76J/AdcWL7MKUu8lofNZnjII8C2T3kykn/xQnfdDmEwBGgnKSF5tizF2+4NoSPlqUtI43PJ769CPmI5y1l+ffIXK7nacmVveR0QuigvEwUjeUsFp8DujoJpfqxw+TEHTYo85VfQWPM4Ty8vA0oJEIcV+1gfoKekBUZ3HtLZmAZNiJP3gvikJ0uRYFgtoVJie/k+1rOtc5aznOV/UO5q/4nEBLsiPWUqD0G3hpKbv5lLjpnJ03QLMK93y2kMszI8RPZzN6RgP2+TQIBuiDRyuaaxRd0ZntO+qt8qftzMdO2fzLpYGKglwjsZk6dmGIb557wBiNNKFXEoKOgAAAAASUVORK5CYII="
          />
        </Link>
      </nav>
    </header>
  );
};
