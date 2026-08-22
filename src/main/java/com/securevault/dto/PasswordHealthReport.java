package com.securevault.dto;

public class PasswordHealthReport {

    private long totalCredentials;
    private long strongPasswords;
    private long mediumPasswords;
    private long weakPasswords;
    private double healthPercentage;

    public PasswordHealthReport(
            long totalCredentials,
            long strongPasswords,
            long mediumPasswords,
            long weakPasswords,
            double healthPercentage) {

        this.totalCredentials = totalCredentials;
        this.strongPasswords = strongPasswords;
        this.mediumPasswords = mediumPasswords;
        this.weakPasswords = weakPasswords;
        this.healthPercentage = healthPercentage;
    }

    public long getTotalCredentials() {
        return totalCredentials;
    }

    public long getStrongPasswords() {
        return strongPasswords;
    }

    public long getMediumPasswords() {
        return mediumPasswords;
    }

    public long getWeakPasswords() {
        return weakPasswords;
    }

    public double getHealthPercentage() {
        return healthPercentage;
    }
}