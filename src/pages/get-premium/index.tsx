import { useState } from "react";
import { useRouter } from "next/router";
import useUserStore from "@/stores/useUserStore";
import useToastStore from "@/stores/useToastStore";
import LoadingSpinner from "@/components/LoadingSpinner";
import { createCheckOutSessionService } from "@/services/payments";

export default function GetPremiumPage() {
  const router = useRouter();
  const { profile, getPremiumStatus, isLoading } = useUserStore();
  const { addSuccessToast, addErrorToast } = useToastStore();
  const [isCheckoutSessionLoading, setIsCheckoutSessionLoading] =
    useState(false);

  async function handleClickSubscribe(type: "monthly" | "yearly") {
    // Get user to sign in
    if (!profile) {
      router.push("/signin/premium");
      return;
    }

    // Check if user is already a premium user
    if (getPremiumStatus()) {
      addSuccessToast("You are already a premium user!");

      return;
    }

    // Create checkout session
    const priceId =
      type === "monthly"
        ? (process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY as string)
        : (process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY as string);

    try {
      setIsCheckoutSessionLoading(true);

      const payload = {
        priceId,
        profileId: profile?.id,
      };

      await createCheckOutSessionService(payload);
    } catch (error) {
      addErrorToast("Something went wrong...please try again!");
      setIsCheckoutSessionLoading(false);
    }
  }

  function handleSubscribeMonthlyButton() {
    // e.preventDefault();
    handleClickSubscribe("monthly");
  }

  function handleSubscribeYearlyButton() {
    handleClickSubscribe("yearly");
  }

  if (isLoading) return <LoadingSpinner />;
  if (isCheckoutSessionLoading) return <LoadingSpinner />;
  return (
    <div className="border border-slate-900 shadow-custom shadow-slate-900 rounded px-4 py-12 max-w-md h-fit mx-auto">
      <h1 className="text-3xl font-bold text-center">
        Subscribe to Premium <br />
        to unlock custom timers
      </h1>
      <p className="mt-4 text-sm text-center">
        ...and future features, such as custom heat map themes!
      </p>
      <div className="mt-10 flex flex-row space-x-4 mx-auto">
        <button
          type="button"
          className="text-black bg-blue0 border border-blue3 w-full h-44 rounded"
          onClick={handleSubscribeMonthlyButton}
        >
          <span className="text-4xl">$3</span> <br />
          monthly
        </button>
        <button
          type="button"
          className="text-white bg-blue3 w-full h-44 rounded"
          onClick={handleSubscribeYearlyButton}
        >
          <span className="text-4xl">$30</span> <br />
          yearly
        </button>
      </div>
      <p className="w-fit mx-auto mt-16">
        Payments handled securely by{" "}
        <a
          href="https://stripe.com/en-gb-sg"
          target="_blank"
          className="text-blue3 hover:underline underline-offset-2"
        >
          Stripe
        </a>
        .
      </p>
    </div>
  );
}
