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
        className="flex flex-col rounded-md sticky top-28 mx-auto bg-white w-[500px] text-slate-90 p-4 space-y-6"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmitClick}
      >
        {/* Form Title */}
        <p className="font-bold text-xl text-center">Settings</p>

        {/* Timer Section */}
        <section>
          <p className="font-bold">Timer (minutes)</p>
          <div className="flex flex-col">
            <label>
              Pomodoro
              <input
                type="number"
                id="pomodoroTimerInput"
                value={pomodoroTimerInput}
                className="mx-2 focus:outline-0 w-fit"
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Short Break
              <input
                type="number"
                id="shortBreakTimerInput"
                value={shortBreakTimerInput}
                className="mx-2 focus:outline-0 w-fit"
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Long Break
              <input
                type="number"
                id="longBreakTimerInput"
                value={longBreakTimerInput}
                className="mx-2 focus:outline-0 w-fit"
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
        </section>

        {/* Cycle Section */}
        <section>
          <p className="font-bold">Cycle</p>
          <label>
            Number of pomodoro sessions before a long break
            <input
              type="number"
              id="numberOfPomodoroSessionsInCycleInput"
              value={numberOfPomodoroSessionsInCycleInput}
              className="mx-2 focus:outline-0 w-fit"
              onChange={handleInputChange}
              required
            />
          </label>
        </section>

        {/* Alarm Ringtone Section */}
        <section>
          <p className="font-bold">Alarm Ringtone</p>
          <div className="flex flex-col">
            <label>
              Sound
              <select
                id="alarmRingtoneInput"
                value={alarmRingtoneInput}
                onChange={handleInputChange}
              >
                <option value="buzzer">Buzzer</option>
                <option value="calm">Calm</option>
              </select>
            </label>
            <label>
              Volume (0-1)
              <input
                type="number"
                id="alarmVolumeInput"
                value={alarmVolumeInput}
                min="0"
                max="1"
                step="0.1"
                className="mx-2 focus:outline-0 w-fit"
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
        </section>

        {/* Button */}
        <BaseButton
          type="submit"
          label="Update"
          className="text-white bg-blue4 px-4 py-1 w-fit mx-auto"
        />
      </form>
    </div>
  );
}
