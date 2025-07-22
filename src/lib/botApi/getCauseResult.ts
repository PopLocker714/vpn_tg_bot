import {
  ExitResponseStatus,
  TGetCauseResultParam,
  TGetCauseResultReturn,
} from "@/lib/botApi/types";
import { Api } from "@effect-ak/tg-bot-client";
import { Exit } from "effect/index";

export default <M extends keyof Api>(
  exitResult: TGetCauseResultParam<M>
): TGetCauseResultReturn<M> => {
  if (Exit.isSuccess(exitResult)) {
    return { status: ExitResponseStatus.SUCCESS, data: exitResult.value };
  } else {
    const error = exitResult.cause._tag;
    switch (error) {
      case "Die":
        console.error(error, exitResult.cause);
        return { status: ExitResponseStatus.ERROR, message: error };
      case "Empty":
        console.error(error, exitResult.cause);
        return { status: ExitResponseStatus.ERROR, message: error };
      case "Interrupt":
        console.error(error, error);
        return {
          status: ExitResponseStatus.ERROR,
          message: exitResult.cause.fiberId._tag,
        };
      case "Fail":
        const failCauseTag = exitResult.cause.error.cause._tag;
        switch (failCauseTag) {
          case "BotHandlerError":
            console.error(
              "❌",
              failCauseTag,
              exitResult.cause.error.cause.cause
            );
            return {
              status: ExitResponseStatus.ERROR,
              message: failCauseTag,
            };
          case "NotJsonResponse":
            console.error(
              "❌",
              exitResult.cause.error.cause._tag,
              exitResult.cause.error.cause
            );
            return {
              status: ExitResponseStatus.ERROR,
              message:
                typeof exitResult.cause.error.cause.response === "string"
                  ? exitResult.cause.error.cause.response
                  : failCauseTag,
            };
          case "ClientInternalError":
            console.error(
              "❌",
              exitResult.cause.error.cause._tag,
              exitResult.cause.error.cause.cause
            );
            return {
              status: ExitResponseStatus.ERROR,
              message:
                typeof exitResult.cause.error.cause.cause === "string"
                  ? exitResult.cause.error.cause.cause
                  : failCauseTag,
            };
          case "NotOkResponse":
            console.error(
              "❌",
              exitResult.cause.error.cause._tag,
              exitResult.cause.error.cause.details
            );
            return {
              status: ExitResponseStatus.ERROR,
              message: exitResult.cause.error.cause.details || failCauseTag,
              code: exitResult.cause.error.cause.errorCode || 0,
            };
          case "UnableToGetFile":
            console.error(
              "❌",
              exitResult.cause.error.cause._tag,
              exitResult.cause.error.cause.cause
            );
            return {
              status: ExitResponseStatus.ERROR,
              message: failCauseTag,
            };
          case "UnexpectedResponse":
            console.error(
              "❌",
              exitResult.cause.error.cause._tag,
              exitResult.cause.error.cause.response
            );
            return {
              status: ExitResponseStatus.ERROR,
              message: failCauseTag,
            };
        }
      case "Sequential":
        console.error(error, {
          left: exitResult.cause.left,
          right: exitResult.cause.right,
        });
        return {
          status: ExitResponseStatus.ERROR,
          message: exitResult.cause._tag,
        };
      case "Parallel":
        console.error(error, {
          left: exitResult.cause.left,
          right: exitResult.cause.right,
        });
        return {
          status: ExitResponseStatus.ERROR,
          message: exitResult.cause._tag,
        };
      default:
        console.error("❌ Ошибка при отправке сообщения!");
        return {
          status: ExitResponseStatus.ERROR,
          message: exitResult.cause,
        };
    }
  }
};
