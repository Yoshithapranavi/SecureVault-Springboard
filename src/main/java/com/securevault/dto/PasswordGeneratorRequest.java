package com.securevault.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class PasswordGeneratorRequest {

    @Min(value = 8, message = "Minimum password length is 8")
    @Max(value = 64, message = "Maximum password length is 64")
    private int length;

    private boolean uppercase;
    private boolean lowercase;
    private boolean numbers;
    private boolean symbols;

    public PasswordGeneratorRequest() {
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public boolean isUppercase() {
        return uppercase;
    }

    public void setUppercase(boolean uppercase) {
        this.uppercase = uppercase;
    }

    public boolean isLowercase() {
        return lowercase;
    }

    public void setLowercase(boolean lowercase) {
        this.lowercase = lowercase;
    }

    public boolean isNumbers() {
        return numbers;
    }

    public void setNumbers(boolean numbers) {
        this.numbers = numbers;
    }

    public boolean isSymbols() {
        return symbols;
    }

    public void setSymbols(boolean symbols) {
        this.symbols = symbols;
    }
}