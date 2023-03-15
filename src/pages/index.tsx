import Head from "next/head";
import useTaskStore from "@/stores/tasks";
import useSettingStore from "@/stores/settings";
import TimerContainer from "@/components/TimerContainer";
import TaskContainer from "@/components/TaskContainer";
import SettingsForm from "@/components/SettingsForm";
import TaskForm from "@/components/TaskForm";
import TaskEditMenu from "@/components/TaskEditMenu";
import Grid from "@/components/Grid";
import UnderConstruction from "@/components/UnderConstruction";

export default function Home() {
  // Global states: useTaskStore
  const { taskFormType, taskEditMenuId } = useTaskStore();

  // Global states: useSettingsStore
  const { isSettingOpen } = useSettingStore();

  return (
    <div>
      <Head>
        <title>Pomogrids</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/************ Modals *************/}
      {/* Under Construction */}
      {/* <UnderConstruction /> */}

      {/* Settings Form */}
      {isSettingOpen && <SettingsForm />}

      {/* Task Form */}
      {taskFormType && <TaskForm />}

      {/* Task Edit Menu */}
      {taskEditMenuId && <TaskEditMenu />}

      {/************ Non-Modals *************/}
      {/* Grid section */}
      <Grid />

      {/* Timer and Tasks section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
        <TimerContainer />
        <TaskContainer />
      </div>
    </div>
  );
}
