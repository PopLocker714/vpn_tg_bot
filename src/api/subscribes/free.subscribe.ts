import { CtxCallbackQuery } from '@/lib/context/types';
import getDataExp from '@/utils/getDataExp';
import { MESSAGE_EFFECTS } from '@effect-ak/tg-bot-client';
import createPayment from 'db/queries/payment/createPayment';
import getPaymentByProvider from 'db/queries/payment/getPaymentByProvider';
import getAvailableServers from 'db/queries/servers/getAvailableServers';
import createSubscribe from 'db/queries/subscribe/createSubscribe';
import { Plan, Utils } from 'types';

export default async (ctx: CtxCallbackQuery, utils: Utils) => {
    const _user = await ctx._user;
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
                chat_id: ctx.chat_id,
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
            chat_id: ctx.chat_id,
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
                chat_id: ctx.chat_id,
                text: 'Не удалось получить доступные сервера.',
            });
            return;
        }

        await execBotMethod('send_message', {
            chat_id: ctx.chat_id,
            parse_mode: 'MarkdownV2',
            text: `Выберите локацию для подключения к VPN:`,
            reply_markup: {
                inline_keyboard: servers.map((server) => [
                    {
                        text: server.name,
                        callback_data: `connect_${server.id}`,
                    },
                ]),
            }
        });

        console.log({ payment, subscribe });
    } catch (error) {
        console.log('Error in buyFreeSub:', error);
    }

    // const res = await buyFreeSub(undefined, utils).catch((error) => {
    //     console.log('Error in buyFreeSub:', error);
    //     utils.logger.error('Error in buyFreeSub:', error);
    // });

    // if (_user) {
    //     const payment = await createPayment(utils, {
    //         owner_id: _user.id,
    //         payment_id: 'free',
    //         provider: 'free',
    //     });

    //     if (payment) {
    //         utils.execBotMethod('send_message', {
    //             chat_id: ctx.chat_id,
    //             parse_mode: 'MarkdownV2',
    //             text: `Ваша подписка продлиться *${getDataExp(
    //                 payment.created_at,
    //                 Plan.FREE
    //             )}* `,
    //         });
    //     }
    // } else {
    //     utils.logger.error(
    //         'free.subscribe: При создании платежа не нашли пользователя'
    //     );
    // }
};
