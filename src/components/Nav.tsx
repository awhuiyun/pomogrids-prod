import BaseButton from "./BaseButton";

export default function Nav() {
  return (
    <div className="flex items-center px-10 py-4">
      <p className="flex-grow font-bold text-slate-900">Pomogrids</p>
      <BaseButton
        type="button"
        label="Sign In"
        className="text-blue4 hover:underline underline-offset-2 mr-10"
      />
      <BaseButton
        type="button"
        label="How to ->"
        className="text-white bg-blue4 px-4 py-2"
      />
    </div>
  );
}
