package com.securevault.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "secureVaultExecutor")
    public Executor secureVaultExecutor() {

        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // Minimum number of threads always alive
        executor.setCorePoolSize(2);

        // Maximum threads that can be created
        executor.setMaxPoolSize(5);

        // Number of tasks waiting in queue
        executor.setQueueCapacity(20);

        // Prefix for thread names
        executor.setThreadNamePrefix("SecureVault-Async-");

        executor.initialize();

        return executor;
    }
}