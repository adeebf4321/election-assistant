/**
 * Firestore chat history module.
 *
 * Provides functions to save and load the AI Assistant chat
 * history from Cloud Firestore, keyed by the authenticated
 * user's UID. Each user gets a single document in the
 * `chatHistory` collection containing their messages array.
 */
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase";

/** Represents a single chat message persisted in Firestore */
export interface ChatMessage {
  /** The sender of the message */
  role: "user" | "assistant";
  /** The text content of the message */
  content: string;
}

/**
 * Saves the full chat history for a given user to Firestore.
 * Overwrites the existing document with the latest messages array.
 *
 * @param uid - The Firebase Auth user ID
 * @param messages - The array of chat messages to persist
 */
export async function saveChatHistory(
  uid: string,
  messages: ChatMessage[]
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) return;

  try {
    const docRef = doc(db, "chatHistory", uid);
    await setDoc(docRef, {
      messages,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
}

/**
 * Loads the chat history for a given user from Firestore.
 * Returns an empty array if no history exists.
 *
 * @param uid - The Firebase Auth user ID
 * @returns The array of saved chat messages
 */
export async function loadChatHistory(
  uid: string
): Promise<ChatMessage[]> {
  const db = getFirebaseFirestore();
  if (!db) return [];

  try {
    const docRef = doc(db, "chatHistory", uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return (data.messages as ChatMessage[]) || [];
    }
  } catch (error) {
    console.error("Error loading chat history:", error);
  }

  return [];
}
