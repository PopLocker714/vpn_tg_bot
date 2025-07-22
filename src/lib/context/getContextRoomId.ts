import { Update } from "@effect-ak/tg-bot-client";

export default (update: Update): number => {
  if (update.message) {
    return update.message.chat.id;
  }

  if (update.callback_query?.message) {
    return update.callback_query.message.chat.id;
  }

  return 0;
};
