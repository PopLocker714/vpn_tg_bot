import { ExitResponseStatus, ExitResultError, ExitResultSuccess } from "@/lib/botApi/types";
import { Api } from "@effect-ak/tg-bot-client";

export function isExitResultSuccess<M extends keyof Api>(
  res: ExitResultError | ExitResultSuccess<M>
): res is ExitResultSuccess<M> {
  return res.status === ExitResponseStatus.SUCCESS;
}

export function isExitResultError<M extends keyof Api>(
  res: ExitResultError | ExitResultSuccess<M>
): res is ExitResultError {
  return res.status === ExitResponseStatus.ERROR;
}
