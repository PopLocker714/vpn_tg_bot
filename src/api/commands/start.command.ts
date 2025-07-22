import { Commands, IBaseProps } from 'types';

export default ({ context, utils }: IBaseProps) => {
    const { execBotMethod } = utils;
    const userName = context.user?.username || context.user?.first_name;

    execBotMethod('send_message', {
        chat_id: context.chat_id,
        text: `
Привет *${userName}\\!*

💻 Добро пожаловать в *CatFlyVPN\\!*

Мы предоставляем доступ к VPN для обхода блокировок и обеспечения безопасности в интернете\\. Пользуясь нашим VPN, Вы получите доступ к *Instagram*, *YouTube*, *TikTok*, *Facebook*, *Twitter* и другим заблокированным сервисам\\.

🚀 Никаких ограничений скорости — полная свобода в интернете на максимальной скорости\\.
🌍 Доступ ко всем сайтам — никаких блокировок, где бы вы ни находились\\.
⚙️ Быстрое подключение — легко настроить за 1 минуту на iPhone, Android, ПК и macOS\\.
`,
        parse_mode: 'MarkdownV2',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '👉 Подключиться к VPN',
                        callback_data: Commands.SUBSCRIBE,
                    },
                ],
                [
                    {
                        text: '🔑 Мои ключи',
                        callback_data: 'help',
                    },
                    {
                        text: '🆘 Помощь',
                        callback_data: '/help',
                    },
                ],
            ],
        },
    });
};
