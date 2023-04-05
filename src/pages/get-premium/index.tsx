import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useRouter } from "next/router";
import useUserStore from "@/stores/user";
import useToastStore from "@/stores/toast";
import BaseButton from "@/components/base/BaseButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { createCheckOutSessionService } from "@/services/payments";

export default function GetPremiumPage() {
  const router = useRouter();
  const { profile, getPremiumStatus } = useUserStore();
  const addToast = useToastStore((state) => state.addToast);
  const [isLoading, setIsLoading] = useState(false);

  async function handleClickSubscribe(type: "monthly" | "yearly") {
    // Get user to sign in
    if (!profile) {
      router.push("/signin");
      return;
    }

    // Check if user is already a premium user
    if (getPremiumStatus()) {
      addToast({
        uniqueId: uuidv4(),
        className: "bg-green-50 text-green-700",
        content: "You are already a premium user!",
      });

      return;
    }

    // Create checkout session
    const priceId =
      type === "monthly"
        ? (process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY as string)
        : (process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY as string);

    try {
      setIsLoading(true);

      const payload = {
        priceId,
        profileId: profile?.id,
      };

      await createCheckOutSessionService(payload);
    } catch (error) {
      addToast({
        uniqueId: uuidv4(),
        className: "bg-red-50 text-red-700",
        content: "Something went wrong...please try again!",
      });
      setIsLoading(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="flex flex-col space-y-4">
      <div
        onClick={(e) => {
          e.preventDefault();
          handleClickSubscribe("monthly");
        }}
      >
        <BaseButton
          type="button"
          label="Monthly"
          className="text-white bg-blue4 px-4 py-2 w-fit"
        />
      </div>

      <div
        onClick={(e) => {
          e.preventDefault();
          handleClickSubscribe("yearly");
        }}
      >
        <BaseButton
          type="button"
          label="Annual"
          className="text-white bg-blue4 px-4 py-2 w-fit"
        />
      </div>
    </div>
  );
}