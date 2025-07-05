import { db } from "..";
import { paymentDataTable, SPaymentData } from "../schema";

export const createPayment = async (
  paymentData: Pick<
    SPaymentData,
    "ownerId" | "paymentId" | "typeProvider" | "typeSubscription"
  >
) => {
  return (await db.insert(paymentDataTable).values(paymentData).returning()).at(
    0
  );
};
