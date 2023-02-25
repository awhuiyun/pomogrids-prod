import { useEffect, useState } from "react";
import useTimerStore from "@/stores/timer";
import useSettingStore from "@/stores/settings";
import BaseButton from "./BaseButton";

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
    setTimerOnTrue,
    setTimerOnFalse,
    setPauseOnTrue,
    setPauseOnFalse,
    setSessionOnTrue,
    setSessionOnFalse,
    setCycleOnTrue,
    setCycleOnFalse,
    setTimerOptionInCycle,
    incrementPomodoroCountInCycle,
    setPomodoroCountInCycleToOne,
  } = useTimerStore();

  // Global states: useTaskStore

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
      setTimerOnFalse();
      setPauseOnFalse();
      setEndTime(0);
      setTimerSeconds(0);

      // POST information to backend: Update pomodoro table
      if (
        timerOption === "pomodoro" ||
        (timerOption === "cycle" && timerOptionInCycle === "pomodoro")
      ) {
        // Axios.post("http://localhost:5000/complete-pomodoro-session", {
        //   date: new Date(),
        //   task_id: taskSelectedForTimer,
        //   user_id: username,
        //   duration: pomodoroTimerMinutes,
        // }).then(() => console.log("Successfully send GET request to backend!"));
      }

      // Updates specific to timer type
      if (timerOption !== "cycle") {
        // Scenario 1: timerOption = pomodoro/shortBreak/longBreak
        setCycleOnFalse();
        setSessionOnFalse();
        // unselectAllTasksForTimer();

        if (timerOption === "pomodoro") {
          setTimerMinutes(pomodoroTimerMinutes);
          setRemainingDurationInMilliseconds(pomodoroTimerMinutes * 1000 * 60);
          //   addSessionCountToTaskAndCheckCompletion(taskSelectedForTimer);
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
          setCycleOnFalse();
          setSessionOnFalse();
          //   unselectAllTasksForTimer();

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
          //   addSessionCountToTaskAndCheckCompletion(taskSelectedForTimer);

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
          //   addSessionCountToTaskAndCheckCompletion(taskSelectedForTimer);

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
    // if (
    //   (timerOption === "pomodoro" || timerOption === "cycle") &&
    //   taskSelectedForTimer === ""
    // ) {
    //   alert("Pls select a task to work on!");
    //   return "";
    // }

    // Update isCycleOn = True when user starts a cycle
    if (timerOption === "cycle") {
      setCycleOnTrue();
    }

    // Update endTime
    const currentTimeStamp = new Date().getTime();
    setEndTime(currentTimeStamp + remainingDurationInMilliseconds);

    // Update isStarted=True so that timer runs
    setTimerOnTrue();
    setSessionOnTrue();
    setPauseOnFalse();
  }

  // Function that handles pause button
  function handlePauseClick() {
    // Update remainingDurationInMilliseconds
    const currentTimeStamp = new Date().getTime();
    setRemainingDurationInMilliseconds(endTime - currentTimeStamp);

    // Update isStarted=false so timer stops
    setTimerOnFalse();

    // Update isPauseOn=true
    setPauseOnTrue();
  }

  // Function that handles stop button
  function handleStopClick() {
    // Reset isStarted, endTime, remainingDurationInMilliseconds, timerHours, timerMinutes, timerSeconds
    setTimerOnFalse();
    setSessionOnFalse();
    setPauseOnFalse();
    setCycleOnFalse();
    setEndTime(0);
    setTimerSeconds(0);
    // unselectAllTasksForTimer();

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

      {/* Timer Display */}
      <div className="flex flex-row text-8xl font-bold mt-8 mb-8 mx-auto w-fit">
        <div className="w-52 text-end">
          {timerMinutes > 9 ? timerMinutes : "0" + timerMinutes}
        </div>
        <div className="w-10 text-center">:</div>
        <div className="w-52 text-start">
          {timerSeconds > 9 ? timerSeconds : "0" + timerSeconds}
        </div>
      </div>

      {/* Buttons: STOP, START, PAUSE */}
      <div className=" flex flex-row mt-2 mb-8 w-full place-content-center space-x-4">
        {/* STOP */}
        {isSessionOn === true && (
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
        {isSessionOn === false &&
          isCycleOn === false &&
          isTimerOn === false &&
          isPauseOn === false && (
            <div onClick={handleStartClick}>
              <BaseButton
                type="button"
                label="START"
                className="text-white bg-blue4 py-1 w-24"
              />
            </div>
          )}

        {/* Scenario 2: To resume a pause */}
        {isPauseOn === true && (
          <div onClick={handleStartClick}>
            <BaseButton
              type="button"
              label="START"
              className="text-white bg-blue4 py-1 w-24"
            />
          </div>
        )}
        {/* Scenario 3: Go to next session in cycle */}
        {isCycleOn === true && isTimerOn === false && isPauseOn === false && (
          <div onClick={handleStartClick}>
            <BaseButton
              type="button"
              label="START"
              className="text-white bg-blue4 py-1 w-24"
            />
          </div>
        )}

        {/* PAUSE */}
        {isTimerOn === true && isPauseOn === false && (
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
