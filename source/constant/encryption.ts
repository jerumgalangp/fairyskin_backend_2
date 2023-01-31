import argon2 from 'argon2';
import crypto from 'crypto-js';
import { CRYPTO_SECRET } from '../config/config';

export const useHash = async (text: string): Promise<string> => {
    return await argon2.hash(text, { type: argon2.argon2id });
};

export const useHashCompare = async (text: string, hashedText: string): Promise<boolean> => {
    return await argon2.verify(hashedText, text);
};

export const useEncrypt = (data: any): string | null => {
    if (!CRYPTO_SECRET) return null;
    return crypto.AES.encrypt(data, CRYPTO_SECRET).toString();
};

export const useDecrypt = (data: string): any => {
    if (!CRYPTO_SECRET) return null;
    return crypto.AES.decrypt(data, CRYPTO_SECRET).toString(crypto.enc.Utf8);
};
