import getCatchError from "@/utils/getCatchError";
import getCauseResult from "@/lib/botApi/getCauseResult";
import {
  Api,
  executeTgBotMethod,
  TgBotApiToken,
} from "@effect-ak/tg-bot-client";
import { Effect } from "effect/index";

export default () => {
  return <M extends keyof Api>(method: M, input: Parameters<Api[M]>[0]) => {
    return executeTgBotMethod(method, input)
      .pipe(
        Effect.provideService(TgBotApiToken, Bun.env.TELEGRAM_BOT_TOKEN),
        Effect.runPromiseExit
      )
      .then((exitResult) => {
        return getCauseResult<M>(exitResult);
      })
      .catch((error) => {
        return getCatchError<M>(error);
      });
  };
};
