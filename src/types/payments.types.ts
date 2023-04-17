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

export interface CreatePortalSessionPayload {
  profileId: string;
}

export interface CreatePortalSessionResponse {
  sessionUrl: string;
}
