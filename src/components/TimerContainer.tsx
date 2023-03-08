import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import useSettingStore from "@/stores/settings";
import Timer from "./Timer";

export default function TimerContainer() {
  // Global states: useSettingStore
  const { toggleIsSettingOpen, isSettingOpen } = useSettingStore();

  // Function to handle click to open settings modal
  function toggleSettingsFormOpenTrue() {
    toggleIsSettingOpen(true);
  }

  return (
    <div className="border border-slate-900 shadow-custom rounded p-4 h-fit w-full">
      {/* Title and Settings Icon */}
      <div className="flex flex-row text-slate-400">
        <p className="flex-grow text-xs">Timer:</p>
        <FontAwesomeIcon
          icon={faGear}
          className="h-4 cursor-pointer"
          onClick={toggleSettingsFormOpenTrue}
        />
      </div>

      {/* Timer */}
      <Timer />
    </div>
  );
}
