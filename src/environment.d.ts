declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';

            PORT: string;
            TELEGRAM_BOT_TOKEN: string;
            TELEGRAM_WEBHOOK_URL: string;
            DB_FILE_NAME: string;

            '3XUI_WEBHOOK_PATH': string;
            '3XUI_USERNAME': string;
            '3XUI_PASSWORD': string;
            '3XUI_PORT': string;
            '3XUI_IP': string;

            YKASSA_KASSA_ID: string;
            YKASSA_KASSA_API: string;
            YKASSA_PROVIDER_TOKEN: string;

            ADMIN_SECRET_KEY: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
