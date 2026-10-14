# CampusConnect AI --- Antigravity Project Brief

## 1. Project Overview

**Project:** CampusConnect AI\
**Type:** AI-powered campus social network\
**Scope:** Phase 1 only\
**Team:** 4 members

CampusConnect AI is a college-focused web platform that combines student
social interaction, academic resource sharing, campus communities,
events, real-time messaging, and AI-powered study tools.

Build a responsive, maintainable application with secure authentication,
clear module boundaries, and real frontend-backend integration.

**Scope rule:** Implement only the features listed below. Do not start
future-phase features unless explicitly requested.

## 2. Phase 1 Features

### User Authentication

-   Student registration using college email
-   Login/logout
-   JWT authentication and protected routes/APIs
-   Email verification
-   Forgot/reset password
-   BCrypt password hashing
-   Backend validation and role-aware authorization

Never store plain-text passwords or commit credentials/secrets.

### User Profile

-   Profile picture, full name, bio
-   Department and academic year
-   Skills, interests, social links
-   Achievement badges
-   View profiles and edit own profile with backend ownership checks

### Social Feed

-   Create text posts and upload images/videos
-   View feed
-   Like/unlike, comment, share, bookmark
-   Edit/delete own posts
-   Include loading, empty, success, and error states

### Communities & Clubs

-   Discover and view communities
-   Create, join, and leave communities
-   Community details and member lists
-   Discussions/posts and announcements
-   Owners/moderators with permission checks

Example communities: Coding Club, Photography Club, AI & Robotics, Music
Society, and Sports Club.

### Notes Sharing

-   Upload PDF notes with title, description, subject, department,
    semester/year, and tags
-   Search and filter notes
-   View details, download, rate, bookmark
-   Validate file types and size on the server

### Event Management

-   Browse upcoming events and view details
-   Authorized users can create events
-   Register for events and show registration status
-   View registered events
-   Event title, description, date/time, location, organizer, and
    optional poster

### Real-Time Chat

-   One-to-one and group conversations
-   Conversation list and message history
-   Online status and typing indicators when feasible
-   File/image sharing only when secure upload is supported
-   Use Spring WebSocket + STOMP and persist messages in MongoDB
-   Check conversation membership before reading or sending messages

### AI Study Assistant

-   Academic question-and-answer interface
-   General study questions
-   Plan note-grounded Q&A using Retrieval-Augmented Generation (RAG)
-   Do not claim an answer came from a note unless retrieval supports
    that claim

### AI Note Summarizer

-   Accept a PDF or existing uploaded note
-   Extract text using Apache PDFBox
-   Generate summary, key concepts, important topics, and exam-focused
    revision points
-   Handle empty, unreadable, oversized, and unsupported PDFs
-   Scanned/image-only PDF OCR is out of scope unless added later

### AI Quiz Generator

-   Generate practice questions from supplied text or notes
-   Support MCQ, true/false, and short answer where feasible
-   Difficulty: Easy, Medium, Hard
-   Configurable question count
-   Show answers, explanations, and score
-   Validate and parse model output before showing it

## 3. Technology Stack

### Frontend

-   React
-   Vite
-   Tailwind CSS
-   React Router
-   Axios or one consistent API client

### Backend

-   Java
-   Spring Boot
-   Spring Web / REST
-   Spring Security
-   JWT and BCrypt
-   Spring Data MongoDB
-   Spring WebSocket + STOMP
-   Spring AI
-   Apache PDFBox
-   Maven

### Services

-   MongoDB Atlas or configured MongoDB
-   Ollama for local model inference
-   Spring AI-compatible embedding model and vector store for RAG
-   Cloudinary for uploaded files, with a local-development storage
    option if needed

Verify dependency compatibility with the Java and Spring Boot versions
in the repository. Do not arbitrarily replace working versions. Keep
secrets in environment variables or ignored local configuration files.
Provide an `.env.example` containing placeholders only.

## 4. High-Level Architecture

``` text
React + Vite + Tailwind
          |
          | REST API / WebSocket
          v
Java + Spring Boot
  |          |             |
  |          |             +--> Spring AI --> Ollama / AI model
  |          |                              +--> RAG retrieval
  |          |
  |          +--> Spring Security + JWT
  |
  +--> Spring Data MongoDB --> MongoDB
  |
  +--> File storage adapter --> Cloudinary or local storage
  |
  +--> Apache PDFBox --> PDF text extraction
```

The frontend must never connect directly to MongoDB or receive
model-provider credentials. Keep business logic in services, transport
logic in controllers/handlers, and persistence in repositories.

## 5. Suggested Repository Structure

``` text
CampusConnect-AI/
├── README.md
├── .gitignore
├── .env.example
├── docs/
│   ├── architecture.md
│   ├── api-specification.md
│   ├── database-design.md
│   ├── setup-guide.md
│   └── team-responsibilities.md
├── frontend/
│   ├── package.json
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── ui/
│       │   ├── layout/
│       │   └── common/
│       ├── features/
│       │   ├── auth/
│       │   ├── profile/
│       │   ├── feed/
│       │   ├── communities/
│       │   ├── notes/
│       │   ├── events/
│       │   ├── chat/
│       │   └── ai/
│       ├── hooks/
│       ├── lib/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
└── backend/
    ├── pom.xml
    └── src/
        ├── main/
        │   ├── java/com/campusconnect/
        │   │   ├── CampusConnectApplication.java
        │   │   ├── config/
        │   │   ├── security/
        │   │   ├── common/
        │   │   │   ├── exception/
        │   │   │   ├── response/
        │   │   │   └── validation/
        │   │   ├── auth/
        │   │   ├── user/
        │   │   ├── post/
        │   │   ├── community/
        │   │   ├── note/
        │   │   ├── event/
        │   │   ├── chat/
        │   │   ├── notification/
        │   │   ├── file/
        │   │   └── ai/
        │   │       ├── study/
        │   │       ├── summarizer/
        │   │       ├── quiz/
        │   │       └── rag/
        │   └── resources/
        │       └── application.properties
        └── test/
            └── java/com/campusconnect/
```

Inside each backend feature package, use relevant `controller`,
`service`, `repository`, `model`, and `dto` packages. Avoid empty
placeholder classes. Keep frontend pages, components, hooks, and API
functions grouped by feature when practical.

## 6. UI/UX Direction

Create a distinctive, modern digital-campus experience. Do not make a
generic corporate dashboard or a Facebook/LinkedIn clone.

-   Dark-first interface
-   Near-black background such as `#111214`
-   Graphite surfaces such as `#191B20`
-   Electric violet/indigo primary accent
-   Limited lavender, coral/orange, and mint supporting accents
-   Accessible contrast and readable typography
-   Inter, Manrope, or Plus Jakarta Sans
-   Subtle borders and restrained shadows
-   Use rounded corners selectively; avoid excessive glassmorphism and
    gradients
-   Responsive desktop and mobile layouts

Desktop: left navigation for Home, Communities, Notes, Events, Messages,
AI Study, Profile, and Settings. Use the center for page content and a
contextual right panel for upcoming events or suggestions when useful.

Mobile: bottom navigation for primary destinations, accessible touch
targets, and usable feed, notes, chat, and AI workflows.

Required screens: 1. Login 2. Registration/email verification 3.
Forgot/reset password 4. Home/social feed 5. User profile/edit profile
6. Communities discovery 7. Community details 8. Notes listing/search 9.
Note details/upload 10. Events listing 11. Event details/registration
12. Conversation list 13. Chat window 14. AI Study Assistant 15. AI Note
Summarizer 16. AI Quiz Generator 17. Quiz-taking screen 18. Quiz results
19. Notifications, if included in Phase 1 20. Settings

Create reusable buttons, inputs, modals, avatars, tags, badges,
post/note/event cards, chat bubbles, upload controls, loaders, empty
states, and error states.

## 7. API Conventions

Use the prefix `/api/v1`.

Suggested resource groups: - `/api/v1/auth` - `/api/v1/users` -
`/api/v1/posts` - `/api/v1/communities` - `/api/v1/notes` -
`/api/v1/events` - `/api/v1/conversations` - `/api/v1/messages` -
`/api/v1/ai/study` - `/api/v1/ai/summarize` - `/api/v1/ai/quiz`

Suggested endpoints:

``` text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

GET    /api/v1/users/{userId}
PUT    /api/v1/users/me

GET    /api/v1/posts
POST   /api/v1/posts
PUT    /api/v1/posts/{postId}
DELETE /api/v1/posts/{postId}
POST   /api/v1/posts/{postId}/likes
DELETE /api/v1/posts/{postId}/likes
POST   /api/v1/posts/{postId}/bookmarks

GET    /api/v1/communities
POST   /api/v1/communities
POST   /api/v1/communities/{communityId}/join
DELETE /api/v1/communities/{communityId}/join

GET    /api/v1/notes
POST   /api/v1/notes
GET    /api/v1/notes/{noteId}

GET    /api/v1/events
POST   /api/v1/events
POST   /api/v1/events/{eventId}/register

POST   /api/v1/ai/study
POST   /api/v1/ai/summarize
POST   /api/v1/ai/quiz
```

These are conventions, not a requirement to implement every endpoint
immediately. Define DTOs, validation, authorization, error responses,
and pagination. Keep API documentation aligned with actual code.

For WebSocket, document the connection endpoint and STOMP destinations.
`/ws`, `/app`, and `/topic` or `/user` may be used if configured
consistently. Secure message delivery and verify conversation
membership.

## 8. MongoDB Design

Initial collections: - `users` - `posts` - `comments` (or embedded
comments based on access patterns) - `communities` - `notes` -
`events` - `conversations` - `messages` - `notifications` (if
implemented) - AI document/chunk data for RAG, depending on vector-store
design

Choose embedded documents versus separate collections based on expected
size and query patterns. Use stable IDs, timestamps, and indexes for
common lookups. Store file metadata and storage references rather than
large binary files unless a justified design requires otherwise.

Do not claim MongoDB Atlas Vector Search is configured until its index
and connection settings have been created and tested.

## 9. AI and RAG Design

### Note-grounded Study Assistant

1.  User selects or uploads a PDF.
2.  Backend validates the file.
3.  PDFBox extracts text.
4.  Split text into chunks.
5.  Create embeddings with a compatible model.
6.  Store chunks/embeddings in a supported vector store.
7.  Retrieve relevant chunks for the question.
8.  Pass the context to the language model.
9.  Return the answer and source references only when reliably
    available.

### Summarizer

1.  Validate PDF and upload limits.
2.  Extract text with PDFBox.
3.  Detect empty/unreadable text.
4.  Generate a structured summary through Spring AI.
5.  Validate the response and show useful errors.

### Quiz Generator

1.  Accept source text or an authorized note ID.
2.  Validate question type, difficulty, and count.
3.  Generate structured question data.
4.  Parse and validate model output.
5.  Present questions and collect answers.
6.  Calculate the score from validated answer data.
7.  Show explanations and results.

Keep AI calls in services, not controllers. Add input limits, timeouts,
and error handling. Do not expose internal prompts, credentials, or
server configuration.

## 10. File Storage

Use a storage abstraction to support Cloudinary in deployment and local
storage in development if needed. Store metadata such as original
filename, safe storage key/provider ID, type, size, uploader ID,
timestamp, and associated resource.

Validate allowed types and sizes on the backend. Never trust
user-supplied file paths. Do not commit uploaded files, model weights,
secrets, or local environment files to Git.

## 11. Security and Quality

-   Validate request DTOs.
-   Enforce ownership and role checks on the backend.
-   Protect private routes and APIs.
-   Use BCrypt and a secure JWT validation strategy with expiration.
-   Configure CORS for the actual frontend origin.
-   Never log passwords, tokens, private messages, or sensitive document
    content.
-   Use centralized exception handling and consistent API errors.
-   Validate file uploads and secure WebSocket access.
-   Keep secrets in environment variables and provide `.env.example`
    placeholders.
-   Add tests for important services, security rules, and API behavior.
-   Provide loading, empty, error, and success UI states.

## 12. Four-Member Work Allocation

  Member     Primary ownership
  ---------- ------------------------------------------------------
  Member 1   Authentication, security, user profiles
  Member 2   Social feed, communities, events
  Member 3   Notes sharing, real-time chat, related notifications
  Member 4   AI Study Assistant, summarizer, quiz generator, RAG

The team must agree on shared data models, DTOs, API contracts, and
security conventions before parallel implementation. Use feature
branches and pull requests. Coordinate changes to shared configuration.

## 13. Milestones

### Milestone 1 --- Foundation

-   Inspect the existing repository and preserve working code.
-   Confirm Java, Spring Boot, Node, and package-manager versions.
-   Set up frontend/backend, MongoDB configuration, conventions, and
    health check.

### Milestone 2 --- Core Platform

-   Authentication and profiles
-   Posts, likes, comments, bookmarks
-   Communities and membership
-   Notes upload/search/download
-   Events and registration

### Milestone 3 --- Real-Time Chat

-   Conversation/message persistence
-   WebSocket/STOMP delivery
-   Membership authorization
-   Multi-user and reconnect tests

### Milestone 4 --- AI Features

-   Configure Spring AI and the selected Ollama model
-   Implement study assistant
-   Implement PDF summarization
-   Implement quiz generation/results
-   Add RAG after extraction, embeddings, vector storage, and retrieval
    work end-to-end

### Milestone 5 --- Integration

-   Integrate all modules
-   Test authorization, invalid inputs, upload failures, and AI outages
-   Verify responsive UI
-   Update setup/API documentation
-   Prepare a reproducible demonstration

## 14. Instructions for Antigravity

Act as a senior full-stack engineer implementing CampusConnect AI.

1.  **Inspect before editing.** Review repository structure, installed
    versions, existing code, and current functionality. Preserve working
    code and conventions where reasonable.
2.  **Plan first.** Report a concise plan and identify missing
    dependencies/configuration before large changes.
3.  **Build incrementally.** Implement and verify one end-to-end feature
    at a time.
4.  **Use real integrations.** Connect UI to backend APIs. Never present
    mock data as persisted functionality. Label temporary mocks clearly.
5.  **Maintain boundaries.** Controllers handle transport, services
    business logic, repositories persistence, and DTOs API contracts.
6.  **Verify.** Run available builds and tests after meaningful changes
    and fix regressions.
7.  **Avoid destructive changes.** Do not overwrite or delete user work,
    change dependencies unnecessarily, or run destructive database
    operations without explaining the impact and obtaining confirmation
    when appropriate.
8.  **Report status honestly.** Identify features as implemented,
    partial, mocked, or awaiting configuration.
9.  **Document setup.** Update README with prerequisites, environment
    variables, frontend/backend startup, MongoDB, Ollama/model setup,
    and tests.
10. **Respect Phase 1 scope.** Do not implement marketplace, lost and
    found, placement discussions, confessions, or other future modules
    unless explicitly requested.

## First Task

Before coding, inspect the current repository and report: - Existing
frontend/backend structure - Technologies and versions detected -
Features already implemented - Missing configuration/dependencies -
Prioritized next steps

Do not rewrite the repository before completing this inspection.
