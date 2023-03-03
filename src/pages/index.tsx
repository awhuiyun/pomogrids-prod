import { useEffect, useRef } from "react";
import Head from "next/head";
import useUserStore from "@/stores/user";
import useTaskStore from "@/stores/tasks";
import useSettingStore from "@/stores/settings";
import useTimerStore from "@/stores/timer";
import TimerContainer from "@/components/TimerContainer";
import TaskContainer from "@/components/TaskContainer";
import SettingsForm from "@/components/SettingsForm";
import TaskForm from "@/components/TaskForm";
import TaskEditMenu from "@/components/TaskEditMenu";
import { getSettingsService } from "@/services/settings";
import { getUnarchivedTasksService } from "@/services/tasks";
import { ITaskItem } from "@/types/interfaces";
// import { isUserSignedIn, auth } from "@/auth/functions";

import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  // useRef to ensure useEffect only runs once
  const apiCalledRef = useRef(false);

  // Global states: useUserStore
  const { user_id, email, setUserId, setEmail } = useUserStore();

  // Global states: useTaskStore
  const { taskFormType, taskEditMenuId, addTask, clearAllTasks } =
    useTaskStore();

  // Global states: useSettingsStore
  const { isSettingOpen } = useSettingStore();
  const {
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

  // async function checkUserStatusAndRetrieveData() {
  //   try {
  //     // Check if user is signed in
  //     const user = await isUserSignedIn();

  //     // If user is not signed in
  //     if (!user) {
  //       return;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // UseEffect to fetch settings and unarchived tasks on mount
  useEffect(() => {
    // Ensure that useEffect is only called once on mount
    if (apiCalledRef.current) return;
    apiCalledRef.current = true;

    // Check if user is signed in

    // console.log(isUserSignedIn());
    // If no user is signed in, break out of useEffect
    // if (user === "No user is signed in!") {
    //   return;
    // }

    console.log("Running");
    //

    // POST request: Retrieve user's settings
    getSettingsService(user_id)
      .then((res) => {
        setPomodoroTimerMinutes(res.pomodoro_minutes);
        setShortBreakTimerMinutes(res.short_break_minutes);
        setLongBreakTimerMinutes(res.long_break_minutes);
        setNumberOfPomodoroSessionsInCycle(res.number_of_sessions_in_a_cycle);
        setAlarmRingtone(res.alarm_ringtone);
        setAlarmVolume(res.alarm_volume);
        setTimerMinutes(res.pomodoro_minutes);
        setRemainingDurationInMilliseconds(res.pomodoro_minutes * 1000 * 60);
      })
      .catch((error) => console.log(error));

    // POST request: Retrieve user's unarchived tasks
    clearAllTasks();
    getUnarchivedTasksService<ITaskItem>(user_id)
      .then((res) => {
        console.log(res);
        if (res !== undefined) {
          res.forEach((task) => {
            return addTask(task);
          });
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="pt-2 text-slate-900 w-[1280px] mx-auto">
      <Head>
        <title>Pomogrids</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Settings Form */}
      {isSettingOpen && <SettingsForm />}

      {/* Task Form */}
      {taskFormType && <TaskForm />}

      {/* Task Edit Menu */}
      {taskEditMenuId && <TaskEditMenu />}

      {/* Timer and Tasks section */}
      <div className="flex space-x-4">
        <TimerContainer />
        <TaskContainer />
      </div>
    </div>
  );
}
