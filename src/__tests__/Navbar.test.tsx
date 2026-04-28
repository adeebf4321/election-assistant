/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";

// Mock next/link to render a plain anchor
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock the auth context
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
jest.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    accessToken: null,
    signInWithGoogle: mockSignIn,
    signOut: mockSignOut,
  }),
}));

describe("Navbar", () => {
  it("renders the brand name IndiaVotes", () => {
    render(<Navbar />);
    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.getByText("Votes")).toBeInTheDocument();
  });

  it("renders the main navigation landmark", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation", { name: /Main navigation/i });
    expect(nav).toBeInTheDocument();
  });

  it("renders desktop navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Election Timeline")).toBeInTheDocument();
    expect(screen.getByText("Voter Guide")).toBeInTheDocument();
    expect(screen.getByText("Ask Assistant")).toBeInTheDocument();
  });

  it("has an accessible mobile menu toggle button", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", {
      name: /Open navigation menu/i,
    });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles the mobile menu on click", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", {
      name: /Open navigation menu/i,
    });

    fireEvent.click(toggle);

    // After opening, the button should have aria-expanded=true
    const closeToggle = screen.getByRole("button", {
      name: /Close navigation menu/i,
    });
    expect(closeToggle).toHaveAttribute("aria-expanded", "true");

    // Mobile menu should be visible
    const mobileMenu = screen.getByRole("navigation", {
      name: /Mobile menu/i,
    });
    expect(mobileMenu).toBeInTheDocument();
  });

  it("renders a Sign In button when user is not authenticated", () => {
    render(<Navbar />);
    const signInBtn = screen.getByRole("button", {
      name: /Sign in with Google/i,
    });
    expect(signInBtn).toBeInTheDocument();
  });
});
