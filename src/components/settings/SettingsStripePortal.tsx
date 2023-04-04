import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useRouter } from "next/router";
import useUserStore from "@/stores/user";
import useToastStore from "@/stores/toast";
import BaseButton from "../base/BaseButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CreatePortalSessionPayload } from "@/types";
import { createPortalSessionService } from "@/services/payments";

export default function SettingsStripePortal() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const user_id = useUserStore((state) => state.user_id);
  const tier = useUserStore((state) => state.tier);
  const addToast = useToastStore((state) => state.addToast);
  const [isLoading, setIsLoading] = useState(false);

  async function handleMySubscription() {
    if (!user) return;

    try {
      setIsLoading(true);

      const payload: CreatePortalSessionPayload = { profileId: user_id };

      await createPortalSessionService(payload);
    } catch (error) {
      addToast({
        uniqueId: uuidv4(),
        className: "bg-red-50 text-red-700",
        content: "Something went wrong...please try again!",
      });
      setIsLoading(false);
    }
  }

  // User is on Premium plan
  return (
    <div className="space-y-4">
      <p>
        You are currently on the{" "}
        <span className="text-emerald-500 font-semibold">Premium</span> plan.
      </p>
      {isLoading ? (
        <LoadingSpinner />
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

  // User is on Free plan
  return (
    <div className="space-y-4">
      <p>
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
