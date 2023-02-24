import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Timer from "./Timer";

export default function TimerContainer() {
  return (
    <div className="border border-slate-900 shadow-custom shadow-slate-900 rounded h-64 w-[600px] p-4">
      <div className="flex flex-row text-slate-400">
        <p className="flex-grow text-xs">Timer:</p>
        <FontAwesomeIcon icon={faGear} className="h-4 cursor-pointer" />
      </div>
    </div>
  );
}
