import Link from "next/link";
import BaseButton from "./base/BaseButton";
import useUserStore from "@/stores/useUserStore";

export default function Nav() {
  // Global states: useUserStore
  const { user, profile, isLoading, getPremiumStatus } = useUserStore();
  const isPremium = getPremiumStatus();

  return (
    <div className="flex items-center py-4 space-x-4 text-[10px] sm:space-x-6 sm:text-base">
      <Link href="/" className="font-bold">
        Pomogrids{" "}
        <span className="text-[8px] sm:text-xs ml-1 text-blue4">BETA</span>
      </Link>
      <div className="flex-grow"></div>
      {/* Sign in page */}
      {!user && !isLoading && (
        <Link href="/signin">
          <BaseButton
            type="button"
            label="Sign In"
            className="text-blue4 hover:underline underline-offset-2"
          />
        </Link>
      )}

      {/* Premium page */}
      {!isPremium && !isLoading && (
        <Link href="/get-premium">
          <BaseButton
            type="button"
            label="Premium"
            className="text-blue4 hover:underline underline-offset-2 ml-4"
          />
        </Link>
      )}

      {/* Settings Page */}
      {profile && !isLoading && (
        <Link href="/account-settings">
          <BaseButton
            type="button"
            label="Account"
            className="text-blue4 hover:underline underline-offset-2 ml-4"
          />
        </Link>
      )}

      {/* How-to button */}
      <Link href="/how-to">
        <BaseButton
          type="button"
          label="How to ->"
          className="text-white bg-blue4 px-4 py-2 ml-4"
        />
      </Link>
    </div>
  );
}
