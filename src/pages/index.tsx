import Head from "next/head";
import useTaskStore from "@/stores/tasks";
import useSettingStore from "@/stores/settings";
import useToastStore from "@/stores/toast";
import useGridStore from "@/stores/grid";
import TimerContainer from "@/components/timer/TimerContainer";
import TaskContainer from "@/components/tasks/TaskContainer";
import SettingsForm from "@/components/modals/SettingsForm";
import TaskForm from "@/components/modals/TaskForm";
import TaskEditMenu from "@/components/tasks/TaskEditMenu";
import Grid from "@/components/grid/Grid";
import IntroModal from "@/components/modals/IntroModal";
import { useEffect, useState } from "react";
import useUserStore from "@/stores/user";
import useTimerStore from "@/stores/timer";
import {
  getTasksInYearService,
  getUnarchivedTasksService,
} from "@/services/tasks";
import { getSettingsService } from "@/services/settings";
const { Howler } = require("howler");
import { v4 as uuidv4 } from "uuid";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  // Global states
  const { taskFormType, isTaskEditMenuOpen, clearAllTasks, setTaskArray } =
    useTaskStore();
  const { setTasksInTheYear } = useGridStore();
  const {
    isSettingOpen,
    setPomodoroTimerMinutes,
    setShortBreakTimerMinutes,
    setLongBreakTimerMinutes,
    setNumberOfPomodoroSessionsInCycle,
    setAlarmRingtone,
    setAlarmVolume,
    setWeekStart,
  } = useSettingStore();
  const { user } = useUserStore();
  const { setTimerMinutes, setRemainingDurationInMilliseconds } =
    useTimerStore();
  const { addToast } = useToastStore();

  // Local states
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect to fetch Grid, Settings and Unarchived tasks data
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setIsLoading(true);

          // POST request: Retrieve user's tasks for the year
          const tasksInTheYear = await getTasksInYearService(user, {
            year: Number(new Date().getFullYear()),
          });

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

          if (unarchivedTasks) {
            clearAllTasks();
            setTaskArray(unarchivedTasks);
          }

          // Open IntroModal
          if (unarchivedTasks?.length === 0 && tasksInTheYear?.length === 0) {
            setIsIntroModalOpen(true);
          }

          setIsLoading(false);
        } catch (error) {
          // Add toast notification
          addToast({
            uniqueId: uuidv4(),
            className: "bg-red-50 text-red-700",
            content: "Something went wrong. Please try again! 😫",
          });
        }
      } else {
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

        setIsIntroModalOpen(true);
      }
    };

    fetchData();
  }, [user]);

  function toggleIntroModalFalse() {
    setIsIntroModalOpen(false);
  }

  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <Head>
        <title>Pomogrids</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Pop ups */}
      {isIntroModalOpen && (
        <IntroModal toggleIntroModalFalse={toggleIntroModalFalse} />
      )}
      {isSettingOpen && <SettingsForm />}
      {taskFormType && <TaskForm />}
      {isTaskEditMenuOpen && <TaskEditMenu />}

      {/* Main Page */}
      <Grid />
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
        <TimerContainer />
        <TaskContainer />
      </div>
    </div>
  );
}
