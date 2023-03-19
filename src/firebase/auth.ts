import app from "./index";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Functions
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    // console.log(error);
  }
}

export async function signOutwithGoogle() {
  try {
    await signOut(auth);

    return "Successful!";
  } catch (error) {
    // console.log(error);
  }
}
