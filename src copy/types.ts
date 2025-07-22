import { makeTgBotClient, User } from "@effect-ak/tg-bot-client";
import { SUser } from "./db/schema";

export const enum Commands {
  START = "/start",
  SUBSCRIBE = "/subscribe",
  MENU = "/menu",
  KEYS = "/keys",
}

export const enum Plan {
  FREE = "3d",
  MONTH = "1m",
  THREE_MONTH = "3m",
  YEAR = "1y",
}

export const enum PaymentTypeProvider {
  FREE = "free",
  YKASSA = "YKassa",
}

export const enum VpnServerLocation {
  USA = "USA",
  UK = "UK",
  Germany = "Germany",
}

export const enum Buttons {
  OUTLINE_VPN = "OUTLINE_VPN",
}

export interface Context {
  client: ReturnType<typeof makeTgBotClient>;
  chatId: number;
  tgUser: User;
  user: SUser;
  commandData?: {
    text: string;
  };
  successfulPayment?: {
    provider_payment_charge_id: string;
    currency: string;
    total_amount: number;
    invoice_payload: Plan;
  };
  callbackQueryData?: {
    text: string;
    id: string;
  };
  preCheckoutQueryData?: {
    id: string;
    from: User;
    currency: string;
    total_amount: number;
  };
  messageId?: number;
  error?: string;
}
