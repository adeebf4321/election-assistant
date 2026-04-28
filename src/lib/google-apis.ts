/**
 * Google APIs integration module.
 *
 * Provides helper functions for interacting with Google Drive
 * and Gmail REST APIs using OAuth access tokens obtained from
 * Firebase Authentication with extended scopes.
 *
 * - Gmail: Sends an email to the authenticated user with their
 *   chat history from the Election AI Assistant.
 * - Drive: Creates a text file in the user's Google Drive
 *   containing voter registration guidelines.
 */

/** Required OAuth scopes for Gmail and Drive integration */
export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/drive.file",
];

/**
 * Sends an email via the Gmail API containing the chat history.
 *
 * @param accessToken - OAuth2 access token with gmail.send scope
 * @param recipientEmail - Email address to send to (the user's own)
 * @param chatContent - Formatted chat history text
 * @returns true if the email was sent successfully
 */
export async function sendChatHistoryEmail(
  accessToken: string,
  recipientEmail: string,
  chatContent: string
): Promise<boolean> {
  const subject = "IndiaVotes — Your Election Assistant Chat History";
  const body = [
    "Here is your conversation with the IndiaVotes Election AI Assistant:\n",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
    chatContent,
    "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
    "This email was sent automatically from IndiaVotes — your trusted Election Process Guide.",
    "Visit us again for any election-related queries!",
  ].join("\n");

  // Build the RFC 2822 email message
  const emailLines = [
    `To: ${recipientEmail}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "MIME-Version: 1.0",
    "",
    body,
  ];
  const rawMessage = emailLines.join("\r\n");

  // Base64url encode the message
  const encoded = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    const response = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: encoded }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Gmail API error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Saves a document to Google Drive via the Drive API.
 *
 * Creates a plain text file in the user's Drive root folder
 * containing voter registration guidelines.
 *
 * @param accessToken - OAuth2 access token with drive.file scope
 * @param fileName - Name for the file in Drive
 * @param content - Text content to write into the file
 * @returns The file ID if created, or null on failure
 */
export async function saveToGoogleDrive(
  accessToken: string,
  fileName: string,
  content: string
): Promise<string | null> {
  const metadata = {
    name: fileName,
    mimeType: "text/plain",
  };

  // Use multipart upload for metadata + content
  const boundary = "-------IndiaVotesBoundary";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
    content +
    closeDelimiter;

  try {
    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body: multipartBody,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Drive API error:", error);
      return null;
    }

    const data = await response.json();
    return data.id as string;
  } catch (error) {
    console.error("Failed to save to Drive:", error);
    return null;
  }
}

/**
 * Generates voter registration guide content for Drive export.
 * @returns Formatted plain text voter guide
 */
export function generateVoterGuideContent(): string {
  return [
    "═══════════════════════════════════════════════════",
    "       IndiaVotes — Voter Registration Guide",
    "═══════════════════════════════════════════════════",
    "",
    "STEP 1: CHECK ELIGIBILITY",
    "─────────────────────────",
    "• You must be an Indian citizen.",
    "• You must be 18 years or older on the qualifying date",
    "  (January 1st of the year the electoral roll is revised).",
    "• You must be a resident of the polling area (constituency).",
    "",
    "STEP 2: REGISTER TO VOTE (FORM 6)",
    "──────────────────────────────────",
    "• Visit the NVSP portal: https://voters.eci.gov.in/",
    "• Click 'New Voter Registration' and fill Form 6.",
    "• Required documents:",
    "  - Proof of Age: Birth Certificate, Class 10 Marksheet, Passport",
    "  - Proof of Address: Aadhaar, Ration Card, Driving License",
    "  - Recent passport-size photograph",
    "• Processing time: 15–30 days.",
    "",
    "STEP 3: VERIFY YOUR NAME ON THE ELECTORAL ROLL",
    "───────────────────────────────────────────────",
    "• Visit: https://electoralsearch.eci.gov.in/",
    "• Search by EPIC number or by name and address.",
    "• Your name MUST be on the roll to vote.",
    "",
    "STEP 4: FIND YOUR POLLING BOOTH",
    "───────────────────────────────",
    "• Use the Electoral Search portal or the Voter Helpline App.",
    "• Polling hours: Generally 7:00 AM – 6:00 PM.",
    "• Carry your Voter ID (EPIC) or any approved photo ID.",
    "",
    "═══════════════════════════════════════════════════",
    "  Generated by IndiaVotes Election Process Assistant",
    "═══════════════════════════════════════════════════",
  ].join("\n");
}
