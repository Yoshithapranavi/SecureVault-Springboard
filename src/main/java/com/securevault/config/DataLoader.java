package com.securevault.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.securevault.dto.CredentialRequest;
import com.securevault.enums.Category;
import com.securevault.repository.CredentialRepository;
import com.securevault.service.CredentialService;
import org.springframework.context.annotation.Profile;
import com.securevault.repository.UserRepository;

@Profile("demo")
@Component
public class DataLoader implements CommandLineRunner {

        private final CredentialService credentialService;
        private final CredentialRepository credentialRepository;
        private final UserRepository userRepository;

        public DataLoader(
                        CredentialService credentialService,
                        CredentialRepository credentialRepository,
                        UserRepository userRepository) {

                this.credentialService = credentialService;
                this.credentialRepository = credentialRepository;
                this.userRepository = userRepository;
        }

        @Override
        public void run(String... args) throws Exception {

                if (credentialRepository.count() > 0) {
                        System.out.println("Credentials already exist. Skipping data loading.");
                        return;
                }

                System.out.println("Loading 50 sample credentials...");

                Long userId = 2L;

                addCredential(userId, "GitHub", Category.DEVELOPMENT, "pranavi01", "Github@123", "https://github.com",
                                "GitHub Account");
                addCredential(userId, "GitLab", Category.DEVELOPMENT, "pranavi02", "Gitlab@123", "https://gitlab.com",
                                "GitLab Repository");
                addCredential(userId, "Bitbucket", Category.DEVELOPMENT, "pranavi03", "Bitbucket@123",
                                "https://bitbucket.org",
                                "Bitbucket");
                addCredential(userId, "VS Code", Category.DEVELOPMENT, "pranavi04", "VSCode@123",
                                "https://code.visualstudio.com", "Editor");
                addCredential(userId, "IntelliJ", Category.DEVELOPMENT, "pranavi05", "Idea@123",
                                "https://jetbrains.com",
                                "IDE");
                addCredential(userId, "AWS", Category.DEVELOPMENT, "awsuser", "Aws@123", "https://aws.amazon.com",
                                "Cloud");
                addCredential(userId, "Azure", Category.DEVELOPMENT, "azureuser", "Azure@123",
                                "https://azure.microsoft.com",
                                "Azure Portal");
                addCredential(userId, "Firebase", Category.DEVELOPMENT, "firebase", "Firebase@123",
                                "https://firebase.google.com", "Firebase");
                addCredential(userId, "Render", Category.DEVELOPMENT, "renderuser", "Render@123", "https://render.com",
                                "Hosting");
                addCredential(userId, "Railway", Category.DEVELOPMENT, "railway", "Railway@123", "https://railway.app",
                                "Deployment");

                addCredential(userId, "Gmail", Category.PERSONAL, "pranavi@gmail.com", "Gmail@123",
                                "https://mail.google.com",
                                "Primary Email");
                addCredential(userId, "Yahoo", Category.PERSONAL, "pranavi@yahoo.com", "Yahoo@123",
                                "https://mail.yahoo.com",
                                "Yahoo Mail");
                addCredential(userId, "Outlook", Category.PERSONAL, "pranavi@outlook.com", "Outlook@123",
                                "https://outlook.live.com", "Microsoft Mail");
                addCredential(userId, "Amazon", Category.PERSONAL, "amazonuser", "Amazon@123", "https://amazon.in",
                                "Shopping");
                addCredential(userId, "Flipkart", Category.PERSONAL, "flipkartuser", "Flipkart@123",
                                "https://flipkart.com",
                                "Shopping");
                addCredential(userId, "Myntra", Category.PERSONAL, "myntrauser", "Myntra@123", "https://myntra.com",
                                "Shopping");
                addCredential(userId, "Swiggy", Category.PERSONAL, "swiggyuser", "Swiggy@123", "https://swiggy.com",
                                "Food");
                addCredential(userId, "Zomato", Category.PERSONAL, "zomatouser", "Zomato@123", "https://zomato.com",
                                "Food");
                addCredential(userId, "Uber", Category.PERSONAL, "uberuser", "Uber@123", "https://uber.com", "Travel");
                addCredential(userId, "Ola", Category.PERSONAL, "olauser", "Ola@123", "https://olacabs.com", "Cab");

                addCredential(userId, "LinkedIn", Category.WORK, "linkedinuser", "LinkedIn@123", "https://linkedin.com",
                                "Professional");
                addCredential(userId, "Microsoft", Category.WORK, "msuser", "Microsoft@123", "https://microsoft.com",
                                "Office");
                addCredential(userId, "Google Workspace", Category.WORK, "workspaceuser", "Workspace@123",
                                "https://workspace.google.com", "Workspace");
                addCredential(userId, "Slack", Category.WORK, "slackuser", "Slack@123", "https://slack.com",
                                "Office Chat");
                addCredential(userId, "Zoom", Category.WORK, "zoomuser", "Zoom@123", "https://zoom.us", "Meetings");
                addCredential(userId, "Teams", Category.WORK, "teamsuser", "Teams@123", "https://teams.microsoft.com",
                                "Meetings");
                addCredential(userId, "Jira", Category.WORK, "jirauser", "Jira@123", "https://atlassian.com",
                                "Project Management");

                addCredential(userId, "Instagram", Category.SOCIAL, "instauser", "Instagram@123",
                                "https://instagram.com",
                                "Instagram");
                addCredential(userId, "Facebook", Category.SOCIAL, "facebookuser", "Facebook@123",
                                "https://facebook.com",
                                "Facebook");
                addCredential(userId, "Twitter", Category.SOCIAL, "twitteruser", "Twitter@123", "https://x.com",
                                "Twitter");
                addCredential(userId, "Threads", Category.SOCIAL, "threadsuser", "Threads@123", "https://threads.net",
                                "Threads");
                addCredential(userId, "Snapchat", Category.SOCIAL, "snapuser", "Snap@123", "https://snapchat.com",
                                "Snapchat");
                addCredential(userId, "Discord", Category.SOCIAL, "discorduser", "Discord@123", "https://discord.com",
                                "Discord");
                addCredential(userId, "Telegram", Category.SOCIAL, "telegramuser", "Telegram@123",
                                "https://telegram.org",
                                "Telegram");

                addCredential(userId, "HDFC Bank", Category.BANKING, "hdfcuser", "HDFC@123", "https://hdfcbank.com",
                                "Bank");
                addCredential(userId, "SBI Bank", Category.BANKING, "sbiuser", "SBI@123", "https://onlinesbi.sbi",
                                "Bank");
                addCredential(userId, "ICICI Bank", Category.BANKING, "iciciuser", "ICICI@123", "https://icicibank.com",
                                "Bank");
                addCredential(userId, "Axis Bank", Category.BANKING, "axisuser", "Axis@123", "https://axisbank.com",
                                "Bank");
                addCredential(userId, "Kotak Bank", Category.BANKING, "kotakuser", "Kotak@123", "https://kotak.com",
                                "Bank");
                addCredential(userId, "PhonePe", Category.BANKING, "phonepeuser", "PhonePe@123", "https://phonepe.com",
                                "UPI");
                addCredential(userId, "Google Pay", Category.BANKING, "gpayuser", "Gpay@123", "https://pay.google.com",
                                "UPI");

                addCredential(userId, "Netflix", Category.ENTERTAINMENT, "netflixuser", "Netflix@123",
                                "https://netflix.com",
                                "Streaming");
                addCredential(userId, "Prime Video", Category.ENTERTAINMENT, "primeuser", "Prime@123",
                                "https://primevideo.com",
                                "Streaming");
                addCredential(userId, "Disney+", Category.ENTERTAINMENT, "disneyuser", "Disney@123",
                                "https://disneyplus.com",
                                "Streaming");
                addCredential(userId, "Spotify", Category.ENTERTAINMENT, "spotifyuser", "Spotify@123",
                                "https://spotify.com",
                                "Music");
                addCredential(userId, "JioHotstar", Category.ENTERTAINMENT, "hotstaruser", "Hotstar@123",
                                "https://hotstar.com",
                                "OTT");
                addCredential(userId, "YouTube", Category.ENTERTAINMENT, "youtubeuser", "YouTube@123",
                                "https://youtube.com",
                                "Video");

                addCredential(userId, "WiFi", Category.OTHER, "homewifi", "Wifi@123", "192.168.1.1", "Router Login");
                addCredential(userId, "Laptop", Category.OTHER, "administrator", "Laptop@123", "Local System",
                                "Windows Login");
                addCredential(userId, "Printer", Category.OTHER, "printeradmin", "Printer@123", "192.168.1.50",
                                "Printer Login");

                System.out.println("50 sample credentials inserted successfully.");
        }

        private void addCredential(
                        Long userId,
                        String title,
                        Category category,
                        String username,
                        String password,
                        String website,
                        String notes) {

                CredentialRequest request = new CredentialRequest();

                request.setUserId(userId);
                request.setTitle(title);
                request.setCategory(category);
                request.setUsername(username);
                request.setPassword(password);
                request.setWebsiteUrl(website);
                request.setNotes(notes);

                String authenticatedEmail = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Seed user not found: " + userId))
                                .getEmail();

                credentialService.saveCredential(
                                request,
                                authenticatedEmail);
        }
}