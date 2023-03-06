import axios from "axios";
import { User } from "firebase/auth";

// Function to get user tiers
export async function getUserTier(user: User) {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const result = await axios({
        method: "get",
        url: process.env.NEXT_PUBLIC_SERVER_URL + "/users/get-user-tier",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
      });

      return result.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
