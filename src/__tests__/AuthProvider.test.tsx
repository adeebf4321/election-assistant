/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import AuthProvider, { useAuth } from "@/lib/auth-context";

// Mock Firebase auth module
jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((_auth: unknown, callback: (user: null) => void) => {
    // Simulate no user signed in
    callback(null);
    return jest.fn(); // unsubscribe
  }),
}));

// Mock the firebase lib to return a mock auth instance
jest.mock("@/lib/firebase", () => ({
  getFirebaseAuth: () => ({}),
}));

// Mock the google-apis module
jest.mock("@/lib/google-apis", () => ({
  GOOGLE_SCOPES: ["https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/drive.file"],
}));

/** Helper component that consumes the auth context */
function AuthConsumer() {
  const { user, loading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? "signed-in" : "signed-out"}</span>
    </div>
  );
}

describe("AuthProvider", () => {
  it("provides auth context to child components", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId("user")).toHaveTextContent("signed-out");
  });

  it("sets loading to false after auth state is resolved", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("renders children without crashing", () => {
    render(
      <AuthProvider>
        <p>Test child content</p>
      </AuthProvider>
    );
    expect(screen.getByText("Test child content")).toBeInTheDocument();
  });
});
