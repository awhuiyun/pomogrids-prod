import { useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { auth } from "@/auth/functions";
import { onAuthStateChanged } from "firebase/auth";
import Layout from "@/components/Layout";
import useUserStore from "@/stores/user";
import useTaskStore from "@/stores/tasks";
import useSettingStore from "@/stores/settings";
import useTimerStore from "@/stores/timer";
import useGridStore from "@/stores/grid";
import { getSettingsService } from "@/services/settings";
import {
  getUnarchivedTasksService,
  getTasksInYearService,
} from "@/services/tasks";
import { ITaskItem } from "@/types/interfaces";

export default function App({ Component, pageProps }: AppProps) {
  const { setUser, setEmail, setUserId, user } = useUserStore();
  const {
    setPomodoroTimerMinutes,
    setShortBreakTimerMinutes,
    setLongBreakTimerMinutes,
    setNumberOfPomodoroSessionsInCycle,
    setAlarmRingtone,
    setAlarmVolume,
  } = useSettingStore();
  const { setTimerMinutes, setRemainingDurationInMilliseconds } =
    useTimerStore();
  const { clearAllTasks, setTaskArray } = useTaskStore();
  const { setTasksInTheYear } = useGridStore();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set useUserStore
        setUser(user);
        setEmail(user.email ?? "");
        setUserId(user.uid);

        // POST request: Retrieve user's tasks for the year
        getTasksInYearService(user, 2023)
          .then((res) => {
            setTasksInTheYear(res);
            // console.log(res);
          })
          .catch((error) => console.log(error));

        // POST request: Retrieve user's settings
        getSettingsService(user)
          .then((res) => {
            setPomodoroTimerMinutes(res.pomodoro_minutes);
            setShortBreakTimerMinutes(res.short_break_minutes);
            setLongBreakTimerMinutes(res.long_break_minutes);
            setNumberOfPomodoroSessionsInCycle(
              res.number_of_sessions_in_a_cycle
            );
            setAlarmRingtone(res.alarm_ringtone);
            setAlarmVolume(res.alarm_volume);
            setTimerMinutes(res.pomodoro_minutes);
            setRemainingDurationInMilliseconds(
              res.pomodoro_minutes * 1000 * 60
            );
          })
          .catch((error) => console.log(error));

        // POST request: Retrieve user's unarchived tasks
        clearAllTasks();
        getUnarchivedTasksService<ITaskItem>(user)
          .then((res) => {
            console.log(res);
            if (res) {
              setTaskArray(res);
            }
          })
          .catch((error) => console.log(error));
      } else {
        // Set all states to default
        setUser(null);
        setEmail("");
        setUserId("");

        setPomodoroTimerMinutes(25);
        setShortBreakTimerMinutes(5);
        setLongBreakTimerMinutes(15);
        setNumberOfPomodoroSessionsInCycle(4);
        setAlarmRingtone("default");
        setAlarmVolume(0.5);
        setTimerMinutes(25);
        setRemainingDurationInMilliseconds(25 * 1000 * 60);

        clearAllTasks();
      }
    });
  }, []);

  console.log(user);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
