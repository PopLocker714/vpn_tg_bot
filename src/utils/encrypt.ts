// Для Node.js вам может понадобиться установить 'dotenv' и импортировать его так:
// import 'dotenv/config';
// Для Bun это не требуется, так как он нативно поддерживает .env
import { webcrypto as crypto } from 'node:crypto';
import { Buffer } from 'node:buffer'; // Bun имеет глобальный Buffer, Node.js требует импорта
import { instanceOf } from 'effect/Schema';
import { EncryptedSecret } from 'types';

// Типы для возвращаемых значений и параметров


const ADMIN_MASTER_PASSWORD: string | undefined = process.env.ADMIN_SECRET_KEY;

if (!ADMIN_MASTER_PASSWORD) {
    console.error(
        'Ошибка: Переменная окружения ADMIN_SECRET_KEY не установлена. Пожалуйста, добавьте ее в .env файл.'
    );
    process.exit(1);
}

/**
 * Генерирует случайный IV (Initialization Vector) для AES-GCM.
 * @returns {Uint8Array} Uint8Array с 16-байтным IV.
 */
function generateIv(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(16)); // 16 байт для AES-GCM
}

/**
 * Выводит криптографический ключ из секретной строки (пароля).
 * Используем PBKDF2 через Web Crypto API для совместимости и безопасности.
 * @param {string} secretString - Секретная строка (мастер-пароль) из .env.
 * @param {Uint8Array | null} [salt] - Опциональная соль. Если не предоставлена, будет сгенерирована.
 * @returns {Promise<{cryptoKey: CryptoKey, salt: Uint8Array, iterations: number, hashAlgorithm: string}>} Promise, который разрешается в объект с ключом и параметрами.
 */
async function deriveKeyFromSecretString(
    secretString: string,
    salt: Uint8Array | null = null
): Promise<{
    cryptoKey: CryptoKey;
    salt: Uint8Array;
    iterations: number;
    hashAlgorithm: string;
}> {
    const enc = new TextEncoder();
    const secretBuffer = enc.encode(secretString);

    // Генерируем соль, если она не предоставлена.
    // Для дешифрования всегда используем ту же соль, что и при шифровании.
    const usedSalt: Uint8Array =
        salt || crypto.getRandomValues(new Uint8Array(16));
    const iterations: number = 300000; // Увеличенное количество итераций для лучшей безопасности
    const hashAlgorithm: string = 'SHA-256';

    const baseKey: CryptoKey = await crypto.subtle.importKey(
        'raw',
        secretBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );

    const derivedKey: CryptoKey = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: usedSalt,
            iterations: iterations,
            hash: hashAlgorithm,
        },
        baseKey,
        { name: 'AES-GCM', length: 256 }, // Длина ключа для AES-256-GCM
        true, // Ключ можно извлекать (для сохранения или передачи), но мы не будем этого делать.
        ['encrypt', 'decrypt']
    );

    return {
        cryptoKey: derivedKey,
        salt: usedSalt,
        iterations: iterations,
        hashAlgorithm: hashAlgorithm,
    };
}

/**
 * Шифрует данные с использованием AES-256-GCM.
 * @param {string} data - Строка, которую нужно зашифровать.
 * @param {CryptoKey} key - Объект CryptoKey, полученный из секретной строки.
 * @param {Uint8Array} iv - IV (Initialization Vector), сгенерированный функцией generateIv.
 * @returns {Promise<{encryptedData: Uint8Array, authTag: Uint8Array}>} Promise, который разрешается в объект с зашифрованными данными и тегом аутентификации.
 */
async function encryptData(
    data: string,
    key: CryptoKey,
    iv: Uint8Array
): Promise<{ encryptedData: Uint8Array; authTag: Uint8Array }> {
    const encoded: Uint8Array = new TextEncoder().encode(data);
    const algorithm: AesGcmParams = { name: 'AES-GCM', iv: iv };

    const encryptedBuffer: ArrayBuffer = await crypto.subtle.encrypt(
        algorithm,
        key,
        encoded
    );

    const authTagLength: number = 16; // Для AES-GCM это 16 байт
    const encryptedData: Uint8Array = new Uint8Array(
        encryptedBuffer.slice(0, encryptedBuffer.byteLength - authTagLength)
    );
    const authTag: Uint8Array = new Uint8Array(
        encryptedBuffer.slice(encryptedBuffer.byteLength - authTagLength)
    );

    return { encryptedData, authTag };
}

/**
 * Дешифрует данные, зашифрованные с использованием AES-256-GCM.
 * @param {Uint8Array} encryptedData - Зашифрованные данные.
 * @param {Uint8Array} authTag - Тег аутентификации.
 * @param {CryptoKey} key - Объект CryptoKey, полученный из секретной строки.
 * @param {Uint8Array} iv - IV (Initialization Vector), использованный при шифровании.
 * @returns {Promise<string>} Promise, который разрешается в дешифрованную строку.
 * @throws {Error} Если аутентификация не удалась (данные были изменены).
 */
async function decryptData(
    encryptedData: Uint8Array,
    authTag: Uint8Array,
    key: CryptoKey,
    iv: Uint8Array
): Promise<string> {
    const algorithm: AesGcmParams = { name: 'AES-GCM', iv: iv };

    // Собираем зашифрованные данные и тег аутентификации обратно
    const combinedBuffer: Uint8Array = new Uint8Array(
        encryptedData.byteLength + authTag.byteLength
    );
    combinedBuffer.set(encryptedData, 0);
    combinedBuffer.set(authTag, encryptedData.byteLength);

    const decryptedBuffer: ArrayBuffer = await crypto.subtle.decrypt(
        algorithm,
        key,
        combinedBuffer
    );

    return new TextDecoder().decode(decryptedBuffer);
}

// --- Класс для управления шифрованием секретов админ-панели ---
export class AdminSecretManager {
    private masterPassword: string;
    private encryptionKeyPromise: Promise<CryptoKey> | null;
    private salt: Uint8Array | null;
    private iterations: number | null;
    private hashAlgorithm: string | null;

    constructor(masterPassword: string) {
        this.masterPassword = masterPassword;
        this.encryptionKeyPromise = null;
        this.salt = null;
        this.iterations = null;
        this.hashAlgorithm = null;
    }

    /**
     * Инициализирует менеджер, выводя ключ из мастер-пароля.
     * Этот метод должен быть вызван перед попыткой шифрования/дешифрования.
     * При дешифровании нужно передать соль, которая была использована при шифровании.
     * @param {Uint8Array | null} [existingSalt] - Соль, если дешифруем существующие данные.
     */
    async initialize(
        existingSalt: Uint8Array | null = null
    ): Promise<CryptoKey> {
        if (!this.encryptionKeyPromise) {
            const { cryptoKey, salt, iterations, hashAlgorithm } =
                await deriveKeyFromSecretString(
                    this.masterPassword,
                    existingSalt
                );
            this.encryptionKeyPromise = Promise.resolve(cryptoKey);
            this.salt = salt;
            this.iterations = iterations;
            this.hashAlgorithm = hashAlgorithm;
        }
        return this.encryptionKeyPromise;
    }

    /**
     * Шифрует секрет админ-панели.
     * @param {string} secretToEncrypt - Секрет (например, "логин:пароль").
     * @returns {Promise<EncryptedSecret>} Объект с зашифрованными данными в формате HEX для хранения в БД.
     */
    async encryptSecret(secretToEncrypt: string): Promise<EncryptedSecret> {
        const key = await this.initialize(); // Инициализируем, если еще не инициализировано
        const iv = generateIv();

        const { encryptedData, authTag } = await encryptData(
            secretToEncrypt,
            key,
            iv
        );

        if (!this.salt || !this.iterations || !this.hashAlgorithm) {
            // Этого не должно произойти, если initialize был успешным
            throw new Error('Encryption key parameters not set.');
        }

        return {
            encryptedData: Buffer.from(encryptedData).toString('hex'),
            iv: Buffer.from(iv).toString('hex'),
            authTag: Buffer.from(authTag).toString('hex'),
            salt: Buffer.from(this.salt).toString('hex'), // Сохраняем соль
            iterations: this.iterations,
            hashAlgorithm: this.hashAlgorithm,
        };
    }

    /**
     * Дешифрует секрет админ-панели.
     * @param {EncryptedSecret} encryptedSecretObject - Объект, полученный из базы данных.
     * @returns {Promise<string>} Дешифрованный секрет.
     */
    async decryptSecret(
        encryptedSecretObject: EncryptedSecret
    ): Promise<string> {
        const { encryptedData, iv, authTag, salt } = encryptedSecretObject;

        // Сначала инициализируем менеджер с той же солью, чтобы получить правильный ключ
        // Итерации и алгоритм хеширования тоже нужны, но они зафиксированы в deriveKeyFromSecretString
        const key = await this.initialize(Buffer.from(salt, 'hex'));

        const decrypted = await decryptData(
            Buffer.from(encryptedData, 'hex'),
            Buffer.from(authTag, 'hex'),
            key,
            Buffer.from(iv, 'hex')
        );

        return decrypted;
    }
}

export type TCryptoManager = AdminSecretManager;

// --- Пример использования ---
async function runApp(): Promise<void> {
    const adminSecretManager = new AdminSecretManager(ADMIN_MASTER_PASSWORD!);

    // const buffer = Buffer.alloc(100);
    // await $`echo "Hello World!" > ${buffer}`;

    // console.log(buffer.toString()); // Hello World!\n

    const adminCredentials = prompt(
        'Введите данные админ-панели (логин:пароль): '
    );
    // const stream = Bun.stdin.stream();

    // for await (const chunk of stream) {
    //     // chunk is Uint8Array
    //     // this converts it to text (assumes ASCII encoding)
    //     const chunkText = Buffer.from(chunk).toString();
    //     console.log(`Chunk: ${chunkText}`);
    //     const result = await stream.cancel().catch((error) => {
    //         console.log(error);
    //     });
    // }

    // const adminCredentials = 'admin:securePassword123';
    console.log('Исходные данные админ-панели:', adminCredentials);

    // 1. Шифруем и подготавливаем для сохранения в БД
    const encryptedAdminSecret: EncryptedSecret =
        await adminSecretManager.encryptSecret(adminCredentials!);
    console.log(
        '\nЗашифрованные данные для БД (включая служебную информацию):',
        encryptedAdminSecret
    );

    // Имитация сохранения в базу данных
    // const dbRecord: EncryptedSecret & { id: string } = {
    //   id: "admin_creds",
    //   ...encryptedAdminSecret
    // };

    // 2. Дешифруем, когда нужно использовать
    console.log('\n--- Дешифрование ---');
    try {
        const decryptedAdminSecret: string =
            await adminSecretManager.decryptSecret(encryptedAdminSecret); // Передаем объект, как будто он пришел из БД
        console.log('Дешифрованные данные админ-панели:', decryptedAdminSecret);

        if (decryptedAdminSecret === adminCredentials) {
            console.log('Шифрование и дешифрование успешно подтверждены!');
        } else {
            console.error(
                'Ошибка: Дешифрованные данные не совпадают с исходными!'
            );
        }
    } catch (error: any) {
        console.error('Ошибка при дешифровании:', error.message);
        if (error.name === 'OperationError') {
            console.error(
                'Вероятно, секретный ключ из .env неверен, или зашифрованные данные были подделаны.'
            );
        }
    }

    // --- Пример ошибки: неправильный секретный ключ ---
    console.log(
        '\n--- Пример: Попытка дешифрования с неправильным MASTER_PASSWORD ---'
    );
    const wrongSecretManager = new AdminSecretManager(
        'неправильный_секретный_ключ'
    );
    try {
        // Здесь мы используем существующий объект encryptedAdminSecret, но с другим masterPassword
        await wrongSecretManager.decryptSecret(encryptedAdminSecret);
        console.log(
            'ОШИБКА: Дешифрование с неправильным секретным ключом удалось!'
        );
    } catch (error: any) {
        console.error(
            'УСПЕХ: Ошибка при дешифровании с неправильным секретным ключом (ожидаемо):',
            error.message
        );
    }
}

// runApp();
