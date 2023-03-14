import axios from "axios";
import { User } from "firebase/auth";
import { IUserTier } from "@/types";

// Function to get user tiers
export async function getUserTier(
  user: User | null
): Promise<IUserTier | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const { data: tier } = await axios<IUserTier>({
        method: "get",
        url: "/api/users/get-user-tier",
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
export async function updateUserTier(
  user: User | null,
  tier: IUserTier
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const { data: response } = await axios<string>({
        method: "patch",
        url: "/api/users/update-user-tier",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: tier,
      });

      return response;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
