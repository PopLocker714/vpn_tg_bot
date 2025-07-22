import getPaymentByProvider from 'db/queries/payment/getPaymentByProvider';
import { Plan, IBaseProps } from 'types';

const buttonsPlan = [
    [
        {
            text: '💰 Подписка на месяц (250₽)',
            callback_data: Plan.SUBSCRIBE_1,
        },
    ],
    [
        {
            text: '💰💰 Подписка 3 месяца (750₽)',
            callback_data: Plan.SUBSCRIBE_2,
        },
    ],
    [
        {
            text: '💰💰💰 Подписка на год (1500₽)',
            callback_data: Plan.SUBSCRIBE_3,
        },
    ],
];

const freeButton = [
    {
        text: '🤩 Пробный период 7 дней',
        callback_data: Plan.FREE,
    },
];

export default async ({ context, utils }: IBaseProps) => {
    const { execBotMethod } = utils;
    const _user = await context._user;

    if (!_user) {
        execBotMethod('send_message', {
            chat_id: context.chat_id,
            text: 'Пользователь не найден.',
        });
        return;
    }

    const freePayment = await getPaymentByProvider(utils, 'free', _user);


    execBotMethod('send_message', {
        chat_id: context.chat_id,
        text: 'Выберите план подписки',
        reply_markup: {
            inline_keyboard: !freePayment
                ? [freeButton, ...buttonsPlan]
                : [...buttonsPlan],
        },
    });
};
