import { FREE_TIME, MONTH, ONE_YEAR, Plan, THREE_MONTH } from 'types';

// export default (startData: number, type: Plan) => {
//     switch (type) {
//         case Plan.FREE:
//             // return startData + 3 * 24 * 60 * 60 * 1000;
//             return new Date(startData + FREE_TIME).toISOString();
//         case Plan.SUBSCRIBE_1:
//             return startData + 30 * 24 * 60 * 60 * 1000;
//         case Plan.SUBSCRIBE_2:
//             return startData + 90 * 24 * 60 * 60 * 1000;
//         case Plan.SUBSCRIBE_3:
//             return startData + 365 * 24 * 60 * 60 * 1000;
//     }
// };

export default (startData: Date, type: Plan): string => {
    let durationMillis = 0;
    const startDate = new Date(startData);

    switch (type) {
        case Plan.FREE:
            durationMillis = FREE_TIME;
            break;
        case Plan.SUBSCRIBE_1:
            durationMillis = MONTH;
            break;
        case Plan.SUBSCRIBE_2:
            durationMillis = THREE_MONTH;
            break;
        case Plan.SUBSCRIBE_3:
            durationMillis = ONE_YEAR;
            break;
        default:
            return ''; // Неизвестный тип подписки
    }

    // Количество миллисекунд в одном дне и одном часе
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const MS_PER_HOUR = 1000 * 60 * 60;

    const days =
        Math.floor(durationMillis / MS_PER_DAY) -
        Math.floor(startDate.getTime() / MS_PER_DAY);
    const remainingMillisAfterDays =
        (durationMillis % MS_PER_DAY) + (startDate.getTime() % MS_PER_DAY);
    const hours =
        Math.floor(remainingMillisAfterDays / MS_PER_HOUR) -
        (Math.floor(startDate.getTime() / MS_PER_HOUR) % 24);
    const remainingMinuts =
        (remainingMillisAfterDays % MS_PER_HOUR) +
        (startDate.getTime() % MS_PER_HOUR);
    const minuts =
        Math.floor(remainingMinuts / (1000 * 60)) -
        (Math.floor(startDate.getTime() / (1000 * 60)) % 60);
    const seconds =
        Math.floor((remainingMinuts % (1000 * 60)) / 1000) -
        (Math.floor(startDate.getTime() / 1000) % 60);

    return `${days}d ${hours}h ${minuts}m ${seconds}s`;
};
