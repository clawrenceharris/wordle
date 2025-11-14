import { KeyStatus } from "../components";
import { LetterStatus } from "../types";

export function getStatusColor(status?: LetterStatus | KeyStatus) {
  console.log(status);
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
