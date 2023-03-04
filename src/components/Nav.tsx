import Link from "next/link";
import { signOutwithGoogle } from "@/auth/functions";
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
    <div className="flex items-center py-6 w-[1280px] mx-auto">
      <Link href="/" className="flex-grow font-bold text-slate-900">
        Pomogrids
      </Link>
      {user_id ? (
        <div onClick={handleUserSignOut}>
          <BaseButton
            type="button"
            label="Sign Out"
            className="text-red-500 hover:underline underline-offset-2 mr-10"
          />
        </div>
      ) : (
        <Link href="/signin">
          <BaseButton
            type="button"
            label="Sign In"
            className="text-blue4 hover:underline underline-offset-2 mr-10"
          />
        </Link>
      )}

      {/* How-to button */}
      <Link href="/how-to">
        <BaseButton
          type="button"
          label="How to ->"
          className="text-white bg-blue4 px-4 py-2"
        />
      </Link>
    </div>
  );
}
