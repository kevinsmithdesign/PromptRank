import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const saveUserData = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    // Only create user document if it doesn't exist
    await setDoc(userRef, {
      email: user.email,
      userName: user.email?.split("@")[0] || "Anonymous",
      photoURL: user.photoURL || null,
      createdAt: new Date().toISOString(),
    });
  }
};
