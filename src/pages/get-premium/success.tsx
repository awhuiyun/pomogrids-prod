import BaseButton from "@/components/BaseButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import useUserStore from "@/stores/user";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

export default function PremiumSuccessPage() {
  const router = useRouter();
  const { user } = useUserStore();

  if (!user) return <LoadingSpinner />;

  return (
    <div>
      <div className="text-center">
        <FontAwesomeIcon
          icon={faStar}
          className="animate-bounce text-amber-400 text-4xl"
        />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-center">
        You are subscribed to the premium plan, hooray!!
      </h1>
      <h2 className="text-lg text-slate-400 text-center mt-4">
        Thank you for the support! We hope this little thing we built helps you
        out. Cheerrriiooss~
      </h2>
      <div className="text-center mt-10">
        <div onClick={() => router.push("/")}>
          <BaseButton
            type="button"
            label="Back to my tasks ->"
            className="text-blue4 hover:underline underline-offset-2"
          />
        </div>
      </div>
    </div>
  );
}
