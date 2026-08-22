package com.securevault.service;

import com.securevault.dto.PasswordStrengthRequest;
import com.securevault.dto.PasswordStrengthResponse;
import com.securevault.dto.PasswordGeneratorRequest;
import com.securevault.dto.PasswordGeneratorResponse;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class PasswordService {

    private static final String UPPERCASE =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    private static final String LOWERCASE =
            "abcdefghijklmnopqrstuvwxyz";

    private static final String NUMBERS =
            "0123456789";

    private static final String SYMBOLS =
            "!@#$%^&*()-_=+[]{};:,.<>?";

    private final SecureRandom secureRandom =
            new SecureRandom();


    // =========================================================
    // PASSWORD STRENGTH
    // =========================================================

    public PasswordStrengthResponse checkPasswordStrength(
            PasswordStrengthRequest request) {

        String password = request.getPassword();

        int score = 0;

        List<String> feedback =
                new ArrayList<>();


        // -----------------------------------------------------
        // Rule 1: Password length
        // -----------------------------------------------------

        if (password.length() >= 12) {

            score++;

        } else {

            feedback.add(
                    "Increase password length to at least 12 characters.");
        }


        // -----------------------------------------------------
        // Rule 2: Uppercase
        // -----------------------------------------------------

        if (password.matches(".*[A-Z].*")) {

            score++;

        } else {

            feedback.add(
                    "Add at least one uppercase letter.");
        }


        // -----------------------------------------------------
        // Rule 3: Lowercase
        // -----------------------------------------------------

        if (password.matches(".*[a-z].*")) {

            score++;

        } else {

            feedback.add(
                    "Add at least one lowercase letter.");
        }


        // -----------------------------------------------------
        // Rule 4: Number
        // -----------------------------------------------------

        if (password.matches(".*\\d.*")) {

            score++;

        } else {

            feedback.add(
                    "Add at least one number.");
        }


        // -----------------------------------------------------
        // Rule 5: Special Character
        // -----------------------------------------------------

        if (password.matches(
                ".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*")) {

            score++;

        } else {

            feedback.add(
                    "Add at least one special character.");
        }


        // -----------------------------------------------------
        // Strength classification
        // -----------------------------------------------------

        String strength;

        if (score <= 2) {

            strength = "Weak";

        } else if (score <= 4) {

            strength = "Medium";

        } else {

            strength = "Strong";
        }


        return new PasswordStrengthResponse(
                score,
                strength,
                feedback);
    }


    // =========================================================
    // PASSWORD GENERATOR
    // =========================================================

    public PasswordGeneratorResponse generatePassword(
            PasswordGeneratorRequest request) {

        int length = request.getLength();


        // -----------------------------------------------------
        // Validate length
        // -----------------------------------------------------

        if (length < 8 || length > 64) {

            throw new IllegalArgumentException(
                    "Password length must be between 8 and 64 characters.");
        }


        // -----------------------------------------------------
        // Build selected character groups
        // -----------------------------------------------------

        List<String> selectedGroups =
                new ArrayList<>();

        StringBuilder characterPool =
                new StringBuilder();


        if (request.isUppercase()) {

            selectedGroups.add(UPPERCASE);
            characterPool.append(UPPERCASE);
        }


        if (request.isLowercase()) {

            selectedGroups.add(LOWERCASE);
            characterPool.append(LOWERCASE);
        }


        if (request.isNumbers()) {

            selectedGroups.add(NUMBERS);
            characterPool.append(NUMBERS);
        }


        if (request.isSymbols()) {

            selectedGroups.add(SYMBOLS);
            characterPool.append(SYMBOLS);
        }


        // -----------------------------------------------------
        // At least one character type must be selected
        // -----------------------------------------------------

        if (selectedGroups.isEmpty()) {

            throw new IllegalArgumentException(
                    "Select at least one character type.");
        }


        // -----------------------------------------------------
        // Length must be enough for every selected category
        // -----------------------------------------------------

        if (length < selectedGroups.size()) {

            throw new IllegalArgumentException(
                    "Password length is too short for the selected character types.");
        }


        // -----------------------------------------------------
        // Guarantee one character from every selected group
        // -----------------------------------------------------

        List<Character> characters =
                new ArrayList<>();


        for (String group : selectedGroups) {

            characters.add(
                    group.charAt(
                            secureRandom.nextInt(
                                    group.length())));
        }


        // -----------------------------------------------------
        // Fill remaining positions
        // -----------------------------------------------------

        while (characters.size() < length) {

            int index =
                    secureRandom.nextInt(
                            characterPool.length());

            characters.add(
                    characterPool.charAt(index));
        }


        // -----------------------------------------------------
        // Securely shuffle characters
        // -----------------------------------------------------

        // Collections.shuffle(list) without a supplied Random
        // uses a default Random. We therefore perform a
        // Fisher-Yates shuffle using SecureRandom.

        for (int i = characters.size() - 1; i > 0; i--) {

            int j =
                    secureRandom.nextInt(i + 1);

            Character temporary =
                    characters.get(i);

            characters.set(
                    i,
                    characters.get(j));

            characters.set(
                    j,
                    temporary);
        }


        // -----------------------------------------------------
        // Build final password
        // -----------------------------------------------------

        StringBuilder password =
                new StringBuilder(length);

        for (Character character : characters) {

            password.append(character);
        }


        return new PasswordGeneratorResponse(
                password.toString());
    }
}