import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function Signin() {
  return (
    <div className="pt-2 text-slate-900 w-[1280px] mx-auto">
      <div className="border border-slate-900 shadow-custom shadow-slate-900 rounded p-4 pt-6 w-[415px] h-fit mx-auto">
        <h1 className="text-4xl font-bold text-center">Sign in / Sign up</h1>
        <p className="mt-4 text-center">
          Signing in persists your data so you can use
          <br />
          Pomogrids across browsers and devices.
        </p>
        <button className="w-full text-center border border-slate-900 rounded font-medium mt-6 py-2 hover:bg-slate-100">
          <FontAwesomeIcon icon={faGoogle} className="mr-2" />
          Continue with Google
        </button>
        <p className="text-center mt-6 text-sm text-slate-400">
          By continuing you are agreeing to our Terms of Use and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
