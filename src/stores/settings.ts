import { create } from "zustand";

interface IUseSettingStore {
  pomodoroTimerMinutes: number;
  shortBreakTimerMinutes: number;
  longBreakTimerMinutes: number;
  timerOption: string;
  numberOfPomodoroSessionsInCycle: number;
  alarmRingtone: string;
  alarmVolume: number;
  isSettingOpen: boolean;
  setPomodoroTimerMinutes: (minutes: number) => void;
  setShortBreakTimerMinutes: (minutes: number) => void;
  setLongBreakTimerMinutes: (minutes: number) => void;
  setTimerOption: (option: string) => void;
  setNumberOfPomodoroSessionsInCycle: (num: number) => void;
  setAlarmRingtone: (selection: string) => void;
  setAlarmVolume: (num: number) => void;
  setSettingOpenTrue: () => void;
  setSettingOpenFalse: () => void;
}

const useSettingStore = create<IUseSettingStore>((set) => ({
  pomodoroTimerMinutes: 25,
  shortBreakTimerMinutes: 5,
  longBreakTimerMinutes: 15,
  timerOption: "pomodoro", // pomodoro or cycle
  numberOfPomodoroSessionsInCycle: 4,
  alarmRingtone: "buzzer",
  alarmVolume: 0.5,
  isSettingOpen: false,
  setPomodoroTimerMinutes: (minutes: number) =>
    set(() => ({
      pomodoroTimerMinutes: minutes,
    })),
  setShortBreakTimerMinutes: (minutes: number) =>
    set(() => ({
      shortBreakTimerMinutes: minutes,
    })),
  setLongBreakTimerMinutes: (minutes: number) =>
    set(() => ({
      longBreakTimerMinutes: minutes,
    })),
  setTimerOption: (option: string) =>
    set(() => ({
      timerOption: option,
    })),
  setNumberOfPomodoroSessionsInCycle: (num: number) =>
    set(() => ({
      numberOfPomodoroSessionsInCycle: num,
    })),
  setAlarmRingtone: (selection: string) =>
    set(() => ({
      alarmRingtone: selection,
    })),
  setAlarmVolume: (num: number) =>
    set(() => ({
      alarmVolume: num,
    })),
  setSettingOpenTrue: () =>
    set(() => ({
      isSettingOpen: true,
    })),
  setSettingOpenFalse: () =>
    set(() => ({
      isSettingOpen: false,
    })),
}));

export default useSettingStore;
