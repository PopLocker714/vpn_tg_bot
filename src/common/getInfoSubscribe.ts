import { Plan } from "../types";
import { MONTH, ONE_YEAR, THREE_DAY, THREE_MONTH } from "./constants";

export default (
  date: number,
  plan: Plan
): { expiredDate: string; plan: string } => {
  switch (plan) {
    case Plan.FREE:
      return {
        expiredDate: Intl.DateTimeFormat("ru-RU", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
          .format(date + THREE_DAY)
          .replaceAll(".", "/"),
        plan: "3 дня",
      };

    case Plan.MONTH:
      return {
        expiredDate: Intl.DateTimeFormat("ru-RU", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
          .format(date + MONTH)
          .replaceAll(".", "/"),
        plan: "месяц",
      };
    case Plan.THREE_MONTH:
      return {
        expiredDate: Intl.DateTimeFormat("ru-RU", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
          .format(date + THREE_MONTH)
          .replaceAll(".", "/"),
        plan: "3 месяца",
      };
    case Plan.YEAR:
      return {
        expiredDate: Intl.DateTimeFormat("ru-RU", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
          .format(date + ONE_YEAR)
          .replaceAll(".", "/"),
        plan: "год",
      };
  }
};
