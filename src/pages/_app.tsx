import { useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
const { Howler } = require("howler");
import { auth } from "@/firebase/auth";
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
import { getUserTier } from "@/services/users";

export default function App({ Component, pageProps }: AppProps) {
  const { setUser, setEmail, setUserId, setTier } = useUserStore();
  const {
    setPomodoroTimerMinutes,
    setShortBreakTimerMinutes,
    setLongBreakTimerMinutes,
    setNumberOfPomodoroSessionsInCycle,
    setAlarmRingtone,
    setAlarmVolume,
    setWeekStart,
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

        // POST request: Retrieve user's tier
        getUserTier(user)
          .then((res) => {
            if (res) {
              setTier(res.tier);
            }
          })
          .catch((error) => console.log(error));

        // POST request: Retrieve user's tasks for the year
        getTasksInYearService(user, {
          year: Number(new Date().getFullYear()),
        })
          .then((res) => {
            if (res) {
              // Manipulate result: Change date to local time
              let edited_res = [];
              for (let i = 0; i < res.length; i++) {
                const task = res[i];
                const edited = {
                  dateOfSession: new Date(task.dateOfSession)
                    .toLocaleString()
                    .split(",")[0],
                  completedNumOfMinutes: task.completedNumOfMinutes,
                  taskName: task.taskName,
                  category_name: task.category_name,
                  category_colour: task.category_colour,
                };

                edited_res.push(edited);
              }

              // Set state
              setTasksInTheYear(edited_res);
            }
          })
          .catch((error) => console.log(error));

        // POST request: Retrieve user's settings
        getSettingsService(user)
          .then((res) => {
            if (res) {
              // defensive
              setPomodoroTimerMinutes(res.pomodoro_minutes);
              setShortBreakTimerMinutes(res.short_break_minutes);
              setLongBreakTimerMinutes(res.long_break_minutes);
              setNumberOfPomodoroSessionsInCycle(
                res.number_of_sessions_in_a_cycle
              );
              setAlarmRingtone(res.alarm_ringtone);
              setAlarmVolume(res.alarm_volume);
              setWeekStart(res.week_start);
              setTimerMinutes(res.pomodoro_minutes);
              setRemainingDurationInMilliseconds(
                res.pomodoro_minutes * 1000 * 60
              );
              Howler.volume(res.alarm_volume);
            }
          })
          .catch((error) => console.log(error));

        // POST request: Retrieve user's unarchived tasks
        clearAllTasks();
        getUnarchivedTasksService(user)
          .then((res) => {
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
        setTier("");

        setTasksInTheYear([]);

        setPomodoroTimerMinutes(25);
        setShortBreakTimerMinutes(5);
        setLongBreakTimerMinutes(15);
        setNumberOfPomodoroSessionsInCycle(4);
        setAlarmRingtone("buzzer");
        setAlarmVolume(0.5);
        setTimerMinutes(25);
        setRemainingDurationInMilliseconds(25 * 1000 * 60);

        clearAllTasks();
      }
    });
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
