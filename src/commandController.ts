import start from "./commands/start";
import subscribe from "./commands/subscribe";
import { Commands, Context } from "./types";

export default async (context: Context, command?: string) => {
  const text = command || context.commandData?.text;
  switch (text) {
    case Commands.START:
      await start(context);
      return true;
    case Commands.SUBSCRIBE:
      await subscribe(context);
      return true;
    case Commands.MENU:
      await start(context);
      return true;
    default:
      return false;
  }
};
