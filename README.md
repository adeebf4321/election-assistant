# Indian Election Process Assistant

An interactive, secure, and modern web application designed to help citizens understand the Indian election process, timelines, and voting steps. Built with Next.js and powered by Google Gemini AI.

## Chosen Vertical

**Civic Technology & Voter Education (India)**
The project specifically targets the Indian democratic process. Given the sheer scale and complexity of Indian elections, there is a critical need for accessible, factual, and easy-to-understand voter education tools. This assistant bridges the gap between complex official documentation and the everyday citizen.

## Approach and Logic

The core philosophy behind this project is **"Accessibility through Interactive Design."** 

1. **Structured Guidance vs. Open Querying**: We identified that users often don't know *what* to ask. Therefore, the approach combines structured, step-by-step guides (The Voter Guide & Timeline) for foundational knowledge, alongside a dynamic AI assistant for specific, personalized queries.
2. **Formal yet Modern Aesthetics**: To build trust, the application uses an authoritative color palette (Navy Blue, Crisp White) accented subtly with patriotic colors (Saffron, India Green). The UI employs modern web design principles like glassmorphism and micro-animations to keep the user engaged without feeling frivolous.
3. **Privacy First**: Voter inquiries can be sensitive. The logic dictates a completely stateless, public-facing application. There are no login screens, and no Personal Identifiable Information (PII) is stored, ensuring maximum privacy.

## How the Solution Works

The application is built on a modern **Next.js (React) App Router** architecture and consists of three main interactive pillars:

### 1. The Interactive Election Timeline
A visually engaging, scroll-triggered timeline built using `framer-motion`. It breaks down the election cycle into 5 logical phases:
- Model Code of Conduct
- Filing of Nominations
- Scrutiny & Withdrawal
- Polling Day
- Counting & Results

### 2. Step-by-Step Voter Guide
An interactive accordion/wizard component that distills the pre-voting requirements into 4 actionable steps:
- **Eligibility Checking**: Age and citizenship requirements.
- **Registration**: Guidance on Form 6 and NVSP portal usage.
- **Verification**: Ensuring presence on the electoral roll.
- **Locating Booths**: Finding the designated polling station.
*(Note: These steps include direct outbound links to official Election Commission of India portals).*

### 3. Smart Dynamic AI Assistant
A chat interface integrated with the **Google Gemini API** via a secure Next.js backend route (`/api/chat`). 
- **System Prompting**: The AI is strictly pre-prompted to act as a highly knowledgeable, polite, and *strictly non-partisan* assistant specializing in Indian election laws. It is instructed to refuse political endorsements and focus solely on civic procedures (like EVM usage, EPIC cards, etc.).
- **Contextual Understanding**: It processes user queries in real-time, providing tailored advice based on the user's specific questions.

### Security Architecture
- The application relies on strict HTTP headers defined in `next.config.ts`.
- **Content-Security-Policy (CSP)** is enforced to mitigate Cross-Site Scripting (XSS).
- **Strict-Transport-Security (HSTS)** ensures all connections are over HTTPS.

## Assumptions Made

1. **Internet Access**: It is assumed the user has a stable internet connection to access the web app and utilize the real-time AI assistant.
2. **AI Reliability**: The solution assumes the Google Gemini API will return factually accurate information regarding Indian election laws based on its training data. The system prompt is designed to heavily bias it toward factual, procedural answers.
3. **External Portal Stability**: The application assumes that the official Election Commission of India links (e.g., `voters.eci.gov.in`) provided in the Voter Guide remain active and unchanged.
4. **No Regional Overrides**: While the AI can answer state-specific queries, the hardcoded timeline and voter guide assume general national guidelines (Lok Sabha / General Assembly standards) which apply broadly across the country.

## Local Development Setup

To run this project locally:

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.
