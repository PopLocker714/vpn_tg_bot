import {
  ExitResponseStatus,
  TGetCauseResultReturn,
} from "@/lib/botApi/types";
import { Api } from "@effect-ak/tg-bot-client";

export default <M extends keyof Api>(error: any): TGetCauseResultReturn<M> => {
  console.error(error);
  if (error instanceof Error) {
    return {
      status: ExitResponseStatus.ERROR,
      message: error.message,
    };
  }
  return {
    status: ExitResponseStatus.ERROR,
    message: "Unknown error",
  };
};
