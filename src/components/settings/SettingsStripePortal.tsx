import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useRouter } from "next/router";
import useUserStore from "@/stores/useUserStore";
import useToastStore from "@/stores/useToastStore";
import BaseButton from "../base/BaseButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CreatePortalSessionPayload } from "@/types";
import { createPortalSessionService } from "@/services/payments";

export default function SettingsStripePortal() {
  const router = useRouter();
  const { profile, getPremiumStatus } = useUserStore();
  const addErrorToast = useToastStore((state) => state.addErrorToast);
  const [isLoading, setIsLoading] = useState(false);

  async function handleMySubscription() {
    if (!profile) return;

    try {
      setIsLoading(true);

      const payload: CreatePortalSessionPayload = { profileId: profile?.id };

      await createPortalSessionService(payload);
    } catch (error) {
      addErrorToast("Something went wrong...please try again!");
      setIsLoading(false);
    }
  }

  // User is on Premium plan
  if (getPremiumStatus()) {
    return (
      <div className="space-y-6">
        <p className="text-xl">
          You are currently on the{" "}
          <span className="text-emerald-500 font-semibold">Premium</span> plan.
        </p>
        {isLoading ? (
          <BaseButton
            type="button"
            label="Loading..."
            className="text-white bg-blue1 px-4 py-2 cursor-wait"
          />
        ) : (
          <div onClick={handleMySubscription}>
            <BaseButton
              type="button"
              label="Manage my subscription"
              className="text-white bg-blue4 px-4 py-2"
            />
          </div>
        )}
      </div>
    );
  }

  // User is on Free plan
  return (
    <div className="space-y-6">
      <p className="text-xl">
        You are currently on the{" "}
        <span className="text-emerald-500 font-semibold">Free</span> plan.
      </p>
      <div onClick={() => router.push("/get-premium")}>
        <BaseButton
          type="button"
          label="Subcribe to premium"
          className="text-white bg-blue4 px-4 py-2"
        />
      </div>
    </div>
  );
}
