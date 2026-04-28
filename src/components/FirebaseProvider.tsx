/**
 * FirebaseProvider component.
 *
 * A client-side component that initializes Firebase Analytics
 * when the application mounts in the browser and wraps the
 * component tree with the AuthProvider for Firebase Authentication.
 * It renders no visible UI of its own and is intended to wrap
 * the application in the root layout.
 */
"use client";

import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase";
import AuthProvider from "@/lib/auth-context";

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize Firebase Analytics on mount
    getFirebaseAnalytics().then((analytics) => {
      if (analytics) {
        console.log("Firebase Analytics initialized successfully.");
      }
    });
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
}
