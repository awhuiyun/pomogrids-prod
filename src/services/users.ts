import axios from "axios";
import { User } from "firebase/auth";

// Function to get user tiers
interface IUserTier {
  tier: "premiun" | "basic";
}

export async function getUserTier(
  user: User | null
): Promise<IUserTier[] | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const { data: tier } = await axios<IUserTier[]>({
        method: "get",
        url: process.env.NEXT_PUBLIC_SERVER_URL + "/users/get-user-tier",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
      });

      return tier;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to upgrade user tier from basic to premium
export async function upgradeUserTier(
  user: User | null
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const { data: response } = await axios<string>({
        method: "patch",
        url: process.env.NEXT_PUBLIC_SERVER_URL + "/users/upgrade-user-tier",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
      });

      return response;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
