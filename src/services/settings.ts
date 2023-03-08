import axios from "axios";
import { User } from "firebase/auth";

// Function to retrieve settings for user
interface ISettings {
  user_id: string;
  pomodoro_minutes: number;
  short_break_minutes: number;
  long_break_minutes: number;
  number_of_sessions_in_a_cycle: number;
  alarm_ringtone: string;
  alarm_volume: number;
  week_start: string;
}

export async function getSettingsService(
  user: User | null
): Promise<ISettings | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const { data: settings } = await axios<ISettings[]>({
        method: "post",
        url: process.env.NEXT_PUBLIC_SERVER_URL + "/settings/get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
      });

      return settings[0];
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
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const { data: response } = await axios<string>({
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
      return response;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
