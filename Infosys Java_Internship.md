SecureVault 
Project Documentation
Project Title: SecureVault: A Full-Stack Password Vault & Credential Management System

Project Objective

SecureVault is a full-stack web application developed using React.js, Spring Boot, and PostgreSQL. The main objective is to provide a secure platform where users can store, organize, generate, manage, and share passwords safely. The application also includes security monitoring, audit logging, notifications, analytics, and role-based access control.

Problem Statement

Nowadays, users have multiple online accounts such as email, banking, social media, shopping, and work applications. Managing all these credentials becomes difficult because many users:

Reuse weak passwords.
Store passwords in text files or notebooks.
Forget passwords frequently.
Have no secure way to organize credentials.
Cannot securely share passwords with team members.

SecureVault solves these problems by providing a centralized and secure password management system.

Overall System Architecture

Browser
   │
   ▼
React Frontend
   │
HTTP Requests
   │
   ▼
Spring Boot Backend
   │
Spring Data JPA (Hibernate)
   │
   ▼
PostgreSQL Database



--------------------------------------------------------------------------------------------------

TASK 1 – Product Decomposition: Identify all the features required for the SecureVault application before starting development.

Concept

Before developing any application, it is divided into smaller functional modules. This process is called Product Decomposition. It helps in understanding the project scope and planning the development process.

Feature	Why does it exist?
User Registration: to create a new account

User Login: Authenticate users for safety

Password vault: to store credentials securely

Edit Credentials

Update saved credentials

Delete Credential

Search and Find credentials quickly

Password Generator: Generate strong passwords

Password Strength Checker :check password security

Password Sharing: Share credentials securely

Permissions: give access to change credentials

Password Recovery: Recover forgotten passwords

Notifications: Inform users about important events

Audit Logs: Record user activities

User Profile: Manage account details

Admin Panel: Manage users and monitor the system

Logout: to end the user session securely

--------------------------------------------------------------------------------------------------

TASK 2 
Objective

Design the high-level architecture of SecureVault.

Concept

A full-stack application consists of multiple layers where each layer has a specific responsibility.



Browser
  |

React
  |

JWT Authentication
  ↓

Spring Boot

  ├── Encryption
  ├── Audit Logs
  ├── Email Notifications
  │
  ├── PostgreSQL
  └── Redis

\--Where does JWT go?: Between React and Spring Boot to authenticate API requests because the frontend needs something to prove the user is logged in, and the backend needs to verify it on every request. Jwt is the json web token which is used for identifying the user who is logging in.

\--Where does encryption happen?
It happens inside the Spring Boot before storing data in the database. Sensitive data should be encrypted before it is stored.

\--Where should Redis be placed?
Alongside PostgreSQL to store temporary data as PostgreSQL is for permanent data. Redis is designed for fast, temporary data like cache, OTPs, or short-lived information

\--Where should audit logs be generated?
In Spring Boot whenever important user actions occur.

\--Where would email notifications originate?
From Spring Boot after events like login, password reset etc as the backend knows when event happens.


\## Why Layered Architecture?

Every layer has one responsibility.

\### Controller : Receives HTTP requests.
Example
POST /register

\### Service: Contains business logic.
Example
Check duplicate email
Create User
Save User

\### Repository: Communicates with PostgreSQL.
Uses Spring Data JPA.

\### Entity: Represents database tables.
Example
User.java maps to users table


\### DTO: Transfers data from client to backend.
Instead of sending the complete User object, client only sends name, email, password.

\# User Entity

Created

User.java

Fields

id,name,email,passwordHash,role,createdAt,updatedAt

 Why passwordHash?

Currently storing plain password.
Later, passwordHash will store BCrypt hash.
No need to rename the field later.


\# UserRepository
Created UserRepository Extended JpaRepository<User, Long>
Added findByEmail()


\### Why?
Needed for Duplicate Email Validation.
Spring automatically generates SQL.
No SQL queries written manually.

\# RegisterRequest DTO
Created RegisterRequest
Fields: name, email, password


\### Why?
Client should not send id, role, createdAt.
Server generates those automatically.

\# UserService
Implemented registerUser()

Flow
Receive Request
↓
Check Email Exists
↓
If Yes  -> Return

Email already registered

↓
Else -> Create User
↓
Save User
↓
Return Success

Business Logic belongs inside Service.


\# UserController
Created endpoint
POST
/api/auth/register

\### Flow
Client
↓
Controller
↓
Service
↓
Repository
↓
Database


\# Postman Testing
Request: POST
/api/auth/register

Body: json

{

"name":"Pranavi",

"email":"pranavi@gmail.com",

"password":"123456"

}

Response: User Registered Successfully

Duplicate request: 
Response: Email already registered

\# PostgreSQL Verification
Verified 

SELECT \* FROM users;

User successfully inserted.


\# Complete Request Flow

Postman
↓
HTTP POST
↓
UserController
↓
RegisterRequest DTO
↓
UserService
↓
UserRepository
↓
Hibernate
↓
PostgreSQL
↓
Response
↓
Postman

--------------------------------------------------------------------------------------------------

TASK 3 – Database Design
Objective: Design the database schema before backend implementation.

Concept

Database design is the foundation of backend development. Java entities are mapped directly to database tables.

Entities in Java are directly mapped to database tables.

-----Tables the application will need.


Table-1 : user


| Column        | Data Type    | Primary Key | Foreign Key |

| ------------- | ------------ | ----------- | ----------- |

| id            | BIGSERIAL    | Yes         | No          |

| name          | VARCHAR(100) | No          | No          |

| email         | VARCHAR(150) | No          | No          |

| password\_hash | TEXT         | No          | No          |

| role          | VARCHAR(20)  | No          | No          |

| created\_at    | TIMESTAMP    | No          | No          |

| updated\_at    | TIMESTAMP    | No          | No          |



Table -2 credential



| Column      | Data Type    | Primary Key | Foreign Key       |

| ----------- | ------------ | ----------- | ----------------- |

| id          | BIGSERIAL    | Yes         | No                |

| title       | VARCHAR(100) | No          | No                |

| username    | VARCHAR(100) | No          | No                |

| password    | TEXT         | No          | No                |

| website     | VARCHAR(255) | No          | No                |

| notes       | TEXT         | No          | No                |

| favorite    | BOOLEAN      | No          | No                |

| created\_at  | TIMESTAMP    | No          | No                |

| updated\_at  | TIMESTAMP    | No          | No                |

| user\_id     | BIGINT       | No          | Yes (User.id)     |

| category\_id | BIGINT       | No          | Yes (Category.id) |



table: 3 category



| Column      | Data Type    | Primary Key | Foreign Key |

| ----------- | ------------ | ----------- | ----------- |

| id          | BIGSERIAL    | Yes         | No          |

| name        | VARCHAR(100) | No          | No          |

| description | TEXT         | No          | No          |




table-4 sharedCredential



| Column        | Data Type   | Primary Key | Foreign Key         |

| ------------- | ----------- | ----------- | ------------------- |

| id            | BIGSERIAL   | Yes         | No                  |

| credential\_id | BIGINT      | No          | Yes (Credential.id) |

| shared\_with   | BIGINT      | No          | Yes (User.id)       |

| permission    | VARCHAR(20) | No          | No                  |

| expiry\_date   | TIMESTAMP   | No          | No                  |



table-5 : Audit log



| Column      | Data Type    | Primary Key | Foreign Key   |

| ----------- | ------------ | ----------- | ------------- |

| id          | BIGSERIAL    | Yes         | No            |

| user\_id     | BIGINT       | No          | Yes (User.id) |

| action      | VARCHAR(150) | No          | No            |

| description | TEXT         | No          | No            |

| created\_at  | TIMESTAMP    | No          | No            |



table-6 notification



| Column     | Data Type    | Primary Key | Foreign Key   |

| ---------- | ------------ | ----------- | ------------- |

| id         | BIGSERIAL    | Yes         | No            |

| user\_id    | BIGINT       | No          | Yes (User.id) |

| title      | VARCHAR(150) | No          | No            |

| message    | TEXT         | No          | No            |

| status     | VARCHAR(20)  | No          | No            |

| created\_at | TIMESTAMP    | No          | No            |



table-7 device



| Column      | Data Type    | Primary Key | Foreign Key   |

| ----------- | ------------ | ----------- | ------------- |

| id          | BIGSERIAL    | Yes         | No            |

| user\_id     | BIGINT       | No          | Yes (User.id) |

| device\_name | VARCHAR(100) | No          | No            |

| ip\_address  | VARCHAR(50)  | No          | No            |

| last\_login  | TIMESTAMP    | No          | No            |




 3. ER Diagram: The ER diagram shows how data is related before implementation

User
  │
  ├──── Credential
  ├──── AuditLog
  ├──── Notification
  └──── Device



Credential
     │
     └──── Category



Credential

     │
     └──── SharedCredential



One User can have many Credentials.

One Category can contain many Credentials.

One Credential can be shared many times.

One User can receive many shared credentials.

One User can have many Audit Logs.

One User can have many Notifications.

One User can have many Devices.

 -------------------------------------------------------------------------------------------------

TASK 4 – Spring Boot Project Setup
Objective: Initialize the backend project and connect it with PostgreSQL.

Concept

Spring Boot simplifies Java backend development by reducing configuration and providing built-in support for REST APIs and database connectivity.

Created using

\* Maven

\* Java 17


Dependencies

\* Spring Web

\* Spring Data JPA

\* PostgreSQL Driver

\* Lombok

Why?

Spring Boot reduces configuration and allows us to build REST APIs quickly.

 --Connected Spring Boot with PostgreSQL

Configured

application.properties

Added

\* datasource URL

\* username

\* password

\* JPA configuration

 Why?

Spring Boot must know

\* which database

\* username

\* password



Otherwise it cannot establish a connection.

--server port number: 8081

--------------------------------------------------------------------------------------------------

TASK 5 – User Registration API and BCrypt Password Hashing

Objective: Implement a registration API that stores new users in PostgreSQL.

Modify the Registration API so that passwords are stored securely using BCrypt instead of plain text.

Concept

The registration feature follows Layered Architecture.Problem Before BCrypt and Passwords should never be stored directly in the database.

BCrypt converts passwords into one-way hashes before storing them.

Yesterday, the registration flow was:

User enters password
        │
        ▼
UserService
        │
        ▼
Store password directly in PostgreSQL

Example:

Password entered:
Hello@123

Database:
Hello@123
Problem

If the database is compromised:

Every user's password is visible.
Attackers can log in to other websites if users reused passwords.
This is a major security vulnerability.so We changed the flow to:

User enters password
        │
        ▼
BCryptPasswordEncoder
        │
        ▼
Generate BCrypt Hash
        │
        ▼
Store Hash in PostgreSQL

Now the database stores:

$2a$10$...

instead of:

Hello@123

What We Implemented
1. Added BCrypt Dependency

Added to pom.xml:

<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
</dependency>

Why?

We only needed BCrypt. We did not add Spring Security because the assignment explicitly prohibited it.

2. Created SecurityConfig

Created:

config
    └── SecurityConfig.java
@Bean
public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

Why?

Instead of writing new BCryptPasswordEncoder(); everywhere, Spring creates one shared object (Bean) and injects it wherever needed.

3. Injected BCrypt into UserService

Added:

@Autowired
private BCryptPasswordEncoder passwordEncoder;

Why?

Spring automatically provides the BCrypt object.

This is called Dependency Injection.

4. Modified Registration Logic

Yesterday: user.setPasswordHash(request.getPassword());

Today: user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

This is the only business logic change required.

Request Flow
Postman

↓

UserController

↓

UserService

↓

BCryptPasswordEncoder

↓

UserRepository

↓

Hibernate

↓

PostgreSQL

Verification

Registration

Still works exactly like yesterday.

POST /api/auth/register

returns

User registered successfully
Database

Previously:

Email	Password
pranavi@gmail.com	Hello@123

Now:

Email	password_hash
pranavi11@gmail.com	$2a$10$...
Same Password Test

You tested:

Hello@123

for two different users.

Result:

$2a$10$J7...

and

$2a$10$M4...

Different hashes.

Exactly as expected.

Why Are the Hashes Different?
BCrypt automatically generates a random salt every time encode() is called.

Example:

Password

↓

Hello@123

↓

Salt A

↓

Hash A

Another user:

Password

↓

Hello@123

↓

Salt B

↓

Hash B

Same password.

Different salt.

Different hash.

This protects against rainbow table attacks.

Important Concepts Learned
BCrypt

One-way hashing algorithm for passwords.

Hashing vs Encryption
Hashing
Password

↓

Hash

×

Cannot retrieve original password

Used for passwords.

Encryption
Data

↓

Encrypted

↓

Decrypted back

Used for files, credentials, documents.

Salt

Random value added before hashing.

Makes identical passwords generate different hashes.

Dependency Injection

Spring creates objects and injects them automatically.

Instead of:

new BCryptPasswordEncoder();

Spring provides:

@Autowired
private BCryptPasswordEncoder passwordEncoder;
Bean

Object managed by Spring.

Created in:

@Configuration

using

@Bean

------------------------------------------------------------------------------------------------------------------------------------------------------------



TASK 7 – Vault Module (Credential Storage using AES Encryption)

Objective: Implement the first version of the Vault Module, allowing users to securely store their credentials. Before storing the secret (password/API key), it should be encrypted using AES encryption so that the original secret is never stored in the database.

Concept: The Vault Module is the core feature of SecureVault. It allows users to save credentials for different services such as Gmail, GitHub, Banking, Social Media, APIs, and other applications.

Unlike user login passwords, vault passwords need to be retrieved later when the user wants to view them. Therefore, AES Encryption is used instead of BCrypt.

--Why AES instead of BCrypt?

Previously, we used BCrypt for user passwords because login passwords only need verification and never need to be viewed again.

For vault credentials, users expect to retrieve their saved passwords. Since BCrypt is a one-way hashing algorithm, it cannot recover the original password. Therefore, we use AES, which is a reversible encryption algorithm.

BCrypt	                                      AES
One-way hashing	                           Two-way encryption
Cannot retrieve original password	   Original password can be decrypted
Used for Login Passwords	            Used for Vault Credentials


Vault Module Flow
User

↓

Enter Credential

↓

CredentialController

↓

CredentialService

↓

AES Encryption

↓

CredentialRepository

↓

PostgreSQL

Sensitive information is encrypted before it reaches the database.

Implementation
Step 1 – Created Credential Entity

Created: Credential.java

Field			Purpose

id			Unique credential ID
title			Service name (Gmail, GitHub, etc.)
username		Username or Email
encryptedPassword	Stores AES encrypted password
websiteUrl		Website or application URL
notes			Additional information
user			Owner of the credential
createdAt		Creation timestamp
updatedAt		Last update timestamp

Why encryptedPassword?

The assignment specifically required not to name the database column as password. Using encryptedPassword clearly indicates that the stored value is encrypted rather than plain text.

Step 2 – Relationship Between User and Credential

Added:
@ManyToOne
@JoinColumn(name = "user_id")
private User user;

Relationship

User (1)
└────────────── Credential (Many)  One user can store multiple credentials. Each credential belongs to only one user.

Step 3 – Created CredentialRequest DTO

Created:
CredentialRequest.java
Fields: title, username, password, websiteUrl, notes, userId

Why use DTO?

The client only sends the required information. The complete Credential entity is not exposed to the client. Since JWT authentication is not implemented yet, we temporarily pass userId from Postman to associate the credential with the correct user.

Example Request:

{
  "title":"Gmail",
  "username":"pranavi@gmail.com",
  "password":"Hello@123",
  "websiteUrl":"https://mail.google.com",
  "notes":"Personal Gmail",
  "userId":2
}
Step 4 – Created Credential Repository

Created:

CredentialRepository.java

Extended:

JpaRepository<Credential, Long>
Purpose: Provides CRUD operations for the Credential table. Spring Data JPA automatically generates SQL queries. No manual SQL was written.

Step 5 – Created AES Utility

Created package: util
Created: AESUtil.java

AES Encryption Flow

Original Password

↓

AES Encryption

↓

Encrypted Text

↓

Database

Example:

Original Password

Hello@123

Stored Value

dE7hf82L4P9d...
Secret Key

Used: private static final String SECRET_KEY = "1234567890123456";

For this assignment, a fixed key is acceptable.

In a production application, encryption keys should be stored securely using environment variables or secret management systems.

Step 6 – Created Credential Service

Created: CredentialService.java

Implemented:

saveCredential()

Business Logic

Receive Credential Request

↓

Find User using userId

↓

Encrypt Password using AES

↓

Create Credential Object

↓

Set User Relationship

↓

Save Credential

↓

Return Success
Password Encryption

Previously

credential.setEncryptedPassword(request.getPassword());

Now

credential.setEncryptedPassword(
        AESUtil.encrypt(request.getPassword())
);

The original password is never stored.

Step 7 – Created Credential Controller

Created: CredentialController.java

Endpoint: POST /api/vault

Complete Request Flow

Postman

↓

POST /api/vault

↓

CredentialController

↓

CredentialService

↓

AESUtil.encrypt()

↓

CredentialRepository

↓

Hibernate

↓

PostgreSQL

↓

Response
Verification
Postman Testing

Endpoint: POST /api/vault

Request Body

{
  "title":"Gmail",
  "username":"pranavi@gmail.com",
  "password":"Hello@123",
  "websiteUrl":"https://mail.google.com",
  "notes":"Personal Gmail",
  "userId":2
}

Response

Credential saved successfully.
PostgreSQL Verification

Executed

SELECT * FROM credentials;

Verified:

Credential row created successfully.
Password is stored in the encrypted_password column.
Plain password is not stored.

Example

Title	Stored Value
Gmail	dE7hf82L4P9d...
Multiple Credentials Verification

Stored multiple credentials for the same user.

Example

User	Credential
Pranavi	Gmail
Pranavi	GitHub
Pranavi	LinkedIn

This verifies the One-to-Many relationship between User and Credential.

Outcome

Successfully implemented the first version of the Vault Module.

Implemented:

Credential Entity
User–Credential Relationship
CredentialRequest DTO
CredentialRepository
AES Utility
CredentialService
CredentialController
POST /api/vault
AES Encryption before storing data
PostgreSQL Integration
Postman Testing

The application now securely stores credentials by encrypting sensitive information before saving it into the database.


------------------------------------------------------------------------------------------------------------------------------------------------------------


TASK 8 – Update and Delete Vault Credentials

Objective: Enhance the Vault Module by allowing users to update and delete their stored credentials while ensuring that:

-Sensitive passwords remain encrypted using AES.
-Users can modify only their own credentials.
-Users can delete only their own credentials.
-Updating one credential does not affect any other stored credentials.

Concept: A password vault is useful only if users can manage their stored credentials throughout their lifecycle.

This task introduces two important operations:

Update Credential
Delete Credential

Additionally, ownership verification is introduced to ensure that users cannot modify or delete credentials belonging to other users.

Vault Management Flow
User

↓

PUT / DELETE Request

↓

CredentialController

↓

CredentialService

↓

Ownership Verification

↓

Password Changed?

├── Yes → AES Encrypt

└── No → Keep Existing Encrypted Password

↓

Repository

↓

PostgreSQL

Implementation
Task 1 – Update Credential

Created endpoint:

PUT /api/vault/{credentialId}
Purpose: Allows users to update:

-Title, Username, Password, Website URl, Notes, Business Logic

Implemented:

updateCredential()

Flow:

Receive Update Request

↓

Find Credential using

credentialId + userId

↓

Credential Found?

├── No

│      Return

│      "Credential not found or access denied."

│

└── Yes

↓

Update Title

↓

Update Username

↓

Update Website URL

↓

Update Notes

↓

Password Changed?

├── Yes

│      AES Encrypt

│

└── No

│      Keep Existing Encrypted Password

↓

Update Timestamp

↓

Save Credential

↓

Return Success
Password Encryption Logic: Previously, passwords were encrypted only during credential creation.

Now the same encryption process is applied whenever a user changes the password.

Updated password flow:

New Password

↓

AES Encrypt

↓

encryptedPassword

↓

PostgreSQL

The original password is never stored.

Avoiding Unnecessary Encryption

Requirement: If password is not changed, avoid re-encrypting.
Implemented using:

if(request.getPassword()!=null &&
   !request.getPassword().isBlank())

If the password field is empty:

Existing encrypted password remains unchanged.
Only the other fields are updated.

This avoids generating a new encrypted value unnecessarily.

Task 2 – Delete Credential

Created endpoint:

DELETE /api/vault/{credentialId}
Purpose: Allows users to permanently remove a selected credential from their vault.

Business Logic:

Implemented:

deleteCredential()

Flow:

Receive Delete Request

↓

Find Credential

using credentialId + userId

↓

Credential Found?

├── No

│      Return

│      "Credential not found or access denied."

│

└── Yes

↓

Delete Credential

↓

Return Success

Only the selected credential is removed.

No other credentials belonging to the same user are affected.

Task 3 – Ownership Verification

Ownership verification was added before both update and delete operations.

Implemented using:

findByIdAndUserId()

instead of

findById()
Why?

Every credential belongs to a specific user.

Before allowing update or delete operations, the application verifies that:

The credential exists.
The credential belongs to the current user.

If either condition fails:

Credential not found or access denied.

is returned.

This prevents one user from modifying another user's data.

Repository Enhancement

Added custom repository method:

Optional<Credential> findByIdAndUserId(
        Long credentialId,
        Long userId
);

Spring Data JPA automatically generates a query similar to:

SELECT *
FROM credentials
WHERE id = ?
AND user_id = ?;

This combines retrieval and ownership verification in a single database query.

Complete Update Flow
Postman

↓

PUT /api/vault/{credentialId}

↓

CredentialController

↓

CredentialService

↓

Ownership Verification

↓

Password Changed?

├── Yes

│      AES Encrypt

│

└── No

│      Keep Existing Password

↓

Repository

↓

Hibernate

↓

PostgreSQL
Complete Delete Flow
Postman

↓

DELETE /api/vault/{credentialId}

↓

CredentialController

↓

CredentialService

↓

Ownership Verification

↓

Repository

↓

Hibernate

↓

PostgreSQL
Verification
Update Verification

Verified the following:

Credential updated successfully.
Title updated.
Username updated.
Website URL updated.
Notes updated.

When password was changed:

AES encryption was applied.
Encrypted value stored in PostgreSQL.

When password was not changed:

Existing encrypted password remained unchanged.
Delete Verification

Verified the following:

Selected credential deleted successfully.
PostgreSQL row removed.
Remaining credentials remained unaffected.
Ownership Verification

Verified:

Only credentials belonging to the specified user could be updated.
Only credentials belonging to the specified user could be deleted.
Invalid ownership returned:
Credential not found or access denied.
Outcome

Successfully enhanced the Vault Module with complete credential management functionality.

Implemented:

Credential Update API
Credential Delete API
Ownership Verification
Conditional AES Encryption
Secure Update Flow
Secure Delete Flow
PostgreSQL Integration
Postman Testing

The Vault Module now supports complete credential lifecycle management while maintaining data security and ownership validation.

-----------------------------------------------------------------------------------------------------------------------------------------------------------

Task-9 

Part A – Login Module
Concept: After implementing user registration, users should be able to log in using their registered email and password.
Since passwords are stored using BCrypt hashing, the original password cannot be compared directly. Instead, BCrypt verifies whether the entered password matches the stored hash.

Login Flow
Client

↓

POST /api/auth/login

↓

UserController

↓

UserService

↓

Find User by Email

↓

BCrypt.matches()

↓

Password Correct?

├── Yes
│
│   Login Successful
│
└── No
│
Invalid Email or Password

Implementation: Created LoginRequest DTO

Contains:email, password
Purpose: Transfer only the required login data from the client.

UserService == Implemented: loginUser()

Steps:
-Find user by email.
-If user does not exist, return an error.
-Compare entered password with stored BCrypt hash using:
-passwordEncoder.matches(rawPassword, storedHash)
-If matched, return Login Successful.
-Otherwise, return Invalid Email or Password.

UserController== Created endpoint: POST /api/auth/login

Verification:

Valid email + password → Login Successful
Invalid password → Error message
Invalid email → Error message

Part B – Read Credential
Concept: Credentials stored inside PostgreSQL contain encrypted passwords.
Whenever a user views a credential, the password must first be decrypted using AES before being returned.

Read Flow
GET /api/vault/{credentialId}

↓

CredentialController

↓

CredentialService

↓

Repository

↓

Retrieve Encrypted Password

↓

AES Decrypt

↓

CredentialResponse

↓

Client

Implementation== Created: CredentialResponse DTO

Purpose:Return decrypted credential information instead of exposing the Entity directly.

Contains:id,title,username,websiteUrl,notes, AESUtil
Added: decrypt()
Purpose: Decrypt encrypted passwords retrieved from PostgreSQL.

CredentialService

Implemented: getCredential()

Responsibilities:

Verify ownership
Retrieve credential
Decrypt password
Populate CredentialResponse
Return response
CredentialController

Created endpoint:

GET /api/vault/{credentialId}
Verification

Database:

encryptedPassword

↓

Encrypted Value

API Response:

password

↓

Original Password

The database never stores plain-text passwords.

Part C – List All Credentials
Concept: Users should be able to retrieve every credential stored inside their vault.
Each credential's encrypted password must be decrypted before sending it back to the client.

Flow
GET /api/vault/user/{userId}

↓

CredentialController

↓

CredentialService

↓

Repository

↓

Find All Credentials

↓

Loop Through Credentials

↓

AES Decrypt

↓

List<CredentialResponse>

↓

Client

Implementation

Repository

Added:

List<Credential> findByUserId(Long userId);

Spring Data JPA automatically generates:

SELECT *
FROM credentials
WHERE user_id = ?;
Service

Implemented:

getAllCredentials()

Responsibilities:

Retrieve all credentials
Loop through every credential
Decrypt passwords
Convert Entity to DTO
Return List<CredentialResponse>
Controller

Created endpoint:

GET /api/vault/user/{userId}
Verification: 
Multiple credentials returned.
Passwords successfully decrypted.
Database continues storing encrypted values only.


Part D – Bean Validation
Concept: Validation prevents invalid data from entering the application.
Instead of allowing invalid requests to reach the Service layer, Spring automatically validates incoming data before processing.

Validation Flow
Client

↓

@Valid

↓

DTO Validation

↓

Controller

↓

Service

↓

Repository
Dependency Added

Added:

spring-boot-starter-validation
RegisterRequest Validation

Implemented:

@NotBlank
@Email

Validations:

Name cannot be blank.
Email must be valid.
Password cannot be blank.
LoginRequest Validation

Implemented:

Email validation
Password validation
CredentialRequest Validation

Implemented:

Title required
Username required
Password required
User ID required
Controllers Updated

Added:

@Valid

to:

Register API
Login API
Create Credential API
Update Credential API
Verification

Invalid requests now return validation errors before reaching the Service layer.

Example:

{
    "email": "Invalid email format",
    "password": "Password is required"
}


Part E – Global Exception Handling
Concept: Instead of handling exceptions inside every controller or service, a centralized exception handler processes all application errors.
This improves code maintainability and provides consistent API responses.

Flow
Controller

↓

Exception

↓

GlobalExceptionHandler

↓

ResponseEntity

↓

Client
Implementation

Created package:

exception

Created class:

GlobalExceptionHandler
Handled Validation Exceptions

Implemented:

MethodArgumentNotValidException

Returns validation errors as JSON.

Handled Runtime Exceptions

Implemented:

RuntimeException

Returns appropriate error messages with HTTP 400 status.

Handled Generic Exceptions

Implemented:

Exception

Returns HTTP 500 response for unexpected application errors.

Verification

Validation errors return proper messages.
Runtime exceptions handled centrally.
Unexpected exceptions return HTTP 500.

Final Architecture
                  Client (Postman)

                         │
                         ▼

                  REST Controller

                         │

                    @Valid Validation

                         │
                         ▼

                   Service Layer

          ┌──────────────┴──────────────┐
          ▼                             ▼

   BCrypt Password Encoder         AES Utility

          │                             │

          └──────────────┬──────────────┘
                         ▼

                  Spring Data JPA

                         │
                         ▼

                    PostgreSQL

                         │
                         ▼

           Global Exception Handler


Final User Journey
User Registers
        │
        ▼
Password → BCrypt Hash
        │
        ▼
Stored in PostgreSQL
        │
        ▼
User Logs In
        │
        ▼
BCrypt Verification
        │
        ▼
Create Credential
        │
        ▼
AES Encrypt
        │
        ▼
Stored in PostgreSQL
        │
        ▼
Read Credential
        │
        ▼
AES Decrypt
        │
        ▼
List Credentials
        │
        ▼
Update Credential
        │
        ▼
AES Re-Encrypt
        │
        ▼
Delete Credential
Outcome

Successfully completed Milestone 1 of the SecureVault backend.

------------------------------------------------------------------------------------------------------------------------------------------------------------

Milestone 2 Documentation
Task: JWT Authentication & Spring Security Integration

Objective: Enhance the SecureVault backend by implementing JWT-based authentication and Spring Security to protect sensitive Vault APIs.

The objective is to ensure that:

Only authenticated users can access Vault APIs.
Users receive a JWT after successful login.
Every protected request is authenticated using the JWT instead of server-side sessions.
Spring Security manages authorization for secured endpoints.
Why JWT Authentication?

Until the previous milestone, every Vault API could be accessed directly by anyone who knew the endpoint.

Example:

GET /api/vault/user/2

No authentication was required.

This created a security risk because anyone could access another user's credentials.

JWT Authentication solves this problem by verifying the identity of the user before allowing access to protected resources.

Authentication Flow
User Login
      │
      ▼
Verify Email
      │
      ▼
Verify BCrypt Password
      │
      ▼
Generate JWT
      │
      ▼
Return JWT to Client
      │
      ▼
Client Stores JWT
      │
      ▼
Every Request Sends JWT
      │
      ▼
JwtAuthenticationFilter
      │
      ▼
Validate JWT
      │
      ▼
Authenticate User
      │
      ▼
Access Vault APIs

------------------------------------------
Part A – Spring Security Configuration

Concept: Spring Security acts as the first security checkpoint for every incoming request. Instead of directly reaching the controller, every request passes through Spring Security first.

Flow
Client

↓

Spring Security

↓

Controller

↓

Service

↓

Repository

Implementation:
Added dependency: spring-boot-starter-security

Created:securityConfig.java

Configured:
Stateless Authentication
SecurityFilterChain
Disabled HTTP Basic Authentication
Disabled CSRF
Public APIs
Protected APIs
Public APIs

Allowed without authentication:

POST /api/auth/register

POST /api/auth/login

Protected APIs

JWT required:

GET /api/vault/**

POST /api/vault/**

PUT /api/vault/**

DELETE /api/vault/**
Session Policy

Configured:

SessionCreationPolicy.STATELESS

Meaning: The server does not maintain user sessions. Every request must include a valid JWT.

-----------------------------------------------------------------------------------------------------

Part B – JWT Service

Concept: JwtService is responsible for creating and validating JSON Web Tokens. It performs four major operations:
Generate Token
Extract Username
Check Expiration
Validate Token
Generate Token

Flow

Username

↓

JwtService

↓

JWT Builder

↓

Digitally Signed JWT

↓

Client

Implementation
Implemented: generateToken()

Responsibilities:

Store username
Store issued time
Store expiration time
Digitally sign token
Return JWT
Extract Username

Implemented: extractUsername()

Purpose: Retrieve the username stored inside the JWT. Extract Expiration

Implemented: extractExpiration()

Purpose: Retrieve the token expiry date.

Check Expiration

Implemented: isTokenExpired()

Purpose:Prevent expired tokens from accessing protected APIs.

Validate Token

Implemented: validateToken()

Validation includes:

Username matches
Token has not expired
Signature is valid

-------------------------------------------------------------------------------

Part C – JWT Authentication Filter
Concept

The JwtAuthenticationFilter intercepts every incoming request before it reaches the controller.

It validates the JWT and authenticates the request.

Flow
Request

↓

Read Authorization Header

↓

Extract JWT

↓

Extract Username

↓

Validate JWT

↓

Create Authentication Object

↓

SecurityContext

↓

Continue Filter Chain

↓

Controller

Implementation

Created:JwtAuthenticationFilter.java

Implemented:

Read Authorization Header
Check "Bearer" Token
Extract JWT
Extract Username
Validate Token
Authenticate Request
Continue Filter Chain
Authorization Header

Expected format:Authorization
Bearer eyJhbGc...
SecurityContext

When a valid JWT is found:

Spring Security stores the authenticated user inside:

SecurityContextHolder:  This allows all subsequent security checks to recognize the user as authenticated.

-----------------------------------------------------------------------------------------------------------------------------

Part D – Login API Modification

Previous Flow
Email

↓

Password

↓

BCrypt Verification

↓

Login Successful

New Flow

Email

↓

Password

↓

BCrypt Verification

↓

Generate JWT

↓

Return JWT

Implementation

Created: LoginResponse DTO

Contains: token

Modified: loginUser()

Responsibilities:

Verify email
Verify BCrypt password
Generate JWT
Return LoginResponse
Sample Response
{
  "token":"eyJhbGc..."
}

---------------------------------------------------------------------

Part E – Securing Vault APIs

Configured Spring Security to protect:

GET /api/vault/**

POST /api/vault/**

PUT /api/vault/**

DELETE /api/vault/**

Only authenticated users with a valid JWT are allowed.

Complete Request Flow
Client Request

↓

Authorization Header

↓

JwtAuthenticationFilter

↓

Extract JWT

↓

Validate JWT

↓

SecurityContext

↓

Spring Security

↓

Controller

↓

Service

↓

Repository

↓

PostgreSQL

Postman Testing
Test 1 – Register
POST /api/auth/register

Result: User registered successfully.

Test 2 – Login
POST /api/auth/login

Result: JWT generated successfully.

Test 3 – Vault Without JWT
GET /api/vault/user/{id}

Result: 401 Unauthorized


Test 4 – Vault With JWT

Authorization: Bearer Token
JWT:eyJhbGc...
Result:200 OK

Protected resource successfully accessed.

Security Architecture
                    Client (Postman)

                           │
                           ▼

                     Login Request

                           │
                           ▼

                    UserController

                           │
                           ▼

                     UserService

                           │

              BCrypt Password Verification

                           │

                 Generate JWT Token

                           │

                 Return JWT to Client

────────────────────────────────────────────

Subsequent Requests

Authorization:
Bearer Token

                           │
                           ▼

             JwtAuthenticationFilter

                           │

            Read Authorization Header

                           │

                Extract JWT Token

                           │

               Validate JWT Token

                           │

       SecurityContext Authentication

                           │

                SecurityFilterChain

                           │

                    Controller

                           │

                     Service Layer

                           │

                 Spring Data JPA

                           │

                     PostgreSQL


----------------------------------------------------------------------------------------------------------------------------------------------------------


Task: Category Support, Search, Filtering & Database Optimization

Objective: Enhance the SecureVault backend by organizing credentials into categories, implementing efficient search and filtering functionality, and improving database performance using indexes.
The objective of this milestone is to make credential management easier by allowing users to categorize credentials, quickly search for them, and retrieve only the required records.

Why was this enhancement required?

As the number of stored credentials increases, finding a specific credential becomes difficult.

Example:

GitHub
LinkedIn
Netflix
Amazon
Instagram
SBI
Gmail
Discord

Searching manually through hundreds of credentials is inefficient. Therefore, the following features were introduced:

Credential Categories
Search Functionality
Category Filtering
Database Indexing

Overall Workflow
User Creates Credential
          │
          ▼
Select Category
          │
          ▼
Credential Stored in PostgreSQL
          │
          ▼
User Searches
          │
          ▼
Repository Query
          │
          ▼
Matching Credentials Returned

----------------------------------------------------------------------------------------
Task 1 – Category Support

Objective: Allow every credential to belong to a predefined category.

Category Enum

Created:Category.java

Values:

PERSONAL

WORK

DEVELOPMENT

SOCIAL

BANKING

ENTERTAINMENT

OTHER
Why Enum?

Instead of allowing users to type categories manually,

Example:

Banking

BANKING

bank

BANK

all credentials use predefined values.

Advantages:

Prevents spelling mistakes
Maintains consistent data
Simplifies filtering
Improves database integrity
Credential Entity

Added new field:

@Enumerated(EnumType.STRING)
private Category category;
Why EnumType.STRING?

Instead of storing

0
1
2
3

the database stores

BANKING

WORK

DEVELOPMENT

Advantages:

Easy to understand
Safer for future modifications
Better readability
DTO Updates

Updated: CredentialRequest

Added: category category

Updated: CredentialResponse

Added: Category category

Service Layer

Modified: saveCredential()

Now stores

Category

Modified: updateCredential()

Allows category modification.

-----------------------------------------------------------------------

Task 2 – Search Functionality

Objective: Allow users to search credentials using a keyword.

Endpoint
GET /api/vault/search
Search Parameters

Supports searching by:

Title
Username
Website URL
Repository Query

Implemented JPQL query using

@Query

Search logic:

Title contains keyword

OR

Username contains keyword

OR

Website contains keyword

Case-Insensitive Search = Implemented using LOWER()

Example: 

Searching

github

returns

GitHub

Searching

GITHUB

also returns GitHub

User Isolation :Search query also filters using

userId-This ensures User A cannot search User B's credentials.

Search Flow
Client

↓

CredentialController

↓

CredentialService

↓

CredentialRepository

↓

JPQL Search Query

↓

PostgreSQL

↓

Matching Credentials

↓

AES Password Decryption

↓

Response

---------------------------------------------------------------------------

Task 3 – Category Filter

Objective: Allow users to retrieve credentials belonging to a specific category.

Endpoint
GET /api/vault

Example

GET /api/vault?userId=2&category=DEVELOPMENT

Repository: Implemented Spring Data JPA derived query

findByUserIdAndCategory()

Service : Created: getCredentialsByCategory()

Responsibilities:

Retrieve credentials
Decrypt passwords
Convert Entity → DTO
Return filtered list

Controller : Added endpoint

GET /api/vault

Accepts : userId

category: Returns only matching credentials.

Category Filter Flow
Client

↓

Controller

↓

Service

↓

Repository

↓

Category Query

↓

Matching Records

↓

Decrypt Password

↓

Response

-------------------------------------------------------------------------

Task 4 – Database Optimization

Objective: Improve query performance by adding indexes.

Added Indexes

title

category

inside

Credential Entity

Example

@Table(
    name = "credentials",
    indexes = {
        @Index(name="idx_title", columnList="title"),
        @Index(name="idx_category", columnList="category")
    }
)
Why Title?

Search operations frequently use

title

Example

GitHub

Google

Netflix

Instead of scanning the entire table,

the database directly uses the index.

Why Category?

Filtering frequently uses

category

Example

DEVELOPMENT

BANKING

SOCIAL

Indexing improves filter performance.

Testing

Test 1: Create Credential

Result: Credential saved successfully.

Test 2: Search by Title

Keyword: git

Result: Returned GitHub credential.

Test 3

Search by Username: Keyword: pranavi11

Result: Returned matching credential.

Test 4

Search by Website: Keyword: github

Result: Returned matching credential.

Test 5

Category Filter: category=DEVELOPMENT

Result: Returned only DEVELOPMENT credentials.

Test 6: Empty Search: Keyword: xyz123

Result: []

Returned an empty list instead of an exception.

Final Architecture
                Client (Postman)

                       │
                       ▼

            Search / Filter Request

                       │
                       ▼

             CredentialController

                       │
                       ▼

              CredentialService

                       │

        AES Password Decryption

                       │
                       ▼

           CredentialRepository

                       │

     JPQL / Derived Query Methods

                       │
                       ▼

                 PostgreSQL

                       │
                       ▼

             Matching Credentials

                       │
                       ▼

             CredentialResponse




---------------------------------------------------------------------------------------------------------------------------------------------------------

Password Intelligence Module

Objective: The objective of this module is to improve SecureVault beyond simple password storage by providing intelligent password analysis and secure password generation. This module helps users evaluate the strength of their passwords and generate cryptographically secure passwords using Java's SecureRandom.

Module A – Password Strength Analyzer

Objective: Evaluate the security strength of a password based on predefined rules and provide useful feedback to improve weak passwords.
API: POST : /api/password/strength
Request
{
    "password":"Hello123"
}

Validation Rules
Rule	Score
Password length ≥ 12	+1
Contains uppercase letter	+1
Contains lowercase letter	+1
Contains number	+1
Contains special character	+1

Maximum Score: 5

Strength Calculation
Score	Strength
0–2	Weak
3–4	Medium
5	Strong

Example 1
Request
{
    "password":"hello"
}
Response
{
    "success": true,
    "message": "Password analyzed successfully.",
    "data": {
        "score": 1,
        "strength": "Weak",
        "feedback": [
            "Increase password length to at least 12 characters.",
            "Add at least one uppercase letter.",
            "Add at least one number.",
            "Add at least one special character."
        ]
    }
}
Example 2
Request
{
    "password":"Hello123"
}
Response
{
    "success": true,
    "message": "Password analyzed successfully.",
    "data": {
        "score": 3,
        "strength": "Medium",
        "feedback": [
            "Increase password length to at least 12 characters.",
            "Add at least one special character."
        ]
    }
}
Example 3
Request
{
    "password":"Hello@123SecureVault"
}
Response
{
    "success": true,
    "message": "Password analyzed successfully.",
    "data": {
        "score": 5,
        "strength": "Strong",
        "feedback": []
    }
}

Business Logic: The Password Strength Analyzer performs the following operations:
Receives password from client.
Evaluates five security rules.
Assigns score.
Determines password strength.
Generates improvement suggestions.
Returns analysis result.

Architecture
Client
      │
      ▼
PasswordController
      │
      ▼

PasswordService
      │
      ▼
PasswordStrengthResponse
      │
      ▼
JSON Response
----------------------------------------------------
Module B – Password Generator

Objective: Generate strong and unpredictable passwords using Java's cryptographically secure random number generator.

API: POST: /api/password/generate
Request
{
    "length":16,
    "uppercase":true,
    "lowercase":true,
    "numbers":true,
    "symbols":true
}

Response

Example

{
    "success": true,
    "message": "Password generated successfully.",
    "data": {
        "password":"A@9kLm#2Qw!P8zRt"
    }
}

Every request produces a different password.

Generator Configuration

The user can configure:

Password Length
Include Uppercase Letters
Include Lowercase Letters
Include Numbers
Include Symbols
Character Sets

Uppercase: ABCDEFGHIJKLMNOPQRSTUVWXYZ
Lowercase: abcdefghijklmnopqrstuvwxyz
Numbers: 0123456789
Symbols: !@#$%^&*()-_=+[]{};:,.<>?

Business Logic: The Password Generator performs the following operations:
Receives generation configuration.
Builds a character pool based on selected options.
Uses Java SecureRandom.
Randomly selects characters from the pool.
Generates password of requested length.
Returns generated password.

Why SecureRandom?
Instead of Random random = new Random(); the project uses SecureRandom random = new SecureRandom(); because SecureRandom
Generates cryptographically secure random values.
Produces unpredictable passwords.
Is recommended for authentication and security applications.

Architecture
Client

      │

      ▼

PasswordController

      │

      ▼

PasswordService

      │

      ▼

PasswordGeneratorResponse

      │

      ▼

JSON Response

-------------------------------------------------------------------------------------------------

Task 1: Password History & Reuse Prevention

Objective: To maintain a secure history of passwords for every credential and prevent users from reusing recently used passwords.

Features Implemented
1. PasswordHistory Entity: Created a new entity named PasswordHistory with the following fields:
Field	                  Description
id	                  Primary Key
credential	          Foreign Key referencing Credential
encryptedPassword	     AES encrypted previous password
version	           Password version number
createdAt	            Timestamp when password was archived

Relationship implemented:

One Credential
        |
        | 1
        |
        | *
PasswordHistory

2. Password History Storage
Whenever a credential password is updated: 
The existing encrypted password is stored in the PasswordHistory table.
The new password is encrypted using AES.
The credential is updated with the newly encrypted password.
Both operations are executed within a single transaction using @Transactional.
This ensures database consistency.

3. Password Reuse Prevention

Before updating a password:
The last five PasswordHistory records are retrieved.
Each stored password is decrypted using the AES utility.
The decrypted passwords are compared with the incoming password.
If the password matches any of the last five passwords, the update is rejected.

Application returns:
HTTP Status : 409 Conflict with an appropriate error message.

4. Password Version Management
Password versions are maintained automatically.

Example:

Version	Password
1	      Password A
2	      Password B
3	       Password C

Every password change creates a new version. Existing history records are never modified.

5. Business Rules Implemented

Password history is created only when:
Password changes
Password history is NOT created when only:
Title changes
Username changes
Website changes
Notes change
Category changes

All passwords stored inside PasswordHistory remain AES encrypted.

APIs Updated (Task 1)
Update Credential
PUT /api/vault/{credentialId}
New validations added:
Password history creation
Password reuse validation
Version management
Database Changes (Task 1)

Added new table:
password_history
Columns:
id
credential_id
encrypted_password
version
created_at

-----------------------------------------------

Task 2: Soft Delete & Restore

Objective: Replace permanent deletion with logical deletion to improve data recovery and auditability.
Features Implemented
1. Credential Entity Updated
Added two new fields:
private boolean deleted = false;
private LocalDateTime deletedAt;
Database columns added:
deleted
deleted_at

2. Soft Delete
The existing delete operation was modified.
Instead of removing the record:
DELETE FROM credentials the application now performs:
deleted = true
deletedAt = Current Timestamp
The credential remains inside the database but becomes invisible in normal operations.

3. Trash API
Implemented endpoint: GET /api/vault/trash
Returns:
Only deleted credentials
Credentials where
deleted = true

4. Restore API
Implemented endpoint: PUT /api/vault/restore/{credentialId}
Restore process:

deleted = false
deletedAt = null

Credential becomes active again.

5. Permanent Delete API

Implemented endpoint:

DELETE /api/vault/permanent/{credentialId}

This operation permanently removes:

Credential
Associated Password History

Audit logs remain unchanged.

6. Existing APIs Updated

The following APIs were modified to automatically ignore deleted credentials.

Updated APIs:

Get Credential
Get All Credentials
Search Credentials
Category Filter
Update Credential

Repository methods now filter using:

deleted = false

Deleted credentials are only accessible through the Trash API.

Repository Changes

Additional repository methods added:

findByUserIdAndDeletedFalse()

findByUserIdAndDeletedTrue()

findByIdAndDeletedTrue()

findByIdAndUserIdAndDeletedFalse()

Search queries updated to include:

deleted = false
Service Layer Changes

Implemented:

Soft Delete
Restore Credential
Permanent Delete
Trash Retrieval

Audit log entries are created for:

DELETE
RESTORE
PERMANENT_DELETE
Controller APIs
Method	Endpoint	Purpose
DELETE	/api/vault/{id}	Soft Delete
GET	/api/vault/trash	View Trash
PUT	/api/vault/restore/{id}	Restore Credential
DELETE	/api/vault/permanent/{id}	Permanent Delete
Business Rules Implemented

Deleted credentials:

Cannot be updated
Cannot be searched
Cannot be viewed
Cannot appear in category filters
Cannot appear in Get All APIs

Deleted credentials are visible only inside:

GET /api/vault/trash
Database Changes

Credential table updated with:

deleted BOOLEAN

deleted_at TIMESTAMP
Audit Logging

Audit log entries are generated for:

DELETE

RESTORE

PERMANENT_DELETE

Audit history remains intact even after permanent deletion.

APIs Tested Successfully
User Registration
Login
Save Credential
Update Credential
Password Reuse Validation
View Credential
View All Credentials
Search
Category Filter
Soft Delete
Trash
Restore
Permanent Delete

-----------------------------------------------------------------------------------------------

Task 3: Custom Thread Pool & Asynchronous Processing

Objective: Improve application responsiveness by executing time-consuming operations in the background using Spring Boot's asynchronous processing with a custom thread pool.

Features Implemented:

Custom Thread Pool Configuration
Asynchronous Processing using Spring Boot
Background Email Notification
Background Activity Logging
Background Password Strength Recalculation
Thread Name Logging
Concurrent Request Processing
Thread Reuse Verification

1. Custom Thread Pool Configuration

Created a configuration class:

AsyncConfig.java

Configured a custom ThreadPoolTaskExecutor.

Configuration includes:

Core Pool Size
Maximum Pool Size
Queue Capacity
Thread Name Prefix

Asynchronous processing enabled using:

@EnableAsync

A custom executor bean named:
taskExecutor was created and used throughout the application.

2. Background Email Notification

Created an asynchronous email service.

Implemented using:

@Async("taskExecutor")

Whenever important operations occur, a simulated email notification executes in the background.

Examples:

Credential Created
Credential Updated
Password Changed

The API response is returned immediately without waiting for the email task to finish.

3. Background Activity Logging

Activity logging was moved to execute asynchronously.

Logged activities include:

CREATE
UPDATE
DELETE
RESTORE
PERMANENT_DELETE

Audit logs are created in the background using the custom thread pool.

4. Password Strength Recalculation

Password strength recalculation was also executed asynchronously.

Whenever a credential password is created or updated:

Password strength is recalculated
Result is stored
User request is not blocked

5. Thread Name Logging

For verification, every asynchronous task logs the executing thread.

Example log:

Request Thread:
http-nio-8081-exec-1

Background Thread:
SecureVault-1

This confirms that background tasks execute on the custom executor instead of the request thread.

6. Concurrent Request Testing

Multiple concurrent requests were executed using Postman Runner.

Observations:
Multiple requests executed successfully.
Background tasks ran simultaneously.
Threads were reused efficiently.
No blocking occurred on request threads.
Repository Changes

No repository changes were required.

Service Layer Changes

Implemented asynchronous methods for:

Email Notification
Activity Logging
Password Strength Recalculation

All methods use:

@Async("taskExecutor")
Controller APIs
Method	Endpoint	Purpose
POST	/api/vault	Save Credential (Triggers Async Tasks)
PUT	/api/vault/{id}	Update Credential (Triggers Async Tasks)
Business Rules Implemented
Background tasks must not block user requests.
All asynchronous methods execute using the custom thread pool.
Request thread and worker thread must be different.
Worker threads are reused for better performance.
Multiple concurrent requests are supported.
Database Changes

No database schema changes were required.

Audit Logging

Activity logging executes asynchronously for:

CREATE
UPDATE
DELETE
RESTORE
PERMANENT_DELETE

Audit records continue to be stored in the database while improving application responsiveness.

APIs Tested Successfully
Save Credential
Update Credential
Email Notification
Activity Logging
Password Strength Recalculation
Concurrent Request Processing
Thread Reuse Verification


---------------------------------------------------------------------------------------------

Task 4: Credential Sharing & Permission Management

Objective: Allow users to securely share credentials with other registered users while maintaining proper access control. The module enables controlled collaboration by allowing credential owners to grant READ or EDIT permissions without transferring ownership.

Features Implemented:

Credential Sharing Entity
Permission Model
Share Credential
View Shared Credentials
Update Share Permission
Revoke Sharing
Authorization Checks
Business Rule Enforcement

1. Credential Sharing Entity

Created a new entity: CredentialShare
Entity fields:
id
credential
owner
sharedWith
permission
sharedAt
expiresAt
active

Relationships implemented:

One Credential can have multiple shared users.
One User can own multiple shared credentials.
One User can receive multiple shared credentials.

2. Permission Model

Implemented two permission levels: READ
Users with READ permission can:
View shared credential
View username
View website URL
View decrypted password

Users with READ permission cannot:
Update credential
Delete credential
Permanently delete credential
Share credential with another user
Transfer ownership
EDIT

Users with EDIT permission can:

View shared credential
Update credential information

Users with EDIT permission cannot:

Delete credential
Permanently delete credential
Transfer ownership
Share credential with another user

Only the credential owner retains complete ownership.

3. Share Credential

Implemented endpoint: POST /api/share

The owner can securely share a credential with another registered user by specifying:

Credential ID
Shared User ID
Permission (READ / EDIT)

The system validates ownership before allowing the share.

4. View Shared Credentials

Implemented endpoint: GET /api/share/shared-with-me/{userId}

Returns all active credentials shared with the logged-in user.

Only active shares are displayed.

Revoked or deleted credentials are automatically excluded.

5. Update Share Permission

Implemented endpoint: PUT /api/share/{shareId}/permission

Allows the credential owner to update permissions.
Supported permission changes:

READ → EDIT
EDIT → READ
Changes take effect immediately.

6. Revoke Sharing

Implemented endpoint: DELETE /api/share/{shareId}

Instead of deleting the share record:

active = false;

The sharing history is preserved while immediately removing access.

7. Authorization Checks

Updated existing Vault APIs to validate access before performing operations.

Authorization Flow:

Is User Owner?

↓

Yes

↓

Allow Access

↓

No

↓

Is Credential Shared?

↓

Yes

↓

Check Permission

↓

READ → View Only

EDIT → View + Update

↓

Otherwise

403 Forbidden

Authorization checks were implemented for:

View Credential
Update Credential
Delete Credential

Only the owner can permanently delete credentials.

8. Business Rule Enforcement

Implemented the following business rules:

Users cannot share credentials with themselves.
Only the credential owner can initiate sharing.
Duplicate sharing with the same user is prevented.
Deleted credentials cannot be shared.
Soft-deleted credentials do not appear in shared lists.
Revoked shares immediately lose access.
Only owners can modify permissions.
Only owners can permanently delete credentials.
Repository Changes

Additional repository methods implemented:

findBySharedWith()

findByCredentialAndSharedWithAndActiveTrue()

findByCredentialAndSharedWith()

findByOwner()

findByActiveTrue()

Repository methods filter active sharing records to prevent unauthorized access.

Service Layer Changes

Implemented:

Share Credential
View Shared Credentials
Update Share Permission
Revoke Share
Permission Validation
Authorization Validation

Existing Credential Service updated to support:

Owner validation
Shared user validation
READ permission checks
EDIT permission checks
Controller APIs
Method	Endpoint	Purpose
POST	/api/share	Share Credential
GET	/api/share/shared-with-me/{userId}	View Shared Credentials
PUT	/api/share/{shareId}/permission	Update Permission
DELETE	/api/share/{shareId}	Revoke Sharing
Business Rules Implemented
Users cannot share credentials with themselves.
Only owners can share credentials.
Duplicate sharing is prevented.
READ users cannot update credentials.
EDIT users can update credentials.
Shared users cannot delete credentials.
Revoked users immediately lose access.
Unauthorized users receive 403 Forbidden.
Deleted credentials cannot be shared.
Database Changes

Created a new table:

credential_shares

Columns added:

id
credential_id
owner_id
shared_with_user_id
permission
shared_at
expires_at
active
Audit Logging

Audit log entries are generated for:

SHARE
UPDATE_PERMISSION
REVOKE_SHARE

All sharing activities are recorded for security and traceability.

APIs Tested Successfully
Share Credential
View Shared Credentials
READ Permission Validation
EDIT Permission Validation
Update Share Permission
Revoke Share
Owner Access Validation
Unauthorized User Access (403 Forbidden)
Revoked Share Access Validation



-------------------------------------------------------------------------------------------------

Production Logging and Database Performance Optimization
Task 1 – Production Logging

Objective: The objective of this task was to replace all development-level console outputs with a structured logging framework and configure application-wide logging for production readiness. Logging improves application monitoring, debugging, auditing, and issue diagnosis while ensuring that sensitive user information is never exposed.

Implementation: Initially, the application contained several System.out.println() statements that were used during development for debugging purposes. These statements were replaced with SLF4J (Simple Logging Facade for Java) using the Logger and LoggerFactory classes.

A logger instance was created in every service and exception handling class.

private static final Logger logger = LoggerFactory.getLogger(UserService.class);

Logging statements were then added throughout the application using appropriate log levels.

INFO Logs: INFO logs were used to record normal application operations such as:

User Registration
Successful Login
Credential Creation
Credential Update
Credential Deletion
Password Change
Credential Sharing
Restore Operations

Example: logger.info("User registered successfully. Email={}", user.getEmail());

WARN Logs: WARN logs were used whenever abnormal but recoverable situations occurred.

Examples include:

Duplicate email registration
Invalid login attempts
Duplicate credential sharing
Unauthorized access attempts

Example:

logger.warn("Duplicate email registration attempted. Email={}", email);

ERROR Logs: ERROR logs were implemented inside the Global Exception Handler to capture unexpected exceptions.

Logged exceptions include:

UserNotFoundException
CredentialNotFoundException
DuplicateEmailException
InvalidCredentialsException
PasswordReuseException
InvalidShareException
ValidationException
Generic Exception

Example:

logger.error("CredentialNotFoundException: {}", ex.getMessage());

DEBUG Logs: DEBUG logging was enabled for development and troubleshooting purposes. Hibernate SQL logging was also enabled to analyze generated SQL queries during database optimization.

Security Considerations

Sensitive information such as:

User Passwords
Encrypted Passwords
JWT Tokens
Secret Keys
was never written to log files.

Only non-sensitive information including email addresses, credential identifiers, user identifiers, and operation status was logged.


---------------------------------------------------------------------------------------------
Task 2 – Logback Configuration

Objective: The objective of this task was to configure Logback as the logging framework for the SecureVault application and store application logs in both the console and log files.

Implementation
A custom logback-spring.xml configuration file was created inside the resources directory.

The configuration included the following features:

Console Logging: Application logs are displayed in the IntelliJ console during development, allowing developers to monitor application activity in real time.

File Logging: All application logs are simultaneously written into log files for auditing and future analysis.

Daily Rolling Log Files: A rolling file appender was configured so that a new log file is automatically created every day.

Example:

securevault-2026-07-31.log
securevault-2026-08-01.log
Maximum Log File Size

Each log file was configured with a maximum size limit of 10 MB.

When the size limit is reached, Logback automatically creates a new log file without affecting application execution.

Log Retention: Log files are retained for 7 days.
Older log files are automatically deleted to reduce disk space usage.

Verification

The logging configuration was verified by executing various application operations including:

User Registration
Login
Credential Creation
Credential Sharing
Exception Handling

Logs were successfully generated in: vscode Console
Log Files confirming that the Logback configuration functions correctly.

-------------------------------------------------------------------------------------------------

Database Performance Optimization
Task 1 – Analyze and Optimize Database Access

Objective: The objective of this task was to analyze Hibernate-generated SQL queries, identify inefficient database access patterns, eliminate unnecessary queries, and optimize frequently used APIs to improve application performance.

Implementation
Four major APIs were selected for optimization.

1. Get Credential Details
The API retrieves a single credential using its credential ID.

A custom JPQL query using JOIN FETCH was implemented to retrieve both the credential and its associated user within a single SQL query.

This reduced unnecessary lazy loading and minimized additional database access.

2. Get Shared Credentials

The Get Shared Credentials API initially exhibited the N+1 Query Problem.

When multiple shared credentials were retrieved, Hibernate generated separate SQL queries for every credential and owner record.

To eliminate this issue, a custom JPQL query with JOIN FETCH was implemented.

Additional database indexes were created on:

Shared User ID
Active Status

This reduced the number of SQL queries significantly while improving scalability.

3. Search Credentials

The search API already executed a single SQL query.

Performance improvements were achieved by introducing composite indexes on frequently filtered columns including:

User ID
Deleted Status
Category
Title
Username
Website URL

These indexes improve search performance as the number of stored credentials increases.

4. Get All Credentials

The Get All Credentials API uses Spring Data JPA Specifications together with pagination.

The query execution pattern was analyzed and no N+1 query issue was detected.

Performance improvements were achieved through efficient pagination and optimized database indexes.

Optimization Summary
API	                 Problem Identified	      Optimization Applied
Get                    Credential Details	      Additional lazy loading	JOIN FETCH
Get                    Shared Credentials	       N+1 Query Problem JOIN FETCH + Indexes
Search Credentials	Large dataset search	   Composite Indexes
Get All Credentials	Filtering performance	   Composite Indexes

------------------------------------------------------------------------------------------------

Task 2 – API Performance Benchmarking

Objective: The optimized APIs were benchmarked to measure execution efficiency after database optimization.

Testing was performed using:

Postman for response time measurement.
Hibernate SQL Logging for SQL query analysis.

Each API was executed multiple times and the average response time was calculated.

Benchmark Results
| API                    | SQL Queries Executed | Average Response Time | Optimization Applied                      |
| ---------------------- | -------------------: | --------------------: | ----------------------------------------- |
| Login                  |                    1 |              47.21 ms | Indexed email lookup                      |
| Create Credential      |                    1 |             100.79 ms | AES encryption with optimized persistence |
| Search Credentials     |                    1 |              72.26 ms | Optimized JPQL and composite indexes      |
| Share Credential       |                    1 |              80.58 ms | Indexed duplicate-share validation        |
| Get Credential Details |                    1 |              15.05 ms | JOIN FETCH optimization                   |



Performance Analysis

The benchmark results indicate that the implemented optimizations significantly improved database efficiency.

Login authentication required only a single indexed database lookup.
Credential creation maintained stable performance while securely encrypting credential passwords.
Search operations benefited from optimized JPQL queries and composite indexes, reducing search latency.
Share Credential operations efficiently validated duplicate sharing requests using indexed database columns.
Get Credential Details executed using a single optimized SQL query, resulting in the lowest response time among all tested APIs.

The optimized database access layer minimizes unnecessary SQL execution, reduces query overhead, and ensures consistent performance as the application scales to support a larger number of users and stored credentials.


---------------------------------------------------------------------------------------------------

Redis Caching and Cache Invalidation
Task 1 – Integrate Redis Caching

Objective: The objective of this task was to improve the performance of frequently accessed APIs by integrating Redis as an in-memory cache. Instead of querying the PostgreSQL database for every request, frequently accessed data is temporarily stored in Redis, significantly reducing database load and improving response time.

Implementation

Redis Configuration: Redis was configured as the caching provider using Docker Desktop. The Redis server was exposed on port 6379, and Spring Boot was configured to establish a connection with the Redis instance.

The required Maven dependencies were added:

Spring Boot Starter Cache
Spring Boot Starter Data Redis
Spring Cache was enabled by creating a dedicated configuration class:

@Configuration
@EnableCaching
public class CacheConfig {
}

The application properties were configured as follows:

spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.cache.type=redis
Credential Details Cache

Redis caching was implemented for the Get Credential Details API.

The following annotation was applied to the service method:

@Cacheable(value = "credentialDetails", key = "#credentialId")

Working: During the first request, the credential information is retrieved from PostgreSQL and stored in Redis.
For subsequent requests with the same Credential ID, the response is served directly from Redis without executing any SQL query.

Credential Categories Cache
Redis caching was also implemented for the Get Credentials by Category API.

The following annotation was applied:

@Cacheable(
    value = "credentialCategories",
    key = "#userId + '_' + #category"
)

A unique cache key is generated using both the User ID and Credential Category, ensuring that each user's category-wise credentials are cached independently.

Cache Verification:
Caching was verified using Hibernate SQL logs.

Cache Miss:
During the first request:

SQL query executed
Data retrieved from PostgreSQL
Result stored in Redis
Cache Hit

During the second request with identical parameters:

No SQL query executed
Data retrieved directly from Redis

This confirmed successful Redis cache integration.

--------------------------------------------------------------------------------

Task 2 – Cache Invalidation

Objective: Cached data must always remain synchronized with the database. Whenever credential information changes, the corresponding cache entries should be removed so that updated information is retrieved from PostgreSQL during the next request.

Implementation:
Cache invalidation was implemented using Spring Cache annotations.

Updated Credential:
Whenever a credential is updated, the corresponding cache entry is removed.

@Caching(evict = {
    @CacheEvict(value = "credentialDetails", key = "#credentialId"),
    @CacheEvict(value = "credentialCategories", allEntries = true)
})

Soft Delete:
When a credential is moved to Trash, the cache is invalidated to prevent deleted credentials from appearing in cached responses.

Restore Credential:
After restoring a credential from Trash, the cache is cleared so that the restored credential becomes available in future requests.

Permanent Delete:
When a credential is permanently removed from the database, the cache entry is deleted to prevent stale information from being returned.

Cache Invalidation Workflow

Client requests credential information.
Data is retrieved from PostgreSQL.
Redis stores the response.
Subsequent requests are served directly from Redis.
User updates, deletes, restores, or permanently deletes a credential.
Corresponding cache entries are removed using @CacheEvict.
The next request retrieves fresh data from PostgreSQL.
Updated data is stored again in Redis.

Testing and Verification

Credential Details API

Request	          Database Query	Result
First Request	    Yes	            Cache Miss
Second Request	     No	            Cache Hit

Credential Categories API

Request	Database Query	Result
First Request	Yes	       Cache Miss
Second Request	No	       Cache Hit

Cache Invalidation

Operation	            Cache Status
Update Credential	      Cache Evicted
Soft Delete	            Cache Evicted
Restore Credential	Cache Evicted
Permanent Delete	      Cache Evicted


Deliverables Achieved
Redis configured using Docker.
Spring Cache abstraction integrated with Redis.
Credential Details API cached using @Cacheable.
Credential Categories API cached using @Cacheable.
Cache hits verified by observing the absence of SQL queries during repeated requests.
Cache invalidation implemented using @CacheEvict and @Caching.
Fresh data successfully retrieved after update and delete operations.
Redis successfully reduced unnecessary database access while maintaining data consistency.


------------------------------------------------------------------------------------------------
Externalized Configuration and Configuration Precedence

Task 1 – Externalize Application Secrets

Objective: The objective of this task was to improve application security by removing all sensitive configuration values from the source code and externalizing them using environment variables. This approach ensures that confidential information is not hardcoded inside Java classes or configuration files and can be managed securely across different deployment environments.

Implementation:

Sensitive configuration values were replaced with environment variable references in the application configuration.

The following properties were externalized:

Database Username
Database Password
JWT Secret
AES Encryption Key

The application now retrieves these values from the operating system environment during startup.

Example configuration:

spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

aes.key=${AES_KEY}
AES Key Refactoring

Previously, the AES encryption key was hardcoded inside the AESUtil class as a constant.

The utility class was refactored into a Spring-managed component, allowing the AES key to be injected using the @Value annotation.

This eliminated all hardcoded encryption secrets from the Java source code while preserving the existing encryption and decryption functionality.

Environment Variables Configured:
The following environment variables were created:

Environment Variable	Purpose
DB_USERNAME	PostgreSQL Username
DB_PASSWORD	PostgreSQL Password
JWT_SECRET	JWT Token Signing Secret
AES_KEY	AES Encryption Key

Redis authentication was not configured because the local Redis instance was running without password protection.

Verification:
The application was restarted after configuring the environment variables.

The following functionality was verified successfully:

User Registration
User Login
JWT Authentication
Credential Encryption
Credential Decryption
Database Connectivity
Redis Caching

The application started successfully without any hardcoded secrets inside the Java source code.

------------------------------------------------------------------------------------------

Task 2 – Configuration Precedence

Objective: The objective of this task was to demonstrate Spring Boot's configuration precedence by defining the same configuration property using multiple configuration sources and observing which value was ultimately applied during application startup.

Implementation:
The server.port property was configured using three different configuration sources.

1. application.properties
server.port=8081
Application Startup: Tomcat initialized with port 8081 (http)

2. Environment Variable
Environment Variable: SERVER_PORT=8082
Application Startup: Tomcat initialized with port 8082 (http)

3. Command-line Argument
Application launched with:
--server.port=8083
Application Startup: Tomcat initialized with port 8083 (http)

Experimental Results

Configuration Source	Configured Value	Effective Value
application.properties	8081	8081
Environment Variable	8082	8082
Command-line Argument	8083	8083

Spring Boot Configuration Precedence
The experiment verified Spring Boot's configuration precedence hierarchy:

Command-line Arguments (Highest Priority)
Environment Variables
application.properties

When the same property is defined in multiple configuration sources, Spring Boot always uses the value from the highest-priority source.

Conclusion

The SecureVault application was successfully refactored to externalize all sensitive configuration values using environment variables. This removed hardcoded secrets from the source code and improved application security. The configuration precedence experiment confirmed that Spring Boot resolves conflicting properties according to its predefined hierarchy, where command-line arguments override environment variables, and environment variables override values defined in application.properties.


--------------------------------------------------------------------------------------------------

Task 1 – Trace the Spring Boot Startup Process

Objective: The objective of this task was to observe and analyze the complete startup lifecycle of the SecureVault application. Spring Boot startup logs were enabled to identify the sequence of events from application launch until it became ready to serve HTTP requests.

Spring Boot Startup Sequence
JVM Starts
      │
      ▼
main() Method Executes
      │
      ▼
SpringApplication.run()
      │
      ▼
Configuration Sources Loaded
      │
      ▼
Active Spring Profile Selected
      │
      ▼
Component Scanning Begins
      │
      ▼
Spring Beans Created
      │
      ▼
Dependency Injection
      │
      ▼
JPA Initialization
      │
      ▼
HikariCP Database Connection Pool Starts
      │
      ▼
Redis Cache Initialization
      │
      ▼
Embedded Tomcat Starts
      │
      ▼
Application Ready to Accept Requests

Startup Sequence Explanation
1. Configuration Loading: Spring Boot first loads configuration values from application.properties. During this phase, database configuration, Redis configuration, JWT settings, AES encryption key, server port, and logging configuration are resolved.

2. Active Profile Selection: No custom Spring profile was configured. Therefore, Spring Boot automatically selected the default profile.

3. Component Scanning:
Spring Boot scanned the base package: com.securevault and automatically discovered components annotated with:

@RestController
@Service
@Repository
@Configuration
@Component

These classes were registered as Spring Beans inside the IoC container.

4. Bean Creation: The IoC container instantiated all project beans.
Examples include:
Controllers
UserController
CredentialController
CredentialShareController
PasswordController
Services
UserService
CredentialService
CredentialShareService
PasswordService
JwtService
AsyncService
Repositories
UserRepository
CredentialRepository
CredentialShareRepository
PasswordHistoryRepository
AuditLogRepository
Configuration Classes
SecurityConfig
CacheConfig
Components
JwtAuthenticationFilter

5. Dependency Injection: After bean creation, Spring injected all required dependencies using constructor injection.

Examples:
UserController → UserService
CredentialController → CredentialService
CredentialShareController → CredentialShareService
PasswordController → PasswordService
CredentialService → CredentialRepository, UserRepository, AuditLogRepository, PasswordHistoryRepository, AsyncService, CredentialShareRepository
JwtAuthenticationFilter → JwtService, UserRepository

6. Spring Data JPA Initialization:
Spring Boot initialized Hibernate, scanned entity classes, created the EntityManagerFactory, and prepared repository implementations for database operations.

7. Database Connection Pool:
HikariCP connection pool was initialized, and connections to the PostgreSQL database were established.

8. Redis Initialization:
Spring Boot initialized the Redis connection factory and configured Redis as the cache provider using Spring Cache.

The following caches were enabled:
User Profile Cache
Credential Details Cache
Credential Categories Cache

9. Embedded Tomcat Startup:
Embedded Apache Tomcat started successfully and began listening on the configured server port.

10. Application Ready:
After completing initialization, Spring Boot marked the application as ready to serve requests.
Observed startup time:
Approximately 17 seconds
Application readiness state:
ReadinessState = ACCEPTING_TRAFFIC

-------------------------------------------------------------------------------------------------

Task 2 – Analyze the IoC Container

Spring Beans Used in SecureVault: 
Module	           Spring Bean	               Annotation
Authentication	UserController	              @RestController
Authentication	UserService 	              @Service
Authentication	UserRepository	              @Repository
Vault	        CredentialController	     @RestController
Vault	        CredentialService	         @Service
Vault	        CredentialRepository	     @Repository
Sharing	        CredentialShareController	  @RestController
Sharing	        CredentialShareService	        @Service
Sharing	        CredentialShareRepository	    @Repository
Password	      PasswordController	        @RestController
Password	     PasswordService	           @Service
Security	     JwtAuthenticationFilter	    @Component
Security	          JwtService	            @Service
Security	         SecurityConfig	           @Configuration
Redis	              CacheConfig	            @Configuration

Dependency Injection Analysis:

Class	                   Injected Dependencies	                        Injection Type
UserController	              UserService	                                  Constructor
UserService	            UserRepository,BCryptPasswordEncoder,JwtService	      Constructor
CredentialController	CredentialService	                                   Constructor
CredentialService	CredentialRepository, UserRepository, AuditLogRepository, PasswordHistoryRepository, AsyncService, CredentialShareRepository	           Constructor
CredentialShareController	CredentialShareService	                             Constructor
CredentialShareService	CredentialShareRepository, CredentialRepository, UserRepository	                                                                  Constructor
PasswordController	         PasswordService	                               Constructor
JwtAuthenticationFilter	        JwtService, UserRepository	                     Constructor
SecurityConfig	                JwtAuthenticationFilter	                          Constructor

Refactoring Performed:
Initially, several project classes used field injection with @Autowired.

Example (Before):

@Autowired
private UserService userService;

The project was refactored to constructor injection.

Example (After):

private final UserService userService;

public UserController(UserService userService) {
    this.userService = userService;
}

All remaining field injections were replaced with constructor injection.

Why Constructor Injection is Preferred
--Constructor injection is recommended because it:

Makes dependencies explicit and mandatory.
Supports immutable (final) dependency fields.
Improves readability and maintainability.
Simplifies unit testing by allowing dependencies to be passed directly.
Prevents partially initialized objects.
Aligns with Spring Boot best practices.

Outcome:
The SecureVault application successfully completed the startup sequence, initialized all required components, established connections with PostgreSQL and Redis, and exposed REST APIs through the embedded Tomcat server. All Spring-managed components were successfully refactored to use constructor injection, improving code quality, maintainability, and adherence to Spring Framework best practices.

Project Progress

With this milestone completed, your SecureVault project now includes:

✅ User Registration & Login with JWT
✅ AES Password Encryption
✅ BCrypt Password Hashing
✅ Credential CRUD
✅ Password Generator & Strength Analyzer
✅ Credential Sharing
✅ Soft Delete & Restore
✅ Audit Logging
✅ Production Logging (SLF4J & Logback)
✅ Query Optimization
✅ Performance Benchmarking
✅ Redis Caching & Cache Invalidation
✅ Environment Variable Configuration
✅ Spring Boot Configuration Precedence
✅ Spring Boot Startup Analysis
✅ IoC Container Analysis & Constructor Injection


---------------------------------------------------------------------------------
Task 1 – Analyze the Build Process
Objective

The objective of this task was to understand the Maven build lifecycle used in the SecureVault project. The project was built using the Maven Wrapper (mvnw), and each phase of the build process was analyzed to understand its purpose. The generated executable JAR file was also inspected to study its internal structure, including application classes, dependency libraries, configuration resources, and manifest information.

Maven Build Lifecycle

The SecureVault project uses Apache Maven as its build automation tool. Maven executes a sequence of predefined lifecycle phases to compile the source code, execute tests, package the application, and generate the final executable artifact.

The following command was used to build the project:

.\mvnw.cmd clean package

This command executes the clean lifecycle followed by the default lifecycle up to the package phase.

Build Process Sequence
Clean
   ↓
Validate
   ↓
Compile
   ↓
Test
   ↓
Package
Build Phase Analysis
1. Clean Phase

The clean phase removes all previously generated build artifacts from the target directory. This ensures that every build starts from a clean state without using old compiled classes or previously generated files.

Observed Result

Previous target directory was deleted.
Fresh build environment was prepared.
Build Status: BUILD SUCCESS
2. Compile Phase

The compile phase compiles all Java source files located in the src/main/java directory into Java bytecode (.class files). These compiled classes are placed inside the target/classes directory.

Observed Result

All application source files were compiled successfully.
No compilation errors were encountered.
Compiled classes were generated inside target/classes.
3. Test Phase

The test phase executes all JUnit test cases located under src/test/java. During this phase, Spring Boot loads the application context and verifies that all required beans are created successfully.

Initially, the build failed because the DataLoader component attempted to populate the H2 in-memory database before the required tables were available. This issue was resolved by excluding the DataLoader from the test profile. After applying the fix, all tests executed successfully.

Observed Result

Spring Boot test context loaded successfully.
Test execution completed without errors.
Build proceeded to the next phase.
4. Package Phase

The package phase bundles the compiled application classes, resources, and all required dependencies into a single executable Spring Boot JAR file.

Observed Result

The following executable JAR was generated successfully:

target/
└── securevault-0.0.1-SNAPSHOT.jar

Build Status:

BUILD SUCCESS
JAR File Analysis

The generated JAR file was opened using WinRAR to inspect its internal structure.

1. Application Classes

Application classes are stored inside:

BOOT-INF/classes

The following project packages were present:

com.securevault
├── controller
├── service
├── repository
├── entity
├── config
├── security
├── dto
├── util
└── response

These directories contain all compiled classes required to execute the SecureVault application.

2. Dependency Libraries

External libraries are packaged inside:

BOOT-INF/lib

Several dependency JARs were present, including:

Spring Boot Framework
Spring Web
Spring Security
Spring Data JPA
Hibernate ORM
PostgreSQL JDBC Driver
Redis Client (Lettuce)
Jackson JSON Library
JWT Libraries
HikariCP Connection Pool
Jakarta API Libraries

These libraries provide the functionality required by the SecureVault application at runtime.

3. Configuration Resources

Configuration files are stored inside:

BOOT-INF/classes

The following configuration resources were present:

application.properties
logback-spring.xml

These files contain the application's configuration settings and logging configuration.

4. Manifest Information

The JAR manifest is located at:

META-INF/MANIFEST.MF

The following important entries were observed:

Property	Value
Manifest Version	1.0
Created By	Maven JAR Plugin 3.4.2
Build JDK	Java 17
Main Class	org.springframework.boot.loader.launch.JarLauncher
Start Class	com.securevault.SecurevaultApplication
Spring Boot Version	3.5.16
Implementation Title	securevault
Implementation Version	0.0.1-SNAPSHOT

The Main-Class points to Spring Boot's launcher, while the Start-Class identifies the application's main entry point.

Build Output Summary
Build Phase	Purpose	Status
Clean	Removes previous build artifacts	Successful
Compile	Compiles Java source code	Successful
Test	Executes Spring Boot and JUnit tests	Successful
Package	Generates executable Spring Boot JAR	Successful
Observations
The Maven Wrapper (mvnw) was used to build the project, ensuring a consistent Maven version across different environments.
The generated executable JAR contains the compiled application classes, configuration resources, and all required third-party libraries.
Spring Boot packages dependencies inside the BOOT-INF/lib directory, making the JAR self-contained and executable.
The manifest file specifies the Spring Boot launcher as the main class and identifies the SecureVault application as the startup class.
After resolving the test profile configuration, the entire Maven build lifecycle completed successfully and produced the executable JAR.
Conclusion

The Maven build lifecycle of the SecureVault project was successfully analyzed by executing the clean and package phases using the Maven Wrapper. Each stage of the lifecycle performed its intended task, including cleaning previous artifacts, compiling source code, executing automated tests, and packaging the application into an executable JAR. Inspection of the generated JAR confirmed that it includes the compiled application classes, all required dependency libraries, configuration resources, and manifest metadata necessary to run the SecureVault application as a standalone Spring Boot application. This demonstrates how Maven automates the complete build process and simplifies application deployment.

---------------------------------------------------------------------------------------------
Task-2 
Objective

The objective of this task was to analyze all the dependencies declared in the project's pom.xml, understand their purpose, identify where they are used in the SecureVault application, determine the impact of removing each dependency, and classify whether each dependency is required during development, testing, or runtime.

Dependency                          Purpose                                           Module Used                              If Removed                                         Scope
---------------------------------------------------------------------------------------------------
Spring Boot Starter Web             REST APIs and Embedded Tomcat                    Controllers                              REST APIs and server stop working                  Runtime
Spring Boot Starter Security        Authentication and Authorization                 Security Module                          JWT security and authorization fail                Runtime
Spring Security Crypto              BCrypt password hashing                          UserService                              Password hashing stops                             Runtime
Spring Boot Starter Data JPA        ORM, Hibernate, Repository support               Repository Layer                         Database operations fail                           Runtime
PostgreSQL Driver                   Connects to PostgreSQL                           Database Configuration                   Database connection fails                          Runtime
Spring Boot Starter Validation      DTO validation using @Valid                      Controllers                              Request validation stops                           Runtime
Spring Boot Starter Cache           Spring Cache abstraction                         CredentialService                        Caching annotations stop working                   Runtime
Spring Boot Starter Data Redis      Redis integration                                CacheConfig                              Redis caching stops                                Runtime
JJWT API                            JWT interfaces                                  JwtService                               JWT compilation fails                              Runtime
JJWT Implementation                 JWT implementation                              JwtService                               Token generation fails                             Runtime
JJWT Jackson                        JSON support for JWT                            JwtService                               JWT parsing fails                                  Runtime
Lombok                             Generates boilerplate code                       DTOs / Entities                          Manual getters/setters required                    Development
Spring Boot Starter Test            Testing framework                               Test classes                             Tests cannot run                                   Test
H2 Database                        In-memory database for testing                   Test Module                              Test database unavailable                          Test
Dependency Classification
Runtime Dependencies

The following dependencies are essential for running the SecureVault application in production:

Spring Boot Starter Web
Spring Boot Starter Security
Spring Security Crypto
Spring Boot Starter Data JPA
PostgreSQL Driver
Spring Boot Starter Validation
Spring Boot Starter Cache
Spring Boot Starter Data Redis
JJWT API
JJWT Implementation
JJWT Jackson

These dependencies provide web services, security, database access, caching, Redis integration, and JWT authentication.

Development Dependency

Lombok

Lombok is used only during development to reduce boilerplate code by automatically generating getters, setters, constructors, and other common methods during compilation.

Testing Dependencies

The following dependencies are used exclusively during testing:

Spring Boot Starter Test
H2 Database

These dependencies allow the application context to be loaded, unit tests to be executed, and database operations to be tested without using the production PostgreSQL database.

Overall Dependency Architecture
                    SecureVault
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     Spring Web     Spring Security   Spring Data JPA
        │                │                │
   REST Controllers   JWT Security    Repository Layer
        │                │                │
        └─────────────── Business Services ───────────────┐
                                                          │
                                           PostgreSQL Driver
                                                          │
                                                     PostgreSQL
                                                          │
                                              Spring Cache
                                                          │
                                                Redis Server
                                                          │
                                                 Cached Data

Additional Supporting Libraries

• BCrypt (Password Hashing)
• JWT (Authentication Tokens)
• Validation (DTO Validation)
• Lombok (Development)
• Spring Boot Test + H2 (Testing)
Conclusion

The dependency audit shows that the SecureVault project relies on a well-structured set of Maven dependencies to support its core functionality. Spring Boot Starter Web enables RESTful APIs, Spring Security and JWT libraries provide secure authentication, Spring Data JPA and the PostgreSQL driver handle database persistence, while Redis and Spring Cache improve performance through caching. Validation ensures reliable request processing, Lombok simplifies development, and the testing dependencies (Spring Boot Test and H2) support automated testing without affecting the production environment. Together, these dependencies provide a modular, secure, and maintainable foundation for the SecureVault application.


--------------------------------------------------------------------------------------------------

Task 1 — Complete Security Monitoring Module

2.1 Objective: The objective of the Security Monitoring Module is to continuously record authentication activity and identify potentially suspicious login behaviour.

The module monitors:

Successful login attempts
Failed login attempts
New-device logins
Repeated failed login attempts
Risk levels associated with security events
Security alerts generated from suspicious activity

2.2 Login Monitoring
Every login attempt is recorded as a security event.
The system records information such as:

User email
User ID
Event type
IP address
User-Agent
Timestamp
Success/failure status
Risk level
Event description

Example event types:

LOGIN_SUCCESS
LOGIN_FAILURE
NEW_DEVICE

This provides a complete record of authentication activity.

2.3 Failed Login Tracking
Failed authentication attempts are recorded separately.

For example:

Event Type: LOGIN_FAILURE
Description: Invalid password during login attempt.
Successful: false

The system also tracks repeated failures within a defined time period.
This allows SecureVault to distinguish between an isolated incorrect password and potentially suspicious repeated login attempts.

2.4 New Device Detection

The system compares the current login information with previously recorded login activity.

When a login is detected from a previously unknown device/environment, a NEW_DEVICE security event is generated.

Example:

Login detected from a new device.
The event is classified with an appropriate risk level.
The testing performed produced records such as:
NEW_DEVICE
LOGIN_SUCCESS
for new login activity.

2.5 Suspicious Login Detection

Repeated login failures are treated as suspicious behaviour.
The system checks failed login activity within a defined 15-minute window.
When multiple failures are detected, the system generates:

REPEATED_LOGIN_FAILURE

Example message:

Multiple failed login attempts detected within 15 minutes.
The risk level increases as suspicious activity becomes more severe.
During testing, the system successfully generated:

MEDIUM
MEDIUM
HIGH
HIGH
HIGH
risk classifications for repeated failed login attempts.

2.6 Risk Classification

Security events are classified into three risk levels:
LOW
MEDIUM
HIGH

Examples observed during testing:

Event                                	Risk Level
Successful login from known device	         LOW
New-device login	                           MEDIUM
Repeated login failures                  	   MEDIUM
Repeated/high-frequency login failures	   HIGH

This provides a simple mechanism for prioritizing security events.

2.7 Security Alerts

Suspicious security events generate records in the security-alert system.

Example:

Alert Type: REPEATED_LOGIN_FAILURE
Risk Level: HIGH
Message: Multiple failed login attempts detected within 15 minutes.
Resolved: false

The system therefore separates:

Security Event
       ↓
Suspicious behaviour detected
       ↓
Security Alert generated

This allows alerts to be displayed separately from the complete event history.

---------------------------------------------------------------------------------------------

3. Task 2 — Complete Audit Logging & Analytics

3.1 Objective: The Audit Logging module maintains a permanent record of important actions performed within SecureVault.

The following operations are recorded:

LOGIN
LOGOUT
CREDENTIAL_CREATE
CREDENTIAL_UPDATE
CREDENTIAL_DELETE
CREDENTIAL_SHARE
PERMISSION_CHANGE

The audit record contains:

Audit ID
Action
Entity type
Entity ID
User who performed the action
Timestamp

4. Audit Logging Implementation
The AuditLog entity stores audit information in the:
audit_logs table.

Example:

Action: CREDENTIAL_CREATE
Entity Type: Credential
Entity ID: 18
Performed By: rahul@gmail.com
Timestamp: 2026-08-09 19:19:57

The implementation was verified using PostgreSQL.
The latest database records demonstrated:

38  CREDENTIAL_CREATE
37  LOGIN
36  PERMISSION_CHANGE
35  LOGOUT
34  LOGIN

This confirms that the audit system is recording the required activities.

5. Audit History REST API
A REST API was created to retrieve audit history.

Get all audit records
GET /api/audit
Get audit records for a specific user
GET /api/audit/user/{email}

These APIs were tested successfully through Postman.
The returned data contains the audit action, entity, entity ID, user, and timestamp.

6. Password Health Report

The Password Health Report evaluates the passwords stored in a user's vault.
The existing password-strength rules were reused:
Minimum length of 12 characters
Uppercase character
Lowercase character
Number
Special character

Passwords are classified as:
Weak
Medium
Strong

The report provides:

Total credentials
Strong password count
Medium password count
Weak password count
Password health percentage

Example dashboard result obtained during testing:

Total Credentials: 12
Weak Password Count: 11
The report returns statistics rather than exposing the actual passwords.

7. Login Activity Report

A Login Activity Report was implemented using the security-event data.

The report provides:

Email
Event type
IP address
User-Agent
Risk level
Success/failure status
Timestamp
Event description

REST endpoint:

GET /api/security/reports/login-activity/{email}

This was successfully tested using Postman.

The report can show activities such as:

LOGIN_SUCCESS
LOGIN_FAILURE
NEW_DEVICE

along with their corresponding risk levels.

8. Security Summary

A Security Summary was implemented to provide an overall view of authentication and security activity.

The summary contains:

Total security events
Successful login count
Failed login count
High-risk event count
Medium-risk event count
Low-risk event count
Unresolved security alert count

REST endpoint:

GET /api/security/reports/security-summary

The endpoint was tested successfully.

9. Analytics Dashboard

The final component combines important security and vault statistics into a single dashboard response.

The dashboard exposes:

Total Credentials
Shared Credentials
Weak Password Count
Failed Login Count
Recent Security Alerts
Recent User Activity

REST endpoint:

GET /api/security/reports/dashboard/{userId}

9.1 Verified Dashboard Result
The implemented dashboard was tested successfully and returned:

Total Credentials: 12
Shared Credentials: 2
Weak Password Count: 11
Failed Login Count: 15
It also returned the five most recent security alerts and five most recent user activities.

Recent Security Alerts

The dashboard successfully displayed high-risk alerts such as:

REPEATED_LOGIN_FAILURE
Risk Level: HIGH
Message:
Multiple failed login attempts detected within 15 minutes.
Recent User Activity

The dashboard successfully displayed:

CREDENTIAL_CREATE
LOGIN
PERMISSION_CHANGE
LOGOUT
LOGIN

This confirms that the dashboard combines information from the credential, security-event, security-alert, and audit-log modules.

10. Overall Architecture

The completed workflow can be summarized as:

                    SecureVault Backend
                           │
          ┌────────────────┴────────────────┐
          │                                 │
   Authentication                    Vault Operations
          │                                 │
          ▼                                 ▼
 Security Monitoring                Credential Management
          │                                 │
          ├── Login Monitoring               │
          ├── Failed Login Tracking          │
          ├── New Device Detection           │
          ├── Suspicious Login Detection     │
          └── Risk Classification            │
          │                                 │
          ▼                                 ▼
    Security Events                    Audit Logging
          │                                 │
          ▼                                 ├── Login
    Security Alerts                     ├── Logout
          │                             ├── Create
          │                             ├── Update
          │                             ├── Delete
          │                             ├── Share
          │                             └── Permission Change
          │                                 │
          └──────────────┬──────────────────┘
                         ▼
                  Reporting Layer
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   Password Health   Login Activity   Security
       Report           Report        Summary
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                  Analytics Dashboard

11. Testing Performed
The implemented functionality was tested using Postman and PostgreSQL.

The following were successfully verified:

Component Verification
Login monitoring	✅
Failed login tracking	✅
New-device detection	✅
Suspicious login detection	✅
Risk classification	✅
Security alerts	✅
Login audit	✅
Logout audit	✅
Credential creation audit	✅
Credential update audit	✅
Credential deletion audit	✅
Credential sharing audit	✅
Permission-change audit	✅
Audit History API	✅
Password Health Report	✅
Login Activity Report	✅
Security Summary	✅
Analytics Dashboard	✅

12. Final Outcome
The Security Monitoring and Audit & Analytics modules of SecureVault have been completed.

The system can now:

Monitor authentication activity
Track failed logins
Detect new-device logins
Identify repeated suspicious login behaviour
Assign security risk levels
Generate security alerts
Maintain an audit trail of important user actions
Retrieve audit history through REST APIs
Generate password health statistics
Generate login activity reports
Generate security summaries
Provide consolidated analytics through a dashboard API

------------------------------------------------------------------------------------------------

MFA authentication

 Overview

Multi-Factor Authentication (MFA) was implemented in SecureVault to provide an additional authentication layer after successful email/password verification.

Instead of issuing a JWT immediately after password authentication, SecureVault first generates a one-time password (OTP) and sends it to the user's registered email address. The JWT is issued only after the OTP is successfully verified.

Authentication Flow

User Registration
       ↓
Email + Password Login
       ↓
Password Verification using BCrypt
       ↓
Generate 6-Digit OTP
       ↓
Hash OTP using BCrypt
       ↓
Store OTP in PostgreSQL
       ↓
Send OTP to Registered Email
       ↓
User Enters OTP
       ↓
Verify OTP
       ↓
Generate JWT
       ↓
Return JWT to Client



OTP Generation

OTP generation is implemented in MfaService.
A cryptographically secure random generator is used: SecureRandom
A six-digit OTP is generated using:
String.format("%06d", secureRandom.nextInt(1_000_000));
Therefore, the generated OTP is always six digits.
Example: 483921

 OTP Security
Before storing the OTP, it is hashed using BCrypt:

mfaOtp.setOtpHash(
        passwordEncoder.encode(otp));

Therefore:

Actual OTP
    ↓
BCrypt
    ↓
Hashed OTP
    ↓
PostgreSQL

The application does not need to store the original OTP in the database.
During verification, BCrypt compares the entered OTP with the stored hash:

passwordEncoder.matches(
        otp,
        mfaOtp.getOtpHash());

 OTP Expiration

Each OTP is valid for 5 minutes.
The expiration time is calculated using:

LocalDateTime.now()
        .plusMinutes(5);

During verification, the system checks whether the OTP has expired.
If the expiration time has passed, the OTP is rejected.

 OTP Attempt Limiting
The MFA module also limits OTP verification attempts.
The maximum number of attempts is: 5 attempts

Every verification attempt increments the attempts field.
If the user exceeds the allowed number of attempts, the OTP is rejected.
This helps reduce brute-force attempts against the six-digit OTP.

OTP Email Delivery

After generating the OTP, MfaService sends it using JavaMailSender.
The email contains:
SecureVault MFA verification code
OTP validity period
Security warning not to share the OTP

The OTP is sent to the email associated with the SecureVault account.

 MFA Verification API
A dedicated controller was created: MfaController

with the endpoint:

POST /api/auth/mfa/verify
Request
{
  "email": "securevault.project2026@gmail.com",
  "otp": "483921"
}

Verification process
Email
 ↓
Find User
 ↓
Find latest unverified OTP
 ↓
Check expiration
 ↓
Check attempt limit
 ↓
BCrypt OTP comparison
 ↓
Mark OTP as verified
 ↓
Generate JWT

 JWT Generation After MFA

The JWT is not generated immediately after password verification.
During login, the response indicates:

{
  "token": null,
  "mfaRequired": true,
  "email": "securevault.project2026@gmail.com"
}

This indicates that password authentication succeeded but MFA is still pending.
After successful OTP verification, the existing JwtService generates the JWT using the user's email:

jwtService.generateToken(user.getEmail());

The final response contains the JWT.

Example:

{
  "success": true,
  "message": "MFA verification successful.",
  "data": {
    "token": "eyJ...",
  }
}

 Spring Security Configuration

The MFA verification endpoint must be publicly accessible because the user does not have a JWT before MFA verification.

The following endpoints are therefore permitted without authentication:

/api/auth/register
/api/auth/login
/api/auth/mfa/verify

Other protected APIs require authentication through the JWT.

Security Flow
/register
    → Public

/login
    → Public

/mfa/verify
    → Public

Vault APIs
    → JWT Required

Credential APIs
    → JWT Required

Security APIs
    → JWT Required

Testing Performed

The complete MFA workflow was tested using Postman.

Test 1 — Registration
POST /api/auth/register

A new SecureVault user was successfully created and stored in PostgreSQL.

Test 2 — Login
POST /api/auth/login

The correct email and password resulted in:

{
  "token": null,
  "mfaRequired": true
}

This confirmed that the system did not issue the JWT before MFA verification.

Test 3 — OTP Generation

The backend generated a six-digit OTP.

The OTP was stored in the mfa_otp table as a BCrypt hash.

Test 4 — Email Delivery

The OTP was successfully delivered to the registered Gmail account.

The backend logs confirmed:

MFA OTP generated for user
MFA OTP sent to email

Test 5 — OTP Verification

The received OTP was submitted through:

POST /api/auth/mfa/verify

The backend successfully verified the OTP.

The OTP record was marked as verified.

Test 6 — JWT Generation

After successful MFA verification, the backend returned a JWT.

This confirmed that the complete authentication process works:

Password Authentication
        +
       MFA
        ↓
     JWT Token

 Security Measures Implemented

The MFA implementation provides the following protections:

Six-digit OTP generation
Cryptographically secure random OTP generation
BCrypt hashing of OTPs
OTP expiration after 5 minutes
Maximum 5 verification attempts
OTP verification status tracking
Latest unverified OTP selection
JWT issued only after successful MFA
Public access limited to authentication/MFA endpoints
Protected application APIs requiring JWT

