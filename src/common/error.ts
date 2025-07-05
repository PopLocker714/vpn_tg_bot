import { Context } from "../types";

export const newError = async (
  client: Context["client"],
  chatId: number,
  message: string,
  code: string
) => {
  await client.execute("send_message", {
    chat_id: chatId,
    parse_mode: "MarkdownV2",
    text: message + `\n\n*Error code:* \`${code}\``,
  });
};
