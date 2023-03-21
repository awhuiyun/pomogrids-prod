import axios from "axios";
import {
  CreateCheckoutSessionPayload,
  CreateCheckoutSessionResponse,
} from "@/types";

export async function createCheckOutSessionService(
  payload: CreateCheckoutSessionPayload
): Promise<void> {
  try {
    const { data } = await axios<CreateCheckoutSessionResponse>({
      method: "post",
      url: "/api/payments/create-checkout-session",
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    });

    window.location.replace(data.sessionUrl);
  } catch (error) {
    throw error;
  }
}
