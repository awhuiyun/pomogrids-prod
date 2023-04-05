import axios from "axios";
import { User } from "firebase/auth";
import { Profile } from "@/types";

// Function to get user profile
export async function getProfile(user: User | null): Promise<Profile | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const { data: profile } = await axios<Profile>({
        method: "get",
        url: "/api/users/get-profile",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
      });

      return profile;
    }
  } catch (error) {
    throw error;
  }
}

// Function to create new account for new users
export async function createNewAccount(
  user: User | null
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const { data: response } = await axios<string>({
        method: "patch",
        url: "/api/users/create-new-account",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
      });

      return response;
    }
  } catch (error) {
    throw error;
  }
}
