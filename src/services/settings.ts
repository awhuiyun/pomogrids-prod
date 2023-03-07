import axios from "axios";
import { User } from "firebase/auth";

// Function to retrieve settings for user
export async function getSettingsService(user: User | null) {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const result = await axios({
        method: "post",
        url: process.env.NEXT_PUBLIC_SERVER_URL + "/settings/get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
      });
      return result.data[0];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to update settings for user
export async function updateSettingsService(
  user: User | null,
  pomodoro_minutes: number,
  short_break_minutes: number,
  long_break_minutes: number,
  number_of_sessions_in_a_cycle: number,
  alarm_ringtone: string,
  alarm_volume: number,
  week_start: string
) {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const result = await axios({
        method: "patch",
        url: process.env.NEXT_PUBLIC_SERVER_URL + "/settings/update",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: {
          pomodoro_minutes,
          short_break_minutes,
          long_break_minutes,
          number_of_sessions_in_a_cycle,
          alarm_ringtone,
          alarm_volume,
          week_start,
        },
      });
      console.log(result.data);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
