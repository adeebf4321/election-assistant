/**
 * Authentication context and provider.
 *
 * Provides a React context for Firebase Authentication state,
 * exposing the current user, Google OAuth access token, sign-in
 * (Google popup with Gmail & Drive scopes), and sign-out
 * functions to all child components. Listens for auth state
 * changes via Firebase's onAuthStateChanged observer.
 */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { GOOGLE_SCOPES } from "@/lib/google-apis";

/** Shape of the authentication context value */
interface AuthContextValue {
  /** The currently signed-in Firebase user, or null */
  user: User | null;
  /** Whether the auth state is still being determined */
  loading: boolean;
  /** Google OAuth access token for API calls (Gmail, Drive) */
  accessToken: string | null;
  /** Opens the Google Sign-In popup with Gmail & Drive scopes */
  signInWithGoogle: () => Promise<void>;
  /** Signs the current user out */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  accessToken: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

/**
 * Hook to access the authentication context.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

/**
 * AuthProvider wraps the component tree and provides
 * authentication state and actions via React context.
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /** Opens Google Sign-In popup with extended scopes for Gmail & Drive */
  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;

    // First try with Gmail & Drive scopes
    const provider = new GoogleAuthProvider();
    GOOGLE_SCOPES.forEach((scope) => provider.addScope(scope));

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken);
      }
    } catch (error: unknown) {
      console.warn("Sign-in with scopes failed, trying basic sign-in:", error);

      // Fallback: try basic Google Sign-In without extra scopes
      try {
        const basicProvider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, basicProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          setAccessToken(credential.accessToken);
        }
      } catch (fallbackError) {
        console.error("Google sign-in error:", fallbackError);
      }
    }
  }, []);

  /** Signs the current user out and clears the access token */
  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      setAccessToken(null);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, accessToken, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
