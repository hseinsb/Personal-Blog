import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./firebase";
import { ADMIN_UID } from "./firebase";

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
}

export function isAdminUser(user: User | null) {
  if (!user) {
    console.log("No user provided to isAdminUser");
    return false;
  }

  // Trim both UIDs to ensure no whitespace issues
  const userUid = user.uid.trim();
  const adminUid = ADMIN_UID.trim();

  console.log("User UID in isAdminUser:", userUid);
  console.log("Admin UID in isAdminUser:", adminUid);
  console.log("UIDs match?", userUid === adminUid);

  return userUid === adminUid;
}

export function useAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
