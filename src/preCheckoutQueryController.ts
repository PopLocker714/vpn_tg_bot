import { Context } from "./types";

export default async (context: Context) => {
  const id = context.preCheckoutQueryData?.id;

  if (!id) {
    return;
  }

  const client = context.client;

  await client.execute("answer_pre_checkout_query", {
    pre_checkout_query_id: id,
    ok: true,
  });
};
