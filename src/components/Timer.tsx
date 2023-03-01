import { useEffect, useState } from "react";
import useTimerStore from "@/stores/timer";
import useSettingStore from "@/stores/settings";
import useTaskStore from "@/stores/tasks";
import BaseButton from "./BaseButton";

import { updateTaskAfterSessionService } from "@/services/tasks";

export default function Timer() {
  // Global states: useSettingStore
  const {
    timerOption,
    pomodoroTimerMinutes,
    shortBreakTimerMinutes,
    longBreakTimerMinutes,
    numberOfPomodoroSessionsInCycle,
    alarmRingtone: ringtone,
    setTimerOption,
  } = useSettingStore();

  // Global states: useTimerStore
  const {
    timerMinutes,
    timerSeconds,
    remainingDurationInMilliseconds,
    isSessionOn,
    isTimerOn,
    isPauseOn,
    isCycleOn,
    timerOptionInCycle,
    pomodoroCountInCycle,
    setTimerMinutes,
    setTimerSeconds,
    setRemainingDurationInMilliseconds,
    toggleTimerOn,
    togglePauseOn,
    toggleSessionOn,
    toggleCycleOn,
    setTimerOptionInCycle,
    incrementPomodoroCountInCycle,
    setPomodoroCountInCycleToOne,
  } = useTimerStore();

  // Global states: useTaskStore
  const {
    unselectAllTasksForTimer,
    taskSelectedForTimer,
    addSessionCountToTaskAndCheckCompletion,
  } = useTaskStore();

  // Local states
  const [endTime, setEndTime] = useState(0);

  // Function that runs the timer
  function updateTimer(interval?: NodeJS.Timer) {
    // Calculate timer duration
    const duration = endTime - new Date().getTime();

    // Executes if isStarted=True and timer has not reached 0
    if (isTimerOn && duration > 0) {
      setTimerMinutes(Math.floor(duration / 1000 / 60));
      setTimerSeconds(Math.floor((duration / 1000) % 60));
    } // Timer reaches 0
    else if (isTimerOn && duration < 0) {
      // Play sound
      //   if (ringtone === "buzzer") {
      //     buzzerSound.play();
      //   } else if (ringtone === "calm") {
      //     calmSound.play();
      //   }
      alert("Timer is up!");

      // Run regardless of timerOption
      clearInterval(interval);
      toggleTimerOn(false);
      togglePauseOn(false);
      setEndTime(0);
      setTimerSeconds(0);

      // PATCH request: Update task_sessions table
      if (
        timerOption === "pomodoro" ||
        (timerOption === "cycle" && timerOptionInCycle === "pomodoro")
      ) {
        updateTaskAfterSessionService(
          taskSelectedForTimer,
          1,
          pomodoroTimerMinutes
        );
      }

      // Updates specific to timer type
      if (timerOption !== "cycle") {
        // Scenario 1: timerOption = pomodoro/shortBreak/longBreak
        toggleCycleOn(false);
        toggleSessionOn(false);
        unselectAllTasksForTimer();

        if (timerOption === "pomodoro") {
          setTimerMinutes(pomodoroTimerMinutes);
          setRemainingDurationInMilliseconds(pomodoroTimerMinutes * 1000 * 60);
          addSessionCountToTaskAndCheckCompletion(taskSelectedForTimer);
        } else if (timerOption === "shortBreak") {
          setTimerMinutes(shortBreakTimerMinutes);
          setRemainingDurationInMilliseconds(
            shortBreakTimerMinutes * 1000 * 60
          );
        } else if (timerOption === "longBreak") {
          setTimerMinutes(longBreakTimerMinutes);
          setRemainingDurationInMilliseconds(longBreakTimerMinutes * 1000 * 60);
        }
      } // Scenario 2: timerOption = cycle
      else {
        if (timerOptionInCycle === "longBreak") {
          // Reset variables
          toggleCycleOn(false);
          toggleSessionOn(false);
          unselectAllTasksForTimer();

          // Reset display timer
          setTimerMinutes(pomodoroTimerMinutes);
          setRemainingDurationInMilliseconds(pomodoroTimerMinutes * 1000 * 60);

          // Reset cycle variables
          setTimerOptionInCycle("pomodoro");
          setPomodoroCountInCycleToOne();
        } else if (timerOptionInCycle === "shortBreak") {
          // Update display timer
          setTimerMinutes(pomodoroTimerMinutes);
          setRemainingDurationInMilliseconds(pomodoroTimerMinutes * 1000 * 60);

          // Update cycle variables
          setTimerOptionInCycle("pomodoro");
          incrementPomodoroCountInCycle();
        } else if (
          timerOptionInCycle === "pomodoro" &&
          pomodoroCountInCycle < numberOfPomodoroSessionsInCycle
        ) {
          // Add increment to completed count
          addSessionCountToTaskAndCheckCompletion(taskSelectedForTimer);

          // Update display timer
          setTimerMinutes(shortBreakTimerMinutes);
          setRemainingDurationInMilliseconds(
            shortBreakTimerMinutes * 1000 * 60
          );

          // Update cycle variables
          setTimerOptionInCycle("shortBreak");
        } else if (
          timerOptionInCycle === "pomodoro" &&
          pomodoroCountInCycle === numberOfPomodoroSessionsInCycle
        ) {
          // Add increment to completed count
          addSessionCountToTaskAndCheckCompletion(taskSelectedForTimer);

          // Update display timer
          setTimerMinutes(longBreakTimerMinutes);
          setRemainingDurationInMilliseconds(longBreakTimerMinutes * 1000 * 60);

          // Update cycle variables
          setTimerOptionInCycle("longBreak");
        }
      }
    }
  }

  // Functions that toggles the timer options
  function handleToggleToPomodoroTimerClick() {
    setTimerOption("pomodoro");
    setTimerMinutes(pomodoroTimerMinutes);
    setRemainingDurationInMilliseconds(pomodoroTimerMinutes * 1000 * 60);
  }

  function handleToggleToShortBreakTimerClick() {
    setTimerOption("shortBreak");
    setTimerMinutes(shortBreakTimerMinutes);
    setRemainingDurationInMilliseconds(shortBreakTimerMinutes * 1000 * 60);
  }

  function handleToggleToLongBreakTimerClick() {
    setTimerOption("longBreak");
    setTimerMinutes(longBreakTimerMinutes);
    setRemainingDurationInMilliseconds(longBreakTimerMinutes * 1000 * 60);
  }

  function handleToggleToCycleTimerClick() {
    // Toggle timer option to "cycle"
    setTimerOption("cycle");

    // Reset timer display to pomodoro
    setTimerMinutes(pomodoroTimerMinutes);
    setRemainingDurationInMilliseconds(pomodoroTimerMinutes * 1000 * 60);

    // Reset Cycle
    setTimerOptionInCycle("pomodoro");
    setPomodoroCountInCycleToOne();
  }

  // Function that handles start button
  function handleStartClick() {
    // Check that user has selected a task if starting "pomodoro" or "cycle"
    if (
      (timerOption === "pomodoro" || timerOption === "cycle") &&
      taskSelectedForTimer === ""
    ) {
      alert("Pls select a task to work on!");
      return "";
    }

    // Update isCycleOn = True when user starts a cycle
    if (timerOption === "cycle") {
      toggleCycleOn(true);
    }

    // Update endTime
    const currentTimeStamp = new Date().getTime();
    setEndTime(currentTimeStamp + remainingDurationInMilliseconds);

    // Update isStarted=True so that timer runs
    toggleTimerOn(true);
    toggleSessionOn(true);
    togglePauseOn(false);
  }

  // Function that handles pause button
  function handlePauseClick() {
    // Update remainingDurationInMilliseconds
    const currentTimeStamp = new Date().getTime();
    setRemainingDurationInMilliseconds(endTime - currentTimeStamp);

    // Update isStarted=false so timer stops
    toggleTimerOn(false);

    // Update isPauseOn=true
    togglePauseOn(true);
  }

  // Function that handles stop button
  function handleStopClick() {
    // Reset isStarted, endTime, remainingDurationInMilliseconds, timerHours, timerMinutes, timerSeconds
    toggleTimerOn(false);
    toggleSessionOn(false);
    togglePauseOn(false);
    toggleCycleOn(false);
    setEndTime(0);
    setTimerSeconds(0);
    unselectAllTasksForTimer();

    if (timerOption === "pomodoro") {
      setTimerMinutes(pomodoroTimerMinutes);
      setRemainingDurationInMilliseconds(pomodoroTimerMinutes * 1000 * 60);
    } else if (timerOption === "shortBreak") {
      setTimerMinutes(shortBreakTimerMinutes);
      setRemainingDurationInMilliseconds(shortBreakTimerMinutes * 1000 * 60);
    } else if (timerOption === "longBreak") {
      setTimerMinutes(longBreakTimerMinutes);
      setRemainingDurationInMilliseconds(longBreakTimerMinutes * 1000 * 60);
    } else if (timerOption === "cycle") {
      setTimerMinutes(pomodoroTimerMinutes);
      setRemainingDurationInMilliseconds(pomodoroTimerMinutes * 1000 * 60);

      // Reset pomodoro cycle
      setTimerOptionInCycle("pomodoro");
      setPomodoroCountInCycleToOne();
    }
  }

  // useEffect hook
  useEffect(() => {
    updateTimer();
    const interval = setInterval(() => {
      updateTimer(interval);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isTimerOn, endTime, timerMinutes, timerSeconds]);

  return (
    <div>
      {/* Timer Option Headers: Pomodoro, Short Break, Long Break, Cycle */}
      <div className="flex space-x-4 mt-6 w-full place-content-center">
        {(!isSessionOn || (isSessionOn && timerOption === "pomodoro")) && (
          <div
            className={`w-[115px] px-2 py-1 rounded  text-center ${
              !isSessionOn && "cursor-pointer"
            } ${timerOption === "pomodoro" && "font-bold bg-blue1"}`}
            onClick={isSessionOn ? undefined : handleToggleToPomodoroTimerClick}
          >
            Pomodoro
          </div>
        )}

        {(!isSessionOn || (isSessionOn && timerOption === "shortBreak")) && (
          <div
            className={`w-[115px] px-2 py-1 rounded text-center ${
              !isSessionOn && "cursor-pointer"
            } ${timerOption === "shortBreak" && "font-bold bg-blue1"}`}
            onClick={
              isSessionOn ? undefined : handleToggleToShortBreakTimerClick
            }
          >
            Short Break
          </div>
        )}
        {(!isSessionOn || (isSessionOn && timerOption === "longBreak")) && (
          <div
            className={`w-[115px] px-2 py-1 rounded text-center ${
              !isSessionOn && "cursor-pointer"
            } ${timerOption === "longBreak" && "font-bold bg-blue1"}`}
            onClick={
              isSessionOn ? undefined : handleToggleToLongBreakTimerClick
            }
          >
            Long Break
          </div>
        )}
        {!isSessionOn && (
          <div
            className={`w-[115px] px-2 py-1 rounded text-center cursor-pointer ${
              timerOption === "cycle" && "font-bold bg-blue1"
            }`}
            onClick={isSessionOn ? undefined : handleToggleToCycleTimerClick}
          >
            Cycle
          </div>
        )}
        {isSessionOn && timerOption === "cycle" && (
          <div className="w-[200px] px-2 py-1 rounded text-center font-bold bg-blue1">
            {timerOptionInCycle === "pomodoro" &&
              `Cycle: Pomodoro #${pomodoroCountInCycle}`}
            {timerOptionInCycle === "shortBreak" &&
              `Cycle: Short Break #${pomodoroCountInCycle}`}
            {timerOptionInCycle === "longBreak" && `Cycle: Long Break`}
          </div>
        )}
      </div>

      {/* Timer Display */}
      <div className="flex flex-row text-8xl font-bold mt-8 mb-10 mx-auto w-fit">
        <div className="w-52 text-end">
          {timerMinutes > 9 ? timerMinutes : "0" + timerMinutes}
        </div>
        <div className="w-10 text-center">:</div>
        <div className="w-52 text-start">
          {timerSeconds > 9 ? timerSeconds : "0" + timerSeconds}
        </div>
      </div>

      {/* Buttons: STOP, START, PAUSE */}
      <div className=" flex flex-row mt-2 mb-5 w-full place-content-center space-x-4">
        {/* STOP */}
        {isSessionOn && (
          <div onClick={handleStopClick}>
            <BaseButton
              type="button"
              label="STOP"
              className="text-red-400 bg-red-50 border border-red-300 py-1 w-24"
            />
          </div>
        )}

        {/* START */}
        {/* Scenario 1: To start session */}
        {!isSessionOn && !isCycleOn && !isTimerOn && !isPauseOn && (
          <div onClick={handleStartClick}>
            <BaseButton
              type="button"
              label="START"
              className="text-white bg-blue4 py-1 w-24"
            />
          </div>
        )}

        {/* Scenario 2: To resume a pause */}
        {isPauseOn && (
          <div onClick={handleStartClick}>
            <BaseButton
              type="button"
              label="START"
              className="text-white bg-blue4 py-1 w-24"
            />
          </div>
        )}
        {/* Scenario 3: Go to next session in cycle */}
        {isCycleOn && !isTimerOn && !isPauseOn && (
          <div onClick={handleStartClick}>
            <BaseButton
              type="button"
              label="START"
              className="text-white bg-blue4 py-1 w-24"
            />
          </div>
        )}

        {/* PAUSE */}
        {isTimerOn && !isPauseOn && (
          <div onClick={handlePauseClick}>
            <BaseButton
              type="button"
              label="PAUSE"
              className="text-blue4 border-blue4 border py-1 w-24"
            />
          </div>
        )}
      </div>
    </div>
  );
}
