import Image from "next/image";
import Link from "next/link";

export default function IntroModal({
  toggleIntroModalFalse,
}: {
  toggleIntroModalFalse: () => void;
}) {
  return (
    <div className="backdrop-blur-sm inset-0 bg-slate-700/20 fixed fade-in z-50">
      <div className="flex flex-col border border-slate-900 shadow-custom shadow-slate-900 rounded sticky top-14 mx-auto bg-white w-[600px] text-slate-900 py-12 px-12">
        <h1 className="text-2xl text-center font-bold">
          Pomogrids is a pomodoro timer
          <br /> with a calendar heatmap
        </h1>

        <br />

        <Image
          src="/assets/grid_example.png"
          alt="pomogrids"
          height="550"
          width="550"
        />

        <br />

        <p className="text-lg">
          <span className="font-bold">How to: </span> Simply create tasks and
          get started on pomodoro cycles. Your calendar clocks the number of
          hours worked each day. The yellow cell represents the current day.
        </p>

        <br />

        <button
          type="button"
          className="text-white bg-blue4 py-2 rounded"
          onClick={toggleIntroModalFalse}
        >
          Got it
        </button>

        <br />

        <Link href="/how-to">
          <p className="text-center text-blue4 cursor-pointer hover:underline underline-offset-2">
            See full instructions -&gt;
          </p>
        </Link>
      </div>
    </div>
  );
}
