import { Settings } from "@prisma/client";
import axios from "axios";
import { User } from "firebase/auth";
import { UpdateSettingsPayload } from "@/types";

export async function getSettingsService(
  user: User | null
): Promise<Settings | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const { data: settings } = await axios<Settings>({
        method: "get",
        url: "/api/settings/get-settings",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
      });

      return settings;
    }
  } catch (error) {
    // console.log(error);
    throw error;
  }
}

// Function to update settings for user
export async function updateSettingsService(
  user: User | null,
  payload: UpdateSettingsPayload
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const { data: response } = await axios<string>({
        method: "patch",
        url: "/api/settings/update-settings",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: payload,
      });
      // Testing optimistic loading
      // throw new Error();
      return response;
    }
  } catch (error) {
    // console.log(error);
    throw error;
  }
}
