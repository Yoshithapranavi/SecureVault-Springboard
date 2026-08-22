package com.securevault.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class AESUtil {

    private static final String GCM_PREFIX = "GCM:";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;

    private static String secretKey;
    private static String secretKeyV2;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    // =========================================================
    // KEY VERSION 1
    // =========================================================

    @Value("${aes.key}")
    public void setSecretKey(String key) {

        AESUtil.secretKey = key;
    }

    // =========================================================
    // KEY VERSION 2
    // =========================================================

    @Value("${aes.key.v2}")
    public void setSecretKeyV2(String key) {

        AESUtil.secretKeyV2 = key;
    }

    // =========================================================
    // EXISTING ENCRYPTION
    // =========================================================

    public static String encrypt(String data) {

        return encryptWithKey(
                data,
                secretKey);
    }

    // =========================================================
    // VERSION 2 ENCRYPTION
    // =========================================================

    public static String encryptV2(String data) {

        return encryptWithKey(
                data,
                secretKeyV2);
    }

    // =========================================================
    // GENERIC ENCRYPTION
    // =========================================================

    private static String encryptWithKey(
            String data,
            String keyValue) {

        try {

            if (keyValue == null ||
                    keyValue.isBlank()) {

                throw new IllegalStateException(
                        "Encryption key is not configured.");
            }

            byte[] iv = new byte[GCM_IV_LENGTH];

            SECURE_RANDOM.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(
                    "AES/GCM/NoPadding");

            SecretKeySpec key = new SecretKeySpec(
                    keyValue.getBytes(
                            StandardCharsets.UTF_8),
                    "AES");

            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    key,
                    new GCMParameterSpec(
                            GCM_TAG_LENGTH,
                            iv));

            byte[] encrypted = cipher.doFinal(
                    data.getBytes(
                            StandardCharsets.UTF_8));

            byte[] combined = new byte[iv.length +
                    encrypted.length];

            System.arraycopy(
                    iv,
                    0,
                    combined,
                    0,
                    iv.length);

            System.arraycopy(
                    encrypted,
                    0,
                    combined,
                    iv.length,
                    encrypted.length);

            return GCM_PREFIX +
                    Base64.getEncoder()
                            .encodeToString(combined);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Error while encrypting data.",
                    e);
        }
    }

    // =========================================================
    // EXISTING DECRYPTION - VERSION 1
    // =========================================================

    public static String decrypt(
            String encryptedData) {

        return decryptWithKey(
                encryptedData,
                secretKey);
    }
    // =========================================================
    // VERSION-AWARE DECRYPTION
    // =========================================================

    public static String decrypt(
            String encryptedData,
            int keyVersion) {

        if (keyVersion == 2) {

            return decryptWithKey(
                    encryptedData,
                    secretKeyV2);
        }

        return decryptWithKey(
                encryptedData,
                secretKey);
    }

    // =========================================================
    // VERSION 2 DECRYPTION
    // =========================================================

    public static String decryptV2(
            String encryptedData) {

        return decryptWithKey(
                encryptedData,
                secretKeyV2);
    }

    // =========================================================
    // GENERIC DECRYPTION
    // =========================================================

    private static String decryptWithKey(
            String encryptedData,
            String keyValue) {

        try {

            if (keyValue == null ||
                    keyValue.isBlank()) {

                throw new IllegalStateException(
                        "Encryption key is not configured.");
            }

            if (encryptedData.startsWith(
                    GCM_PREFIX)) {

                return decryptGcm(
                        encryptedData.substring(
                                GCM_PREFIX.length()),
                        keyValue);
            }

            // -------------------------------------------------
            // BACKWARD COMPATIBILITY
            // -------------------------------------------------
            // Old credentials used AES/ECB.
            // They continue to use Version 1.
            // -------------------------------------------------

            return decryptLegacy(
                    encryptedData,
                    keyValue);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Error while decrypting data.",
                    e);
        }
    }

    // =========================================================
    // AES-GCM DECRYPTION
    // =========================================================

    private static String decryptGcm(
            String encoded,
            String keyValue)
            throws Exception {

        byte[] combined = Base64.getDecoder()
                .decode(encoded);

        if (combined.length <= GCM_IV_LENGTH) {

            throw new IllegalArgumentException(
                    "Invalid encrypted data.");
        }

        byte[] iv = new byte[GCM_IV_LENGTH];

        byte[] encrypted = new byte[combined.length -
                GCM_IV_LENGTH];

        System.arraycopy(
                combined,
                0,
                iv,
                0,
                GCM_IV_LENGTH);

        System.arraycopy(
                combined,
                GCM_IV_LENGTH,
                encrypted,
                0,
                encrypted.length);

        SecretKeySpec key = new SecretKeySpec(
                keyValue.getBytes(
                        StandardCharsets.UTF_8),
                "AES");

        Cipher cipher = Cipher.getInstance(
                "AES/GCM/NoPadding");

        cipher.init(
                Cipher.DECRYPT_MODE,
                key,
                new GCMParameterSpec(
                        GCM_TAG_LENGTH,
                        iv));

        return new String(
                cipher.doFinal(encrypted),
                StandardCharsets.UTF_8);
    }

    // =========================================================
    // LEGACY AES/ECB DECRYPTION
    // =========================================================

    private static String decryptLegacy(
            String encryptedData,
            String keyValue)
            throws Exception {

        SecretKeySpec key = new SecretKeySpec(
                keyValue.getBytes(
                        StandardCharsets.UTF_8),
                "AES");

        Cipher cipher = Cipher.getInstance("AES");

        cipher.init(
                Cipher.DECRYPT_MODE,
                key);

        byte[] decoded = Base64.getDecoder()
                .decode(encryptedData);

        return new String(
                cipher.doFinal(decoded),
                StandardCharsets.UTF_8);
    }
}