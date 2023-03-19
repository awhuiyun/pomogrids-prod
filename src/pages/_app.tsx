import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
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
import useToastStore from "@/stores/toast";
import { getSettingsService } from "@/services/settings";
import {
  getUnarchivedTasksService,
  getTasksInYearService,
} from "@/services/tasks";
import { getUserTier, createNewAccount } from "@/services/users";

export default function App({ Component, pageProps }: AppProps) {
  // Router
  let router = useRouter();

  // Global states
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
  const { addToast } = useToastStore();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      try {
        // User logged in
        if (user) {
          // Route to landing page
          router.push("/setup");

          // Set useUserStore
          setUser(user);
          setEmail(user.email ?? "");
          setUserId(user.uid);

          // POST request: Create new account if user is new
          const newUser = await createNewAccount(user);
          // console.log(newUser);

          // POST request: Retrieve user's tier
          const tier = await getUserTier(user);
          // console.log(tier);

          if (tier) {
            setTier(tier.tier);
          }

          // POST request: Retrieve user's tasks for the year
          const tasksInTheYear = await getTasksInYearService(user, {
            year: Number(new Date().getFullYear()),
          });
          // console.log(tasksInTheYear);

          if (tasksInTheYear) {
            // Manipulate result: Change date to local time
            let edited_tasksInTheYear = [];

            for (let i = 0; i < tasksInTheYear.length; i++) {
              const task = tasksInTheYear[i];

              const edited = {
                dateOfSession: new Date(task.dateOfSession)
                  .toLocaleString()
                  .split(",")[0],
                completedNumOfMinutes: task.completedNumOfMinutes,
                taskName: task.taskName,
                category_name: task.category_name,
                category_colour: task.category_colour,
              };

              edited_tasksInTheYear.push(edited);
            }

            // Set state
            setTasksInTheYear(edited_tasksInTheYear);
          }

          // POST request: Retrieve user's settings
          const settings = await getSettingsService(user);
          // console.log(settings);

          if (settings) {
            setPomodoroTimerMinutes(settings.pomodoro_minutes);
            setShortBreakTimerMinutes(settings.short_break_minutes);
            setLongBreakTimerMinutes(settings.long_break_minutes);
            setNumberOfPomodoroSessionsInCycle(
              settings.number_of_sessions_in_a_cycle
            );
            setAlarmRingtone(settings.alarm_ringtone);
            setAlarmVolume(settings.alarm_volume);
            setWeekStart(settings.week_start);
            setTimerMinutes(settings.pomodoro_minutes);
            setRemainingDurationInMilliseconds(
              settings.pomodoro_minutes * 1000 * 60
            );
            Howler.volume(settings.alarm_volume);
          }

          // POST request: Retrieve user's unarchived tasks
          const unarchivedTasks = await getUnarchivedTasksService(user);
          // console.log(unarchivedTasks);

          if (unarchivedTasks) {
            clearAllTasks();
            setTaskArray(unarchivedTasks);
          }

          // Reroute back to home
          router.push("/");

          // Add toast notification
          addToast({
            uniqueId: uuidv4(),
            className: "bg-green-50 text-green-700",
            content: "🎉 Successfully logged in!",
          });
        } // User logged out
        else {
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
      } catch (error) {
        // console.log(error);

        // Reroute back to home
        router.push("/");

        // Add toast notification
        addToast({
          uniqueId: uuidv4(),
          className: "bg-red-50 text-red-700",
          content: "Something went wrong. Please try again! 😫",
        });
      }
    });
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
