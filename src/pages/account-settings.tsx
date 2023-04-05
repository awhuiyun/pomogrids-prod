import BaseButton from "@/components/base/BaseButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import SettingsStripePortal from "@/components/settings/SettingsStripePortal";
import useUserStore from "@/stores/user";
import { signOutwithGoogle } from "@/utils/firebase/auth";
import { useRouter } from "next/router";

export default function AccountSettingsPage() {
  let router = useRouter();
  const { profile, setUser, setProfile } = useUserStore();

  function handleUserSignOut() {
    signOutwithGoogle();

    // Reset global states
    setUser(null);
    setProfile(null);

    // Route to main page
    router.push("/");
  }

  if (!profile) return <LoadingSpinner />;

  return (
    <div className="flex-flex-col space-y-20 mx-auto max-w-4xl mt-10">
      {/* Subscription */}
      <section>
        <h2 className="font-bold text-4xl">Subscription details</h2>
        <div className="mt-6">
          <SettingsStripePortal />
        </div>
      </section>

      {/* Log out */}
      <section>
        <h2 className="font-bold text-4xl">Logout</h2>
        <div className="mt-6" onClick={handleUserSignOut}>
          <BaseButton
            type="button"
            label="Logout"
            className="text-white bg-blue4 px-4 py-2"
          />
        </div>
      </section>
    </div>
  );
}
