import { CtxCallbackQuery } from '@/lib/context/types';
import getDataExp from '@/utils/getDataExp';
import { MESSAGE_EFFECTS } from '@effect-ak/tg-bot-client';
import createPayment from 'db/queries/payment/createPayment';
import getPaymentByProvider from 'db/queries/payment/getPaymentByProvider';
import getAvailableServers from 'db/queries/servers/getAvailableServers';
import createSubscribe from 'db/queries/subscribe/createSubscribe';
import { IBaseProps, Plan } from 'types';

export default async ({ context, utils }: IBaseProps) => {
    const _user = await context._user;
    const { execBotMethod } = utils;

    try {
        if (!_user) {
            throw new Error('User not found');
        }

        const existingPayment = await getPaymentByProvider(
            utils,
            'free',
            _user
        );

        if (existingPayment) {
            utils.execBotMethod('send_message', {
                chat_id: context.chat_id,
                text: 'Вы уже подписаны на бесплатный тариф или он истек.',
            });
            return;
        }

        const { payment, subscribe } = await utils.db.transaction(
            async (tx) => {
                const payment = await createPayment(
                    { ...utils, db: tx },
                    {
                        owner_id: _user.id,
                        payment_id: 'free',
                        provider: 'free',
                    }
                );

                if (!payment) {
                    throw new Error('Не удалось создать платеж');
                }

                const subscribe = await createSubscribe(
                    { ...utils, db: tx },
                    {
                        owner_id: _user.id,
                        payment_id: payment.id,
                        type_id: 1,
                        closed: false,
                    }
                );

                if (!subscribe) {
                    throw new Error('Не удалось создать подписку');
                }

                return { payment, subscribe };
            }
        );

        await execBotMethod('send_message', {
            chat_id: context.chat_id,
            parse_mode: 'MarkdownV2',
            text: `Пробный период активирован и истечет через *${getDataExp(
                payment.created_at,
                Plan.FREE
            )}*
            `,
            message_effect_id: MESSAGE_EFFECTS['🎉'],
        });

        const servers = await getAvailableServers(utils);

        if (!servers) {
            await execBotMethod('send_message', {
                chat_id: context.chat_id,
                text: 'Не удалось получить доступные сервера.',
            });
            return;
        }

        await execBotMethod('send_message', {
            chat_id: context.chat_id,
            parse_mode: 'MarkdownV2',
            text: `Выберите локацию для подключения к VPN:`,
            reply_markup: {
                inline_keyboard: servers.map((server) => [
                    {
                        text: server.name,
                        callback_data: `connect_${server.id}`,
                    },
                ]),
            },
        });
    } catch (error) {
        console.log('Error in buyFreeSub:', error);
    }
};
