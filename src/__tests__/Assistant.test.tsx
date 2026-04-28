/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Assistant from "@/components/Assistant";

// Mock scrollIntoView which is not available in jsdom
beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

// Mock the auth context
jest.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    accessToken: null,
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
  }),
}));

// Mock the firestore module
jest.mock("@/lib/firestore", () => ({
  saveChatHistory: jest.fn(),
  loadChatHistory: jest.fn().mockResolvedValue([]),
}));

// Mock the google-apis module
jest.mock("@/lib/google-apis", () => ({
  sendChatHistoryEmail: jest.fn(),
}));

describe("Assistant", () => {
  it("renders the section heading", () => {
    render(<Assistant />);
    expect(
      screen.getByRole("heading", { name: /Smart Voter Assistant/i })
    ).toBeInTheDocument();
  });

  it("renders the chat region with accessible label", () => {
    render(<Assistant />);
    const chatRegion = screen.getByRole("region", {
      name: /Election assistant chat/i,
    });
    expect(chatRegion).toBeInTheDocument();
  });

  it("renders the initial greeting message", () => {
    render(<Assistant />);
    expect(screen.getByText(/Namaste/i)).toBeInTheDocument();
  });

  it("renders the chat log with aria-live for screen readers", () => {
    render(<Assistant />);
    const log = screen.getByRole("log");
    expect(log).toHaveAttribute("aria-live", "polite");
  });

  it("renders the chat header with online status", () => {
    render(<Assistant />);
    expect(
      screen.getByRole("heading", { name: /Election AI Assistant/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();
  });
});
