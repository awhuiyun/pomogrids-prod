export interface CustomerType {
  name: string;
}

export interface CreateCheckoutSessionPayload {
  priceId: string;
  profileId: string;
}

export interface CreateCheckoutSessionResponse {
  sessionUrl: string;
}
