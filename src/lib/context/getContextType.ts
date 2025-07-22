import { Update } from "@effect-ak/tg-bot-client";
import { ContextType } from "./types";

export default (update: Update): ContextType => {
  if (update.message) {
    return ContextType.MESSAGE;
  }

  if (update.callback_query) {
    return ContextType.CALLBACK_QUERY;
  }

  return ContextType.UNKNOWN;
};
