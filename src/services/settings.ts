import axios from "axios";

// Function to retrieve settings for user
export async function getSettingsService(user_id: string) {
  try {
    const result = await axios({
      method: "post",
      url: "http://127.0.0.1:5001/settings/get",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        user_id,
      },
    });
    return result.data[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to update settings for user
export async function updateSettingsService(
  user_id: string,
  pomodoro_minutes: number,
  short_break_minutes: number,
  long_break_minutes: number,
  number_of_sessions_in_a_cycle: number,
  alarm_ringtone: string,
  alarm_volume: number
) {
  try {
    const result = await axios({
      method: "patch",
      url: "http://127.0.0.1:5001/settings/update",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        user_id,
        pomodoro_minutes,
        short_break_minutes,
        long_break_minutes,
        number_of_sessions_in_a_cycle,
        alarm_ringtone,
        alarm_volume,
      },
    });
    console.log(result.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
