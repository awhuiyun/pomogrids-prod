import { useRouter } from "next/router";
import BaseButton from "../base/BaseButton";

export default function SettingsStripePortal() {
  const router = useRouter();
  // User is on Premium plan
  return (
    <div className="space-y-4">
      <p>
        You are currently on the{" "}
        <span className="text-emerald-500 font-semibold">Premium</span> plan.
      </p>
      <BaseButton
        type="button"
        label="Manage my subscription"
        className="text-white bg-blue4 px-4 py-2"
      />
    </div>
  );

  // User is on Free plan
  return (
    <div className="space-y-4">
      <p>
        You are currently on the{" "}
        <span className="text-emerald-500 font-semibold">Free</span> plan.
      </p>
      <BaseButton
        type="button"
        label="Subcribe to premium"
        className="text-white bg-blue4 px-4 py-2"
      />
    </div>
  );
}
