import app from "./index";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Functions
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function signOutFromGoogleAccount() {
  try {
    await signOut(auth);

    return "Successful!";
  } catch (error) {
    console.log(error);
  }
}

export async function isUserSignedIn() {
  try {
    const result = await new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          return resolve(user);
        } else {
          return resolve("No user is signed in");
        }
      });
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function isUserSignedIn2() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      return user;
    } else {
      return "No user is signed in";
    }
  });
}
