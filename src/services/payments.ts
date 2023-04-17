import axios from "axios";
import {
  CreateCheckoutSessionPayload,
  CreateCheckoutSessionResponse,
  CreatePortalSessionPayload,
  CreatePortalSessionResponse,
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

export async function createPortalSessionService(
  payload: CreatePortalSessionPayload
): Promise<void> {
  try {
    const { data } = await axios<CreatePortalSessionResponse>({
      method: "post",
      url: "/api/payments/create-portal-session",
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
