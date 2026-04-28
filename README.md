# IndiaVotes — AI-Powered Election Process Assistant

An interactive, accessible, and secure web application designed to guide Indian citizens through the democratic election process. Built for the **Hack2Skill PromptWars Virtual** challenge.

🌐 **Live Demo:** [https://election-assistant-3898d.web.app](https://election-assistant-3898d.web.app)

## 🎯 Chosen Vertical
**Civic Technology & Voter Education (India)**

## 💡 The Idea
Make it easy for anyone to understand how elections work through an interactive AI assistant that explains voter registration, polling, timelines, and EVMs in a simple, accessible way. The goal is to break down complex Election Commission of India (ECI) documentation into an engaging, user-friendly format.

## 🛠️ Tech Stack & Features
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS & Custom Glassmorphism UI
- **Animations**: Framer Motion
- **AI Integration**: Google Generative AI (Gemini 2.0 Flash API) — client-side with offline fallback
- **Mapping**: Google Maps Embed API
- **Authentication**: Firebase Authentication (Google Sign-In with OAuth scopes)
- **Database**: Cloud Firestore (persistent chat history per user)
- **Analytics**: Firebase Analytics SDK
- **Email Integration**: Gmail API (email chat history to yourself)
- **Cloud Storage**: Google Drive API (save voter guide to Drive)
- **Hosting**: Firebase Hosting (static export)
- **Testing**: Jest & React Testing Library (38 tests across 8 suites)

## 🔥 Google Services Integrated (6 Total)

| # | Google Service | Feature | Location |
|---|---------------|---------|----------|
| 1 | **Google Generative AI (Gemini)** | AI-powered election chat assistant with retry & offline fallback | `src/lib/gemini-client.ts` |
| 2 | **Firebase Authentication** | Google Sign-In with OAuth scopes for Gmail & Drive | `src/lib/auth-context.tsx` |
| 3 | **Cloud Firestore** | Persistent chat history synced per authenticated user | `src/lib/firestore.ts` |
| 4 | **Firebase Analytics** | User engagement tracking | `src/lib/firebase.ts` |
| 5 | **Gmail API** | "Email Chat History" — sends conversation to user's inbox | `src/lib/google-apis.ts` |
| 6 | **Google Drive API** | "Save Guide to Drive" — exports voter registration guide | `src/lib/google-apis.ts` |

> **Additional:** Google Maps Embed API for polling booth location visualization.

## 🚀 Key Implementations & High Scores

### 1. Smart AI Assistant with Offline Fallback
Integrated the Google Gemini API to answer specific voter queries directly from the browser. To ensure the application remains highly resilient and never crashes due to API rate limits (HTTP 429), I implemented a **robust offline knowledge base fallback mechanism** with automatic retry logic. If the API fails after multiple attempts, the assistant seamlessly switches to pre-programmed official ECI guidance.

### 2. Deep Accessibility (A11y)
Designed to be inclusive for all citizens:
- Fully navigable via keyboard (`Tab` indexing).
- Distinct `focus-visible` UI rings (`var(--saffron)`).
- Comprehensive ARIA attributes (`aria-label`, `aria-expanded`, `role="tab"`, `aria-live` for screen readers).
- Semantic HTML5 structure with a "Skip to main content" mechanism.

### 3. Google Ecosystem Adoption (6 Services)
Extensive use of the Google ecosystem to provide a seamless experience:
- **Google Generative AI**: Powers the smart chat assistant with automatic retry and offline fallback.
- **Firebase Authentication**: Secure Google Sign-In with extended OAuth scopes for Gmail & Drive access.
- **Cloud Firestore**: Persistent chat history — conversations are saved and restored when users sign back in.
- **Firebase Analytics**: Tracks user engagement metrics (configured safely to never crash if keys are missing).
- **Gmail API**: Authenticated users can email their full chat history to themselves with one click.
- **Google Drive API**: Authenticated users can save a comprehensive voter registration guide directly to their Google Drive.
- **Google Maps**: Embedded interactive map to help citizens visually locate their nearest Electoral Registration Offices.

### 4. Comprehensive Testing
The codebase is hardened with robust unit tests using Jest and React Testing Library. **38 tests across 8 test suites** cover all core UI components, authentication flows, accessible navigation, and the offline AI fallback logic.

### 5. Production-Ready Security
Hardened via Firebase Hosting configuration:
- **X-Frame-Options (DENY)** to prevent clickjacking.
- **Strict-Transport-Security (HSTS)** to enforce HTTPS.
- **X-Content-Type-Options (nosniff)** to prevent MIME-type sniffing.
- **Referrer-Policy (strict-origin-when-cross-origin)** for privacy.
- Zero API keys are exposed to the public repository (tracked exclusively via `.env.local` which is gitignored).

### 6. Firebase Hosting Deployment
The application is deployed as a static export on Firebase Hosting, ensuring:
- **Zero-cost hosting** on the Firebase free tier (Spark plan).
- **Global CDN** for fast page loads worldwide.
- **SSL/HTTPS** enabled by default.

## 🧠 Approach & Logic
1. **User Flow**: A user lands on the hero section, scrolls through the visual election timeline, interacts with the step-by-step voter guide tabs (with option to save to Google Drive), locates polling areas via the map, and finally asks specific edge-case questions to the AI assistant (with option to email the conversation).
2. **Design Language**: Utilized a formal, authoritative color palette heavily inspired by the Indian flag (Saffron, White, India Green) overlaid on a modern, trustworthy Navy Blue dark-mode theme.
3. **Resilience Strategy**: The system relies on the assumption that free-tier API quotas are often exhausted during public demonstrations. By implementing automatic retry logic with exponential backoff and building an offline fallback knowledge base, the user experience is never compromised.

## 📋 Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```env
GEMINI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

## ⚠️ Assumptions Made
- The user has a basic understanding of English (future roadmaps include regional language localization).
- API keys are securely injected via environment variables (`.env.local` is gitignored).
- Polling booth locations are assumed to be managed centrally by the ECI; thus, we direct users to the official `electoralsearch.eci.gov.in` portal for exact booth mapping rather than scraping sensitive voter data.
- Gmail and Drive API integrations require the user to grant OAuth consent during Google Sign-In.

---
Built with ❤️ for #BuildwithAI #PromptWarsVirtual @googlefordevelopers
