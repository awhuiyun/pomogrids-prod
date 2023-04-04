/**
 * Returns true if the user is either "active" or "trialing"
 * @param status Profile.stripeSubscriptionStatus
 * @returns
 */
export function profileIsPremium(status?: string | null): boolean {
  if (!status) return false;
  return ["active", "trialing"].includes(status);
}
