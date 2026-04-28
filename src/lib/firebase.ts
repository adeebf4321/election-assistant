/**
 * Firebase configuration and initialization module.
 *
 * Initializes Firebase App, Firebase Analytics, Firebase Authentication,
 * and Cloud Firestore for tracking user engagement, authenticating users,
 * and persisting data across sessions.
 * Analytics is only initialized in the browser environment.
 */
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/** Firebase project configuration sourced from environment variables */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "election-assistant",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

/** Singleton Firebase App instance */
let app: FirebaseApp;

/** Singleton Firebase Analytics instance */
let analytics: Analytics | null = null;

/** Singleton Firebase Auth instance */
let auth: Auth | null = null;

/** Singleton Firestore instance */
let db: Firestore | null = null;

/**
 * Returns the initialized Firebase App instance.
 * Uses a singleton pattern to prevent multiple initializations.
 * Returns null if the configuration is incomplete.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey) {
    return null;
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  return app;
}

/**
 * Returns the Firebase Analytics instance.
 * Analytics is only available in browser environments.
 * Returns null on the server or if analytics is not supported.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) return null;

  if (!analytics) {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return null;
    analytics = getAnalytics(firebaseApp);
  }
  return analytics;
}

/**
 * Returns the Firebase Auth instance.
 * Uses a singleton pattern to prevent multiple initializations.
 * Returns null if the Firebase app cannot be initialized.
 */
export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined") return null;

  if (!auth) {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return null;
    auth = getAuth(firebaseApp);
  }
  return auth;
}

/**
 * Returns the Cloud Firestore instance.
 * Uses a singleton pattern to prevent multiple initializations.
 * Returns null if the Firebase app cannot be initialized.
 */
export function getFirebaseFirestore(): Firestore | null {
  if (typeof window === "undefined") return null;

  if (!db) {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return null;
    db = getFirestore(firebaseApp);
  }
  return db;
}
