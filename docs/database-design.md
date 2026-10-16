# CampusConnect AI — Database Design & Data Modeling Specification

## 1. Overview & Architectural Principles

CampusConnect AI uses **MongoDB** as its primary operational datastore via **Spring Data MongoDB**.
The design adheres to the following principles:
- **Clean Document Boundaries:** Core entities (Users, Posts, Communities, Notes, Events, Conversations, Messages, Notifications, AI Sessions) exist in separate top-level collections.
- **Bounded Embeddings vs. Separate Collections:** Unbounded or rapidly growing arrays (e.g. post comments, post likes, event attendees, community members, chat messages) are separated into child collections or reference collections with compound indexes to prevent documents hitting the 16MB BSON limit.
- **Consistency & Identity:** All identifiers use standard 24-character hexadecimal BSON `ObjectId` (mapped as `String` in Spring Data models).
- **Audit Timestamps:** Every collection maintains UTC `createdAt` and `updatedAt` managed automatically by Spring Data `@CreatedDate` / `@LastModifiedDate`.

---

## 2. Collections & Schema Definitions

### 2.1 Collection: `users`
Represents registered college students, credentials, profile, and study preferences.

| Field | Type | Required | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique user identifier |
| `email` | String | Yes | College email (Unique, regex validated against university domain) |
| `passwordHash` | String | Yes | BCrypt hashed password (min 60 chars) |
| `fullName` | String | Yes | Student full name (e.g. "Alex Chen", 2-60 chars) |
| `username` | String | Yes | Handle (Unique, lowercase, e.g. "@alexchen") |
| `department` | String | Yes | Department (e.g. "Computer Science") |
| `year` | String | Yes | Year of study (e.g. "3rd Year", "1st Year") |
| `college` | String | No | College/Institution name (e.g. "MIT Manipal") |
| `bio` | String | No | Short biography/interests (max 300 chars) |
| `avatarUrl` | String | No | Storage URL (Cloudinary or local static path) |
| `avatarText` | String | No | Single uppercase letter fallback (e.g. "A") |
| `skills` | Array\<String\>| No | e.g. `["React", "Python", "Machine Learning", "GraphQL"]` |
| `interests` | Array\<String\>| No | e.g. `["Coding", "AI/ML", "Design", "Research"]` |
| `socialLinks` | Object | No | Embedded `{ github: String, linkedin: String, website: String }` |
| `stats` | Object | No | Cached counters `{ postsCount: Int, followersCount: Int, followingCount: Int, notesCount: Int }` |
| `roles` | Array\<String\>| Yes | Default `["ROLE_STUDENT"]`, optional `["ROLE_MODERATOR", "ROLE_ADMIN"]` |
| `preferences` | Object | No | `{ pushNotifications: Boolean, emailNotifications: Boolean, mentionsReplies: Boolean, eventReminders: Boolean, aiStudyTips: Boolean, publicProfile: Boolean, onlineStatus: Boolean, directMessages: Boolean }` |
| `isVerified` | Boolean | Yes | Email verification status (default `false`) |
| `isActive` | Boolean | Yes | Account active status (default `true`) |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

**Indexes:**
- `email`: Unique index `{ email: 1 }, { unique: true }`
- `username`: Unique index `{ username: 1 }, { unique: true }`
- `department`: Secondary index `{ department: 1 }`

---

### 2.2 Collection: `posts`
Represents student posts across the social feed.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique post identifier |
| `authorId` | ObjectId | Yes | References `users._id` |
| `content` | String | Yes | Post text content (max 2000 chars) |
| `mediaUrls` | Array\<String\>| No | Optional image/video URLs |
| `tags` | Array\<String\>| No | Topic hashtags (e.g. `["HackMIT2025", "AIWorkshop", "CodingClub"]`) |
| `communityId` | ObjectId | No | References `communities._id` (if posted directly in a club) |
| `likesCount` | Number | Yes | Cached counter (default `0`) |
| `commentsCount`| Number | Yes | Cached counter (default `0`) |
| `sharesCount` | Number | Yes | Cached counter (default `0`) |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

**Indexes:**
- Timeline feed index: `{ createdAt: -1 }`
- Author timeline: `{ authorId: 1, createdAt: -1 }`
- Tags search: `{ tags: 1 }`
- Community feed: `{ communityId: 1, createdAt: -1 }`

---

### 2.3 Collection: `post_likes` & `post_bookmarks`
Separated to avoid document bloat on high-engagement posts.

- `post_likes`: `{ _id, postId: ObjectId, userId: ObjectId, createdAt: Date }`
  - Unique compound index: `{ postId: 1, userId: 1 }, { unique: true }`
  - User likes index: `{ userId: 1, createdAt: -1 }`
- `post_bookmarks`: `{ _id, postId: ObjectId, userId: ObjectId, createdAt: Date }`
  - Unique compound index: `{ postId: 1, userId: 1 }, { unique: true }`
  - User bookmarks list: `{ userId: 1, createdAt: -1 }`

---

### 2.4 Collection: `comments`
Represents replies and comments on posts.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique comment identifier |
| `postId` | ObjectId | Yes | References `posts._id` |
| `authorId` | ObjectId | Yes | References `users._id` |
| `content` | String | Yes | Comment content (max 500 chars) |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

**Indexes:**
- `{ postId: 1, createdAt: 1 }`
- `{ authorId: 1 }`

---

### 2.5 Collection: `communities` & `community_members`
Campus clubs and organizations.

#### `communities`:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique community identifier |
| `name` | String | Yes | Name (e.g. "Coding Club", Unique) |
| `slug` | String | Yes | URL slug (e.g. "coding-club") |
| `category` | String | Yes | "Technology", "Arts", "Business", "Sports", etc. |
| `description` | String | Yes | Club overview |
| `bannerUrl` | String | No | Header cover image |
| `iconName` | String | No | SVG icon identifier |
| `ownerId` | ObjectId | Yes | Lead creator (`users._id`) |
| `moderatorIds`| Array\<ObjectId\>| No | List of moderators |
| `membersCount`| Number | Yes | Total members counter |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

#### `community_members`:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Membership record identifier |
| `communityId` | ObjectId | Yes | References `communities._id` |
| `userId` | ObjectId | Yes | References `users._id` |
| `role` | String | Yes | "MEMBER", "MODERATOR", "LEAD" |
| `joinedAt` | Date | Yes | Membership timestamp |

**Indexes:**
- Unique compound: `{ communityId: 1, userId: 1 }, { unique: true }`
- User communities lookup: `{ userId: 1 }`
- Category filtering: `{ category: 1 }`

---

### 2.6 Collection: `notes`
Shared academic resources, lecture notes, syllabus materials.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique note identifier |
| `code` | String | Yes | Subject code (e.g. "CS301", "EC402") |
| `title` | String | Yes | Note title |
| `department` | String | Yes | e.g. "Computer Science", "Electronics" |
| `semester` | String | Yes | e.g. "5th Sem", "3rd Year" |
| `authorId` | ObjectId | Yes | References `users._id` |
| `fileUrl` | String | Yes | Storage URL (PDF/DOCX) |
| `fileType` | String | Yes | e.g. "application/pdf" |
| `fileSizeBytes`| Number | Yes | File size |
| `pages` | Number | No | Page count (extracted or user-provided) |
| `ratingAvg` | Number | Yes | Average rating (e.g. 4.8) |
| `ratingCount` | Number | Yes | Number of ratings |
| `downloadsCount`| Number | Yes | Counter for downloads |
| `extractedText`| String | No | Extracted text via Apache PDFBox for RAG / AI Summarizer |
| `createdAt` | Date | Yes | Upload timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

**Indexes:**
- Search index: `{ department: 1, semester: 1 }`
- Course code index: `{ code: 1 }`
- Full text search: `{ title: "text", code: "text", department: "text" }`
- Author notes: `{ authorId: 1 }`

---

### 2.7 Collection: `events` & `event_registrations`
Campus hackathons, workshops, fests, and competitions.

#### `events`:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique event identifier |
| `title` | String | Yes | Event title (e.g. "HackMIT 2025") |
| `category` | String | Yes | "Hackathon", "Workshop", "Career", "Cultural", "Sports" |
| `date` | String | Yes | e.g. "Sep 12–13, 2025" |
| `startDate` | Date | Yes | ISO Date for query sorting |
| `endDate` | Date | No | ISO Date for completion tracking |
| `time` | String | Yes | e.g. "9:00 AM" |
| `location` | String | Yes | e.g. "Main Auditorium", "CS Lab 204" |
| `organizerId`| ObjectId | Yes | User or club organizer ID |
| `imageUrl` | String | No | Event poster image |
| `attendeesCount`| Number | Yes | Counter of registered students |
| `status` | String | Yes | "upcoming", "ongoing", "past", "cancelled" |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

#### `event_registrations`:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique registration ID |
| `eventId` | ObjectId | Yes | References `events._id` |
| `userId` | ObjectId | Yes | References `users._id` |
| `registeredAt`| Date | Yes | Registration timestamp |

**Indexes:**
- Unique compound: `{ eventId: 1, userId: 1 }, { unique: true }`
- User registrations lookup: `{ userId: 1 }`
- Timeline sorting: `{ status: 1, startDate: 1 }`

---

### 2.8 Collection: `conversations` & `messages`
Real-time messaging between students and within study groups.

#### `conversations`:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique conversation identifier |
| `isGroup` | Boolean | Yes | False for 1-on-1 direct messages, true for groups |
| `title` | String | No | Group title (null for direct messages) |
| `participantIds`| Array\<ObjectId\>| Yes | Array of participant `users._id` |
| `lastMessage` | Object | No | Embedded `{ text: String, senderId: ObjectId, timestamp: Date }` |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last activity timestamp |

#### `messages`:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique message identifier |
| `conversationId`| ObjectId | Yes | References `conversations._id` |
| `senderId` | ObjectId | Yes | References `users._id` |
| `text` | String | Yes | Message text content |
| `attachments` | Array\<String\>| No | Optional file/media URLs |
| `readBy` | Array\<ObjectId\>| No | Users who have read the message |
| `createdAt` | Date | Yes | Creation timestamp |

**Indexes:**
- User conversations: `{ participantIds: 1, updatedAt: -1 }`
- Conversation message history: `{ conversationId: 1, createdAt: 1 }`

---

### 2.9 Collection: `notifications`
Student activity notifications and updates.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique notification identifier |
| `recipientId` | ObjectId | Yes | References `users._id` |
| `actorId` | ObjectId | No | User causing notification (`users._id`) |
| `actorName` | String | Yes | Display name |
| `action` | String | Yes | e.g. "liked your post about the hackathon win" |
| `type` | String | Yes | "like", "comment", "community", "event", "note", "rating", "ai" |
| `referenceId` | ObjectId | No | Target post, note, or event ID |
| `isUnread` | Boolean | Yes | Default `true` |
| `createdAt` | Date | Yes | Timestamp |

**Indexes:**
- User notifications stream: `{ recipientId: 1, createdAt: -1 }`
- Unread filter: `{ recipientId: 1, isUnread: 1 }`

---

### 2.10 Collections: `ai_study_sessions` & `ai_quizzes`
Persists AI Study conversations and AI generated quiz histories.

#### `ai_study_sessions`:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique session identifier |
| `userId` | ObjectId | Yes | References `users._id` |
| `subject` | String | Yes | e.g. "Computer Science" |
| `title` | String | Yes | Session title (e.g. "Recursion & Backtracking") |
| `messages` | Array\<Object\>| Yes | Embedded array of `{ role: "user" \| "assistant", content: String, codeSnippet: String, keyPoints: Array<String>, followups: Array<String>, timestamp: Date }` |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last message timestamp |

#### `ai_quizzes`:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique quiz identifier |
| `userId` | ObjectId | Yes | References `users._id` |
| `subject` | String | Yes | e.g. "Computer Science" |
| `topic` | String | Yes | e.g. "Data Structures" |
| `difficulty` | String | Yes | "Easy", "Medium", "Hard" |
| `questionType`| String | Yes | "MCQ", "True/False", "Short Answer" |
| `questions` | Array\<Object\>| Yes | Embedded list of `{ question: String, options: Array<String>, correctIndex: Number, explanation: String }` |
| `userAnswers` | Object | No | Map of question index to user's selected option |
| `score` | Number | No | Calculated score |
| `isCompleted` | Boolean | Yes | Default `false` |
| `createdAt` | Date | Yes | Creation timestamp |

---

## 3. Entity Relationships Summary

```text
[User] 1 ──── N [Post] 1 ──── N [Comment]
  │                 │
  │                 ├── N [Post_Like]
  │                 └── N [Post_Bookmark]
  │
  ├── N [Community_Member] N ──── 1 [Community]
  │
  ├── 1 ──── N [Note]
  │
  ├── N [Event_Registration] N ──── 1 [Event]
  │
  ├── N ──── N [Conversation] 1 ──── N [Message]
  │
  ├── 1 ──── N [Notification]
  │
  ├── 1 ──── N [AI_Study_Session]
  └── 1 ──── N [AI_Quiz]
```

---

## 4. REST API Endpoint Mapping (`/api/v1`)

### Authentication & Profiles (`/api/v1/auth`, `/api/v1/users`)
- `POST /api/v1/auth/register` — Student registration (validates university email domain)
- `POST /api/v1/auth/login` — Returns JWT and user payload
- `POST /api/v1/auth/logout` — Blacklists token or clears session
- `GET /api/v1/users/me` — Current user profile and settings
- `PUT /api/v1/users/me` — Update full name, bio, skills, preferences
- `GET /api/v1/users/{userId}` — Public profile retrieval

### Social Feed (`/api/v1/posts`)
- `GET /api/v1/posts` — Feed retrieval with pagination (`?page=0&size=10&tag=HackMIT2025`)
- `POST /api/v1/posts` — Create post with media URLs and tags
- `DELETE /api/v1/posts/{postId}` — Delete user's own post
- `POST /api/v1/posts/{postId}/likes` — Toggle like/unlike
- `POST /api/v1/posts/{postId}/bookmarks` — Toggle bookmark

### Communities (`/api/v1/communities`)
- `GET /api/v1/communities` — List clubs (`?category=Technology`)
- `POST /api/v1/communities` — Create community
- `POST /api/v1/communities/{communityId}/join` — Join community
- `DELETE /api/v1/communities/{communityId}/join` — Leave community

### Notes Sharing (`/api/v1/notes`)
- `GET /api/v1/notes` — Search and filter notes (`?search=dsa&department=Computer+Science`)
- `POST /api/v1/notes` — Upload note metadata & file
- `POST /api/v1/notes/{noteId}/download` — Increment download metric and return file stream

### Events (`/api/v1/events`)
- `GET /api/v1/events` — List events (`?status=upcoming&registered=true`)
- `POST /api/v1/events` — Create campus event
- `POST /api/v1/events/{eventId}/register` — Register / unregister for event

### Real-Time Chat (`/api/v1/conversations`, `/ws`)
- `GET /api/v1/conversations` — Active conversations list
- `GET /api/v1/conversations/{id}/messages` — Message history
- `POST /api/v1/conversations/{id}/messages` — Send message fallback (HTTP)
- `WebSocket /ws` with STOMP destination `/app/chat.send` and `/topic/conversation.{id}`

### AI Assistant (`/api/v1/ai`)
- `POST /api/v1/ai/study` — Submit academic prompt and get grounded answer with code & follow-ups
- `POST /api/v1/ai/summarize` — Upload PDF, extract text with Apache PDFBox, return structured summary
- `POST /api/v1/ai/quiz` — Generate practice quiz with questions, options, and explanations
- `POST /api/v1/ai/quiz/{quizId}/submit` — Grade user answers and calculate score

### Notifications (`/api/v1/notifications`)
- `GET /api/v1/notifications` — Retrieve user notifications
- `PUT /api/v1/notifications/{id}/read` — Toggle single read state
- `PUT /api/v1/notifications/mark-all-read` — Mark all as read
