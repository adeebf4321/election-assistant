/**
 * Client-side Gemini AI integration.
 *
 * Calls the Google Generative AI (Gemini) API directly from the browser.
 * Includes retry logic for rate limits (429) and server errors (503),
 * and falls back to a comprehensive offline knowledge base when the API
 * is unavailable or the free-tier quota is exhausted.
 *
 * The API key is injected via NEXT_PUBLIC_GEMINI_API_KEY env var.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

/** Represents a single message in the chat history */
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Represents a formatted history entry for the Gemini API */
interface GeminiHistoryEntry {
  role: "user" | "model";
  parts: { text: string }[];
}

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Offline knowledge base for when the API is unavailable
const OFFLINE_KNOWLEDGE: Record<string, string> = {
  eligibility: `**Eligibility to Vote in India:**

1. **Citizenship**: You must be an Indian citizen.
2. **Age**: You must be 18 years of age or older on the qualifying date (1st January of the year in which the electoral roll is prepared/revised).
3. **Residence**: You must be a resident of the polling area (constituency) where you wish to vote.
4. **Not Disqualified**: You must not be disqualified under any law (e.g., unsound mind, corrupt practices, or certain criminal convictions).

**Who CANNOT vote?**
- Non-citizens of India
- Persons below 18 years of age on the qualifying date
- Persons declared of unsound mind by a competent court
- Persons disqualified due to corrupt practices or certain criminal offences

To check if you are on the Electoral Roll, visit: https://electoralsearch.eci.gov.in/`,

  registration: `**How to Register as a Voter in India (Form 6):**

**Step 1**: Visit the National Voter Service Portal (NVSP) at https://voters.eci.gov.in/

**Step 2**: Click on "New Voter Registration" and fill in Form 6 with:
- Full name, date of birth, and gender
- Address details (current residence)
- Relation details (Father/Mother/Husband name)
- Upload a recent passport-size photo
- Upload proof of age (Birth certificate, Class 10 marksheet, or Passport)
- Upload proof of address (Aadhaar card, Passport, Utility bill, or Bank passbook)

**Step 3**: Submit the form online and note down your Reference ID.

**Step 4**: Your application will be verified by the Electoral Registration Officer (ERO). A Booth Level Officer (BLO) may visit your address for verification.

**Step 5**: Once approved, your name will be added to the Electoral Roll and you will receive your EPIC (Voter ID card).

**Alternative**: You can also submit a physical copy of Form 6 to your nearest ERO office.`,

  "form 6": `**Form 6 - Application for New Voter Registration:**

Form 6 is used for inclusion of name in the electoral roll for the first time.

**Required Documents:**
- Proof of Age: Birth Certificate, School/College Marksheet, Passport, PAN Card
- Proof of Address: Aadhaar Card, Ration Card, Passport, Driving License, Utility Bills
- Passport-size Photograph

**How to Apply:**
1. **Online**: Visit https://voters.eci.gov.in/ → New Voter Registration
2. **Offline**: Download Form 6 from the ECI website, fill it, and submit to your ERO
3. **Via App**: Download the "Voter Helpline" app from Play Store / App Store

**Processing Time**: Typically 15-30 days after submission.
**Cost**: Free of charge.`,

  epic: `**EPIC (Election Photo Identity Card) / Voter ID Card:**

The EPIC is your official identity document issued by the Election Commission of India (ECI).

**Key Facts:**
- EPIC is NOT mandatory to vote, but it is the most accepted ID at polling booths.
- If you don't have EPIC, you can use any of these 12 alternative IDs: Aadhaar, Passport, Driving License, PAN Card, Bank Passbook with Photo, etc.
- The EPIC contains your photo, name, father's/husband's name, date of birth, gender, address, and a unique EPIC number.

**How to Get EPIC:**
1. Register using Form 6 (online or offline).
2. After approval, the EPIC is dispatched to your address or can be collected from the ERO office.

**Lost Your EPIC?**
- Apply for a duplicate using Form 002 on the NVSP portal.
- You can also download an e-EPIC from https://voters.eci.gov.in/`,

  evm: `**Electronic Voting Machine (EVM) - How Voting Works:**

**What is an EVM?**
An EVM is a portable electronic device used for casting votes in Indian elections since 2004 (fully nationwide).

**Components:**
1. **Ballot Unit**: Displays candidate names, party symbols, and buttons to vote. Placed in the voting compartment.
2. **Control Unit**: Operated by the Presiding Officer. Controls the ballot unit and stores vote counts.
3. **VVPAT (Voter Verifiable Paper Audit Trail)**: Attached since 2017 for transparency. After pressing the button, a paper slip with the candidate's name and symbol is displayed for 7 seconds for verification.

**How to Vote:**
1. Go to your assigned polling booth with a valid ID.
2. Get your finger inked (indelible ink on left index finger).
3. Enter the voting compartment.
4. Press the blue button next to your chosen candidate on the Ballot Unit.
5. You will hear a beep and a green light will flash.
6. Verify your vote on the VVPAT paper slip (visible for 7 seconds).
7. Exit the booth.

**Security**: EVMs are standalone machines with no internet/WiFi/Bluetooth connectivity. They cannot be hacked remotely.`,

  "polling booth": `**How to Find Your Polling Booth:**

**Online Methods:**
1. Visit https://electoralsearch.eci.gov.in/
2. Search by EPIC Number or by Name & Address
3. Your assigned polling station details (name, address, and Part Number) will be displayed

**Via App:**
- Download the "Voter Helpline" app (available on Android & iOS)
- Search your name and find your booth details

**What to Carry on Voting Day:**
- EPIC (Voter ID Card) OR any one of the 12 approved photo IDs
- Approved IDs include: Aadhaar, Passport, Driving License, PAN Card, Bank Passbook with photo, Service ID for government employees, and others

**Polling Hours:** Generally 7:00 AM to 6:00 PM (may vary by region and season).
**Holiday:** Election day is a paid holiday for voters.`,

  default: `I can help you with the following topics related to the Indian Election System:

1. **Eligibility** - Who can vote in India?
2. **Registration** - How to register as a new voter (Form 6)
3. **EPIC / Voter ID** - Everything about the Voter ID card
4. **EVM** - How Electronic Voting Machines work
5. **Polling Booth** - How to find your polling station and what to carry

Please ask about any of these topics and I'll provide detailed information!`
};

/**
 * Searches the offline knowledge base for a relevant answer
 * based on keywords in the user's message.
 */
function getOfflineResponse(message: string): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("eligib") || lowerMsg.includes("who can vote") || lowerMsg.includes("age") || lowerMsg.includes("qualify")) {
    return OFFLINE_KNOWLEDGE.eligibility;
  }
  if (lowerMsg.includes("form 6") || lowerMsg.includes("form6")) {
    return OFFLINE_KNOWLEDGE["form 6"];
  }
  if (lowerMsg.includes("register") || lowerMsg.includes("registration") || lowerMsg.includes("enroll") || lowerMsg.includes("nvsp")) {
    return OFFLINE_KNOWLEDGE.registration;
  }
  if (lowerMsg.includes("epic") || lowerMsg.includes("voter id") || lowerMsg.includes("voter card") || lowerMsg.includes("identity")) {
    return OFFLINE_KNOWLEDGE.epic;
  }
  if (lowerMsg.includes("evm") || lowerMsg.includes("voting machine") || lowerMsg.includes("how to vote") || lowerMsg.includes("vvpat")) {
    return OFFLINE_KNOWLEDGE.evm;
  }
  if (lowerMsg.includes("polling") || lowerMsg.includes("booth") || lowerMsg.includes("station") || lowerMsg.includes("where to vote") || lowerMsg.includes("carry")) {
    return OFFLINE_KNOWLEDGE["polling booth"];
  }

  return OFFLINE_KNOWLEDGE.default;
}

/**
 * Sends a message to the Gemini AI and returns the response.
 * Falls back to the offline knowledge base on failure.
 */
export async function sendMessage(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  // If API key is not configured, use offline knowledge base directly
  if (!genAI) {
    return getOfflineResponse(message);
  }

  // Format history for Gemini
  const formattedHistory: GeminiHistoryEntry[] = (history || []).map((msg) => ({
    role: msg.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: msg.content }],
  }));

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "You are an official, highly knowledgeable, and polite assistant helping users understand the Indian Election System. Provide practical, step-by-step guidance. Be strictly non-partisan. Focus on facts, eligibility criteria, Form 6 registration, EPIC, and EVM processes. Do not endorse any political party." }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am ready to assist users with accurate and objective information regarding the Indian Election System." }],
      },
      ...formattedHistory,
    ],
  });

  const retries = 2;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error: unknown) {
      const status = (error as Record<string, unknown>)?.status as number | undefined;
      console.warn(`Gemini attempt ${attempt + 1} failed (status: ${status})`);

      // If rate limited or server error, wait and retry
      if ((status === 429 || status === 503) && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 2000));
        continue;
      }
      break;
    }
  }

  // Fallback to offline knowledge base
  console.log("All Gemini retries failed. Using offline knowledge base.");
  return getOfflineResponse(message);
}
