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
export async function updateSettingsService(user_id: string) {
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
    console.log(result.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
