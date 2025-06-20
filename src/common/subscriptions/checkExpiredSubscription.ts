import { setExpiredSubscription } from "../../db/queries/subscriptions";
import { SSubscription } from "../../db/schema";
import { Plan } from "../../types";
import { MONTH, ONE_YEAR, THREE_DAY, THREE_MONTH } from "../constants";

export default async (subscription: SSubscription): Promise<boolean> => {
  switch (subscription.plan) {
    case Plan.FREE:
      const isExpired = !(subscription.createdAt + THREE_DAY > Date.now());

      if (isExpired) {
        await setExpiredSubscription(subscription.id);
      }

      return isExpired;

    case Plan.MONTH:
      const isExpired2 = !(subscription.createdAt + MONTH > Date.now());

      if (isExpired2) {
        await setExpiredSubscription(subscription.id);
      }

      return isExpired2;

    case Plan.THREE_MONTH:
      const isExpired3 = !(subscription.createdAt + THREE_MONTH > Date.now());

      if (isExpired3) {
        await setExpiredSubscription(subscription.id);
      }
      return isExpired3;
    case Plan.YEAR:
      const isExpired4 = !(subscription.createdAt + ONE_YEAR > Date.now());

      if (isExpired4) {
        await setExpiredSubscription(subscription.id);
      }
      return isExpired4;
  }
};
