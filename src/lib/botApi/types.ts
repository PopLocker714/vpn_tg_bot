import { Api, TgBotClientError } from "@effect-ak/tg-bot-client";
import { Exit } from "effect/index";

export enum ExitResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
}

interface ExitResult {
  status: ExitResponseStatus;
}

export interface ExitResultSuccess<M extends keyof Api> extends ExitResult {
  data: ReturnType<Api[M]>;
}

export interface ExitResultError extends ExitResult {
  message: string;
  code?: number;
  tag?: string;
}

export type TGetCauseResultReturn<M extends keyof Api> = ExitResultSuccess<M> | ExitResultError;
export type TGetCauseResultParam<M extends keyof Api> = Exit.Exit<
  ReturnType<Api[M]>,
  TgBotClientError
>;
