import Link from "next/link";
import { signOutwithGoogle } from "@/firebase/auth";
import BaseButton from "./BaseButton";
import useUserStore from "@/stores/user";

export default function Nav() {
  // Global states: useUserStore
  const { setUserId, setEmail, user_id } = useUserStore();

  function handleUserSignOut() {
    signOutwithGoogle();

    // Reset global states
    setUserId("");
    setEmail("");
  }

  return (
    <div className="flex items-center py-4 space-x-6 sm:space-x-4">
      <Link href="/" className="font-bold text-base">
        Pomogrids <span className="text-xs ml-1 text-blue4">BETA</span>
      </Link>
      <div className="flex-grow"></div>
      {user_id ? (
        <div onClick={handleUserSignOut}>
          <BaseButton
            type="button"
            label="Sign Out"
            className="text-red-500 hover:underline underline-offset-2"
          />
        </div>
      ) : (
        <Link href="/signin">
          <BaseButton
            type="button"
            label="Sign In"
            className="text-blue4 hover:underline underline-offset-2"
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
