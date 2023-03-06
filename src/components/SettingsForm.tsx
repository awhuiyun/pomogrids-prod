import { useState } from "react";
import useUserStore from "@/stores/user";
import useSettingStore from "@/stores/settings";
import useTimerStore from "@/stores/timer";
import BaseButton from "./BaseButton";
import { updateSettingsService } from "@/services/settings";

export default function SettingsForm() {
  // Global states: useUserStore
  const { user } = useUserStore();

  // Global states: useSettingStore
  const {
    pomodoroTimerMinutes,
    shortBreakTimerMinutes,
    longBreakTimerMinutes,
    numberOfPomodoroSessionsInCycle,
    alarmRingtone,
    alarmVolume,
    timerOption,
    toggleIsSettingOpen,
    setPomodoroTimerMinutes,
    setShortBreakTimerMinutes,
    setLongBreakTimerMinutes,
    setNumberOfPomodoroSessionsInCycle,
    setAlarmRingtone,
    setAlarmVolume,
  } = useSettingStore();

  // Global states: useTimerStore
  const { setTimerMinutes, setRemainingDurationInMilliseconds } =
    useTimerStore();

  // Local States
  const [pomodoroTimerInput, setPomodoroTimerInput] =
    useState(pomodoroTimerMinutes);
  const [shortBreakTimerInput, setShortBreakTimerInput] = useState(
    shortBreakTimerMinutes
  );
  const [longBreakTimerInput, setLongBreakTimerInput] = useState(
    longBreakTimerMinutes
  );
  const [
    numberOfPomodoroSessionsInCycleInput,
    setNumberOfPomodoroSessionsInCycleInput,
  ] = useState(numberOfPomodoroSessionsInCycle);
  const [alarmRingtoneInput, setAlarmRingtoneInput] = useState(alarmRingtone);
  const [alarmVolumeInput, setAlarmVolumeInput] = useState(alarmVolume);

  // Function to toggle isSettingsFormOpen=False
  function toggleSettingsFormOpenFalse() {
    // Close modal & reset states
    toggleIsSettingOpen(false);
  }

  //  Function to handle input changes
  function handleInputChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    if (e.target.id === "pomodoroTimerInput") {
      setPomodoroTimerInput(parseInt(e.target.value));
    } else if (e.target.id === "shortBreakTimerInput") {
      setShortBreakTimerInput(parseInt(e.target.value));
    } else if (e.target.id === "longBreakTimerInput") {
      setLongBreakTimerInput(parseInt(e.target.value));
    } else if (e.target.id === "numberOfPomodoroSessionsInCycleInput") {
      setNumberOfPomodoroSessionsInCycleInput(parseInt(e.target.value));
    } else if (e.target.id === "alarmRingtoneInput") {
      setAlarmRingtoneInput(e.target.value);
    } else if (e.target.id === "alarmVolumeInput") {
      setAlarmVolumeInput(parseFloat(e.target.value));
    }
  }

  // Function to handle form submit
  async function handleSubmitClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      // PATCH request: Update user settings
      await updateSettingsService(
        user,
        pomodoroTimerInput,
        shortBreakTimerInput,
        longBreakTimerInput,
        numberOfPomodoroSessionsInCycleInput,
        alarmRingtoneInput,
        alarmVolumeInput
      );

      // Save settings in useSettingsStore:
      setPomodoroTimerMinutes(pomodoroTimerInput);
      setShortBreakTimerMinutes(shortBreakTimerInput);
      setLongBreakTimerMinutes(longBreakTimerInput);
      setNumberOfPomodoroSessionsInCycle(numberOfPomodoroSessionsInCycleInput);
      setAlarmRingtone(alarmRingtoneInput);
      setAlarmVolume(alarmVolumeInput);
      // Howler.volume(alarmVolumeInput);

      // Save settings for timer display (dependent on timerOption)
      if (timerOption === "pomodoro") {
        setTimerMinutes(pomodoroTimerInput);
        setRemainingDurationInMilliseconds(pomodoroTimerInput * 1000 * 60);
      } else if (timerOption === "shortBreak") {
        setTimerMinutes(shortBreakTimerInput);
        setRemainingDurationInMilliseconds(shortBreakTimerInput * 1000 * 60);
      } else if (timerOption === "longBreak") {
        setTimerMinutes(longBreakTimerInput);
        setRemainingDurationInMilliseconds(longBreakTimerInput * 1000 * 60);
      } else if (timerOption === "cycle") {
        setTimerMinutes(pomodoroTimerInput);
        setRemainingDurationInMilliseconds(pomodoroTimerInput * 1000 * 60);
      }
    } catch (error) {
      console.log(error);
    }

    // Close Settings Form modal
    toggleIsSettingOpen(false);
  }

  return (
    <div
      className="backdrop-blur-sm inset-0 bg-slate-700/20 absolute fade-in z-50"
      onClick={toggleSettingsFormOpenFalse}
    >
      <form
        className="flex flex-col border border-slate-900 shadow-custom shadow-slate-900 rounded sticky top-28 mx-auto bg-white w-[500px] text-slate-900 p-6 space-y-8"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmitClick}
      >
        {/* Form Title */}
        <p className="font-bold text-2xl text-center">Settings</p>

        {/* Timer Section */}
        <section>
          <p className="font-bold text-lg mb-2">Timer</p>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1">Pomodoro:</label>
              <input
                type="number"
                id="pomodoroTimerInput"
                value={pomodoroTimerInput}
                className="focus:outline-0 w-20 border rounded border-slate-900 px-2 py-1 h-[34px]"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">Short Break:</label>
              <input
                type="number"
                id="shortBreakTimerInput"
                value={shortBreakTimerInput}
                className="focus:outline-0 w-20 border rounded border-slate-900 px-2 py-1 h-[34px]"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">Long Break:</label>
              <input
                type="number"
                id="longBreakTimerInput"
                value={longBreakTimerInput}
                className="focus:outline-0 w-20 border rounded border-slate-900 px-2 py-1 h-[34px]"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </section>

        {/* Cycle Section */}
        <section className="space-y-2">
          <p className="font-bold text-lg">Cycle</p>
          <p className="text-sm">
            Number of pomodoro sessions before a long break
          </p>
          <input
            type="number"
            id="numberOfPomodoroSessionsInCycleInput"
            value={numberOfPomodoroSessionsInCycleInput}
            className="focus:outline-0 w-20 border rounded border-slate-900 px-2 py-1 h-[34px]"
            onChange={handleInputChange}
            required
          />
        </section>

        {/* Alarm Ringtone Section */}
        <section>
          <p className="font-bold text-lg mb-2">Alarm Ringtone</p>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1">Sound</label>
              <select
                id="alarmRingtoneInput"
                value={alarmRingtoneInput}
                onChange={handleInputChange}
                className="focus:outline-0 w-32 border rounded border-slate-900 px-2 py-1 h-[34px]"
              >
                <option value="buzzer">Buzzer</option>
                <option value="calm">Calm</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">Volume (0-1)</label>
              <input
                type="number"
                id="alarmVolumeInput"
                value={alarmVolumeInput}
                min="0"
                max="1"
                step="0.1"
                className="focus:outline-0 w-32 border rounded border-slate-900 px-2 py-1 h-[34px]"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </section>

        {/* Button */}
        <BaseButton
          type="submit"
          label="Save settings"
          className="text-white bg-blue4 px-4 py-2 w-fit mx-auto text-sm"
        />
      </form>
    </div>
  );
}
