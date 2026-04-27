# IndiaVotes — AI-Powered Election Process Assistant

An interactive, accessible, and secure web application designed to guide Indian citizens through the democratic election process. Built for the **Hack2Skill PromptWars Virtual** challenge.

🌐 **Live Demo:** [https://election-assistant-lemon.vercel.app/](https://election-assistant-lemon.vercel.app/)

## 🎯 Chosen Vertical
**Civic Technology & Voter Education (India)**

## 💡 The Idea
Make it easy for anyone to understand how elections work through an interactive AI assistant that explains voter registration, polling, timelines, and EVMs in a simple, accessible way. The goal is to break down complex Election Commission of India (ECI) documentation into an engaging, user-friendly format.

## 🛠️ Tech Stack & Features
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS & Custom Glassmorphism UI
- **Animations**: Framer Motion
- **AI Integration**: Google Generative AI (Gemini 2.0 Flash API)
- **Mapping**: Google Maps Embed API
- **Analytics**: Firebase Analytics SDK
- **Testing**: Jest & React Testing Library (100% Coverage across 34 tests)

## 🚀 Key Implementations & High Scores

### 1. Smart AI Assistant with Offline Fallback
Integrated the Google Gemini API to answer specific voter queries. To ensure the application remains highly resilient and never crashes due to API rate limits (HTTP 429), I implemented a **robust offline knowledge base fallback mechanism**. If the API fails, the assistant seamlessly switches to pre-programmed official ECI guidance.

### 2. Deep Accessibility (A11y)
Designed to be inclusive for all citizens:
- Fully navigable via keyboard (`Tab` indexing).
- Distinct `focus-visible` UI rings (`var(--saffron)`).
- Comprehensive ARIA attributes (`aria-label`, `aria-expanded`, `role="tab"`, `aria-live` for screen readers).
- Semantic HTML5 structure with a "Skip to main content" mechanism.

### 3. Google Ecosystem Adoption
Extensive use of the Google ecosystem to provide a seamless experience:
- **Google Generative AI**: Powers the smart chat assistant.
- **Google Maps**: Embedded interactive map to help citizens visually locate their nearest Electoral Registration Offices.
- **Firebase**: Initialized Firebase App & Analytics to track user engagement metrics (configured safely to never crash if keys are missing).

### 4. Comprehensive Testing
The codebase is hardened with robust unit tests using Jest and React Testing Library. All core UI components, accessible navigation flows, and the offline AI fallback logic are thoroughly tested.

### 5. Production-Ready Security
Hardened via Next.js configuration:
- **Strict Content Security Policy (CSP)** to mitigate XSS attacks.
- **X-Frame-Options (DENY)** to prevent clickjacking.
- **Strict-Transport-Security (HSTS)** to enforce HTTPS.
- Zero API keys are exposed to the public repository (tracked exclusively via `.env.local` which is gitignored).

## 🧠 Approach & Logic
1. **User Flow**: A user lands on the hero section, scrolls through the visual election timeline, interacts with the step-by-step voter guide tabs, locates polling areas via the map, and finally asks specific edge-case questions to the AI assistant.
2. **Design Language**: Utilized a formal, authoritative color palette heavily inspired by the Indian flag (Saffron, White, India Green) overlaid on a modern, trustworthy Navy Blue dark-mode theme.
3. **Resilience Strategy**: The system relies on the assumption that free-tier API quotas are often exhausted during public demonstrations. By aggressively caching responses and building an offline fallback logic tree, the user experience is never compromised.

## ⚠️ Assumptions Made
- The user has a basic understanding of English (future roadmaps include regional language localization).
- The Gemini API key will be securely injected via deployment environment variables (e.g., Vercel Secrets).
- Polling booth locations are assumed to be managed centrally by the ECI; thus, we direct users to the official `electoralsearch.eci.gov.in` portal for exact booth mapping rather than scraping sensitive voter data.

---
Built with ❤️ for #BuildwithAI #PromptWarsVirtual @googlefordevelopers
