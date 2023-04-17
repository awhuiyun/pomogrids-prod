import Image from "next/image";

export default function UnderConstruction() {
  return (
    <div className="backdrop-blur-sm inset-0 bg-slate-700/20 fixed fade-in z-50">
      <div className="flex flex-col border border-slate-900 shadow-custom shadow-slate-900 rounded sticky top-28 mx-auto bg-white w-[600px] text-slate-900 p-6">
        <h1 className="text-3xl text-center">
          Under construction... &#128679;
        </h1>
        <br />
        <p>
          Pomogrids is a pomodoro timer with a calendar heat map, hoping to
          boost focus and accountability.{" "}
        </p>
        <br />
        <Image
          src="/assets/pomogrids_homepage.png"
          alt="pomogrids"
          height="550"
          width="550"
        />
        <br />
        <p>Coming soon by the end of the month. Check us out then!</p>
      </div>
    </div>
  );
}
