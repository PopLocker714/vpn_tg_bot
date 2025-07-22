export function checkValidEnv() {
  const requiredEnvVars = [
    "NODE_ENV",
    "PORT",
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_WEBHOOK_URL",
    "DB_FILE_NAME",
    "3XUI_WEBHOOK_PATH",
    "3XUI_USERNAME",
    "3XUI_PASSWORD",
    "3XUI_PORT",
    "3XUI_IP",
    "YKASSA_KASSA_ID",
    "YKASSA_KASSA_API",
    "YKASSA_PROVIDER_TOKEN",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Missing environment variable: ${envVar}`);
      throw new Error(`Environment variable ${envVar} is required.`);
    }
  }
}
