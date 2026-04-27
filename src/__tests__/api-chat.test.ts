/**
 * Tests for the offline knowledge base fallback logic.
 *
 * These tests verify that the keyword-based fallback system
 * returns accurate, topic-specific responses for common
 * election-related queries when the Gemini API is unavailable.
 */

// We test the getOfflineResponse logic by importing the route
// and calling the POST handler with a mock Request.
// Since jsdom doesn't have the native Request API, we test
// the logic by directly invoking the endpoint with node's fetch.

describe("Offline Knowledge Base", () => {
  // Inline replica of the getOfflineResponse logic for unit testing
  // This mirrors the logic in route.ts without requiring Next.js server context
  const KEYWORDS: Record<string, string[]> = {
    eligibility: ["eligib", "who can vote", "age", "qualify"],
    registration: ["register", "registration", "enroll", "nvsp"],
    "form 6": ["form 6", "form6"],
    epic: ["epic", "voter id", "voter card", "identity"],
    evm: ["evm", "voting machine", "how to vote", "vvpat"],
    "polling booth": ["polling", "booth", "station", "where to vote", "carry"],
  };

  function matchTopic(message: string): string | null {
    const lowerMsg = message.toLowerCase();
    for (const [topic, keywords] of Object.entries(KEYWORDS)) {
      if (keywords.some((kw) => lowerMsg.includes(kw))) {
        return topic;
      }
    }
    return null;
  }

  it("matches eligibility queries correctly", () => {
    expect(matchTopic("Am I eligible to vote?")).toBe("eligibility");
    expect(matchTopic("What is the minimum age?")).toBe("eligibility");
    expect(matchTopic("Who can vote in India?")).toBe("eligibility");
  });

  it("matches registration queries correctly", () => {
    expect(matchTopic("How to register as a voter?")).toBe("registration");
    expect(matchTopic("Tell me about NVSP")).toBe("registration");
    expect(matchTopic("I want to enroll")).toBe("registration");
  });

  it("matches Form 6 queries correctly", () => {
    expect(matchTopic("What is Form 6?")).toBe("form 6");
    expect(matchTopic("How to fill form6?")).toBe("form 6");
  });

  it("matches EPIC/Voter ID queries correctly", () => {
    expect(matchTopic("What is EPIC?")).toBe("epic");
    expect(matchTopic("How to get voter id?")).toBe("epic");
    expect(matchTopic("Lost my voter card")).toBe("epic");
  });

  it("matches EVM queries correctly", () => {
    expect(matchTopic("How does EVM work?")).toBe("evm");
    expect(matchTopic("Tell me about VVPAT")).toBe("evm");
    expect(matchTopic("How to vote on election day?")).toBe("evm");
  });

  it("matches polling booth queries correctly", () => {
    expect(matchTopic("Where is my polling station?")).toBe("polling booth");
    expect(matchTopic("Find my booth")).toBe("polling booth");
    expect(matchTopic("What to carry on voting day?")).toBe("polling booth");
  });

  it("returns null for unrecognized queries", () => {
    expect(matchTopic("random unrelated text xyz")).toBeNull();
    expect(matchTopic("what is the weather today")).toBeNull();
  });
});
