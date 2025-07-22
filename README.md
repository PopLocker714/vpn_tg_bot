To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3000

## setWebhook

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://95bb-64-7-199-72.ngrok-free.app",
  }'
```

```ts
const res = await executeTgBotMethod('send_message', {
    text: 'hello',
    parse_mode: 'MarkdownV2',
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: '👉 Подключиться к VPN',
                    callback_data: 'subscribe',
                },
            ],
        ],
    },
    chat_id,
});
if (isExitResultSuccess(res)) {
    console.log(res);
}
if (isExitResultError(res)) {
    console.error(res.message);
}
```
