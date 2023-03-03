import Link from "next/link";
import { signOutwithGoogle } from "@/auth/functions";
import BaseButton from "./BaseButton";

export default function Nav() {
  function handleUserSignOut() {
    signOutwithGoogle();
  }

  return (
    <div className="flex items-center py-6 w-[1280px] mx-auto">
      <Link href="/" className="flex-grow font-bold text-slate-900">
        Pomogrids
      </Link>
      {/* Sign in button */}
      <Link href="/signin">
        <BaseButton
          type="button"
          label="Sign In"
          className="text-blue4 hover:underline underline-offset-2 mr-10"
        />
      </Link>
      {/* Sign out button */}
      <div onClick={handleUserSignOut}>
        <BaseButton
          type="button"
          label="Sign Out"
          className="text-blue4 hover:underline underline-offset-2 mr-10"
        />
      </div>
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
