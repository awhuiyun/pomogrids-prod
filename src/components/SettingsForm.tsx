import { useState } from "react";
import Link from "next/link";
import useUserStore from "@/stores/user";
import useSettingStore from "@/stores/settings";
import useTimerStore from "@/stores/timer";
import BaseButton from "./BaseButton";
import { updateSettingsService } from "@/services/settings";

export default function SettingsForm() {
  // Global states: useUserStore
  const { user, tier } = useUserStore();

  // Global states: useSettingStore
  const {
    pomodoroTimerMinutes,
    shortBreakTimerMinutes,
    longBreakTimerMinutes,
    numberOfPomodoroSessionsInCycle,
    alarmRingtone,
    alarmVolume,
    weekStart,
    timerOption,
    toggleIsSettingOpen,
    setPomodoroTimerMinutes,
    setShortBreakTimerMinutes,
    setLongBreakTimerMinutes,
    setNumberOfPomodoroSessionsInCycle,
    setAlarmRingtone,
    setAlarmVolume,
    setWeekStart,
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
  const [weekStartInput, setWeekStartInput] = useState(weekStart);

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
    } else if (e.target.id === "weekStartInput") {
      setWeekStartInput(e.target.value);
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
        alarmVolumeInput,
        weekStartInput
      );

      // Save settings in useSettingsStore:
      setPomodoroTimerMinutes(pomodoroTimerInput);
      setShortBreakTimerMinutes(shortBreakTimerInput);
      setLongBreakTimerMinutes(longBreakTimerInput);
      setNumberOfPomodoroSessionsInCycle(numberOfPomodoroSessionsInCycleInput);
      setAlarmRingtone(alarmRingtoneInput);
      setAlarmVolume(alarmVolumeInput);
      // Howler.volume(alarmVolumeInput);
      setWeekStart(weekStartInput);

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
      className="backdrop-blur-sm inset-0 bg-slate-700/20 fixed fade-in z-50"
      onClick={toggleSettingsFormOpenFalse}
    >
      <form
        className="flex flex-col border border-slate-900 shadow-custom shadow-slate-900 rounded sticky top-20 mx-auto bg-white w-[500px] text-slate-900 p-6 space-y-8"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmitClick}
      >
        {/* Form Title */}
        <div>
          <p className="font-bold text-2xl text-center">Settings</p>

          {/* Not signed in */}
          {!user && (
            <p className="text-sm text-center mt-2">
              Please{" "}
              <span className="text-blue4 hover:underline cursor-pointer">
                sign in
              </span>
              . This is a premium feature.
            </p>
          )}

          {/* Basic users */}
          {tier === "basic" && (
            <p className="text-sm text-center mt-2">
              To customize, sign up for{" "}
              <span className="text-blue4 hover:underline cursor-pointer">
                premium.
              </span>
            </p>
          )}
        </div>

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
                className={`focus:outline-0 w-20 border rounded border-slate-900 px-2 py-1 h-[34px] ${
                  (tier === "basic" || !user) &&
                  " text-slate-400 cursor-not-allowed"
                }`}
                onChange={handleInputChange}
                required={true}
                disabled={tier === "basic" || !user ? true : false}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">Short Break:</label>
              <input
                type="number"
                id="shortBreakTimerInput"
                value={shortBreakTimerInput}
                className={`focus:outline-0 w-20 border rounded border-slate-900 px-2 py-1 h-[34px] ${
                  (tier === "basic" || !user) &&
                  " text-slate-400 cursor-not-allowed"
                }`}
                onChange={handleInputChange}
                required={true}
                disabled={tier === "basic" || !user ? true : false}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">Long Break:</label>
              <input
                type="number"
                id="longBreakTimerInput"
                value={longBreakTimerInput}
                className={`focus:outline-0 w-20 border rounded border-slate-900 px-2 py-1 h-[34px] ${
                  (tier === "basic" || !user) &&
                  " text-slate-400 cursor-not-allowed"
                }`}
                onChange={handleInputChange}
                required={true}
                disabled={tier === "basic" || !user ? true : false}
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
            className={`focus:outline-0 w-20 border rounded border-slate-900 px-2 py-1 h-[34px] ${
              (tier === "basic" || !user) &&
              " text-slate-400 cursor-not-allowed"
            }`}
            onChange={handleInputChange}
            required={true}
            disabled={tier === "basic" || !user ? true : false}
          />
        </section>

        {/* Alarm Ringtone Section */}
        <section>
          <p className="font-bold text-lg mb-2">Alarm</p>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1">Sound</label>
              <select
                id="alarmRingtoneInput"
                value={alarmRingtoneInput}
                onChange={handleInputChange}
                className={`focus:outline-0 w-32 border rounded border-slate-900 px-2 py-1 h-[34px] ${
                  (tier === "basic" || !user) &&
                  " text-slate-400 cursor-not-allowed"
                }`}
                required={true}
                disabled={tier === "basic" || !user ? true : false}
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
                className={`focus:outline-0 w-32 border rounded border-slate-900 px-2 py-1 h-[34px] ${
                  (tier === "basic" || !user) &&
                  " text-slate-400 cursor-not-allowed"
                }`}
                onChange={handleInputChange}
                required={true}
                disabled={tier === "basic" || !user ? true : false}
              />
            </div>
          </div>
        </section>

        {/* Grid Section */}
        <section>
          <p className="font-bold text-lg mb-2">Grid</p>
          <div className="flex flex-col">
            <label className="text-sm mb-1">Start of week:</label>
            <select
              id="weekStartInput"
              value={weekStartInput}
              onChange={handleInputChange}
              className={`focus:outline-0 w-32 border rounded border-slate-900 px-2 py-1 h-[34px] ${
                (tier === "basic" || !user) &&
                " text-slate-400 cursor-not-allowed"
              }`}
              required={true}
              disabled={tier === "basic" || !user ? true : false}
            >
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
        </section>

        {/* Button */}
        {!user && (
          <Link
            href="/signin"
            className="mx-auto"
            onClick={toggleSettingsFormOpenFalse}
          >
            <BaseButton
              type="button"
              label="Sign in"
              className="text-white bg-blue4 px-4 py-2 w-fit text-sm"
            />{" "}
          </Link>
        )}
        {user && tier === "basic" && (
          <div onClick={toggleSettingsFormOpenFalse} className="mx-auto">
            <BaseButton
              type="button"
              label="Upgrade to premium"
              className="text-white bg-blue4 px-4 py-2 w-fit text-sm"
            />
          </div>
        )}
        {user && tier === "premium" && (
          <BaseButton
            type="submit"
            label="Save settings"
            className="text-white bg-blue4 px-4 py-2 w-fit mx-auto text-sm"
          />
        )}
      </form>
    </div>
  );
}
