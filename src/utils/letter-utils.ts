import { KeyStatus } from "../components";
import { LetterStatus } from "../types";

export function getBackgroundColor(status?: LetterStatus | KeyStatus) {
  switch (status) {
    case "absent":
      return "bg-tile-absent";
    case "present":
      return "bg-tile-present";

    case "correct":
      return "bg-tile-correct";
    case "default":
      return "bg-key";
    default:
      return "bg-transparent";
  }
}

export function getBorderColor(status?: LetterStatus | KeyStatus) {
  switch (status) {
    case "absent":
      return "border-tile-absent";
    case "present":
      return "border-tile-present";

    case "correct":
      return "border-tile-correct";
    default:
      return "border-transparent";
  }
}
