import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signInWithGoogle } from "@/auth/functions";
import useUserStore from "@/stores/user";

export default function Signin() {
  // Global states: useUserStore
  const { setUserId, setEmail } = useUserStore();

  // Function to sign in with google
  async function handleSignInWithGoogle() {
    try {
      const result = await signInWithGoogle();

      if (result) {
        if (result.user.email !== null) {
          setEmail(result.user.email);
        }
        if (result.user.uid !== null) {
          setUserId(result.user.uid);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="pt-2 text-slate-900 w-[1280px] mx-auto">
      <div className="border border-slate-900 shadow-custom shadow-slate-900 rounded px-4 py-8 w-[415px] h-fit mx-auto">
        <h1 className="text-4xl font-bold text-center">Sign in / Sign up</h1>
        <p className="mt-4 text-center">
          Signing in persists your data so you can use
          <br />
          Pomogrids across browsers and devices.
        </p>
        <button
          className="w-full text-center border border-slate-900 rounded font-medium mt-6 py-2 hover:bg-slate-100"
          onClick={handleSignInWithGoogle}
        >
          <FontAwesomeIcon icon={faGoogle} className="mr-2" />
          Continue with Google
        </button>
        <p className="text-center mt-6 text-sm text-slate-400">
          By continuing you are agreeing to our{" "}
          <span className="text-blue4 hover:underline cursor-pointer">
            Terms of Use
          </span>{" "}
          and{" "}
          <span className="text-blue4 hover:underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}
