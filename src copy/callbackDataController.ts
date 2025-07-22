import freePlan from "./buttons/freePlan";
import monthPlan from "./buttons/monthPlan";
import commandController from "./commandController";
import keys from "./commands/keys";
import { Buttons, Commands, Context, Plan } from "./types";

export default async (context: Context) => {
  //   console.log("query", context.callbackQueryData?.text);

  const res = await commandController(context, context.callbackQueryData?.text);

  if (res) {
    context.callbackQueryData &&
      (await context.client.execute("answer_callback_query", {
        callback_query_id: context.callbackQueryData?.id,
      }));
    return;
  }

  switch (context.callbackQueryData?.text) {
    case Buttons.OUTLINE_VPN:
      break;
    case Plan.FREE:
      freePlan(context);
      break;
    case Plan.MONTH:
      monthPlan(context);
      break;
    case Commands.KEYS:
      keys(context);
      break;
    default:
      if (!context.callbackQueryData?.id) return;
      await context.client.execute("answer_callback_query", {
        callback_query_id: context.callbackQueryData.id,
        show_alert: true,
        text: "Что-то пошло не так",
      });
      break;
  }
};
