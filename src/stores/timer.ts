import { create } from "zustand";

interface IUseTimerStore {
  timerMinutes: number;
  timerSeconds: number;
  remainingDurationInMilliseconds: number;
  isTimerOn: boolean;
  isPauseOn: boolean;
  isSessionOn: boolean;
  isCycleOn: boolean;
  timerOptionInCycle: string;
  pomodoroCountInCycle: number;
  setTimerMinutes: (minutes: number) => void;
  setTimerSeconds: (seconds: number) => void;
  setRemainingDurationInMilliseconds: (num: number) => void;
  setTimerOnTrue: () => void;
  setTimerOnFalse: () => void;
  setPauseOnTrue: () => void;
  setPauseOnFalse: () => void;
  setSessionOnTrue: () => void;
  setSessionOnFalse: () => void;
  setCycleOnTrue: () => void;
  setCycleOnFalse: () => void;
  setTimerOptionInCycle: (option: string) => void;
  incrementPomodoroCountInCycle: () => void;
  setPomodoroCountInCycleToOne: () => void;
}

const useTimerStore = create<IUseTimerStore>((set) => ({
  timerMinutes: 25, // minutes display
  timerSeconds: 0, // seconds display
  remainingDurationInMilliseconds: 1500000,
  isTimerOn: false, // true if timer minutes and seconds are ticking ()
  isPauseOn: false, // true if timer is on pause
  isSessionOn: false, // true if session is on (pomodoro, shortBreak, longBreak or cycle). Objective: turn of clickables during sessions; Can't use timer cause it might be on pause
  isCycleOn: false, // true if cycle is on
  timerOptionInCycle: "pomodoro",
  pomodoroCountInCycle: 1,
  setTimerMinutes: (minutes: number) =>
    set(() => ({
      timerMinutes: minutes,
    })),
  setTimerSeconds: (seconds: number) =>
    set(() => ({
      timerSeconds: seconds,
    })),
  setRemainingDurationInMilliseconds: (num: number) =>
    set(() => ({
      remainingDurationInMilliseconds: num,
    })),
  setTimerOnTrue: () =>
    set(() => ({
      isTimerOn: true,
    })),
  setTimerOnFalse: () =>
    set(() => ({
      isTimerOn: false,
    })),
  setPauseOnTrue: () =>
    set(() => ({
      isPauseOn: true,
    })),
  setPauseOnFalse: () =>
    set(() => ({
      isPauseOn: false,
    })),
  setSessionOnTrue: () =>
    set(() => ({
      isSessionOn: true,
    })),
  setSessionOnFalse: () =>
    set(() => ({
      isSessionOn: false,
    })),
  setCycleOnTrue: () =>
    set(() => ({
      isCycleOn: true,
    })),
  setCycleOnFalse: () =>
    set(() => ({
      isCycleOn: false,
    })),
  setTimerOptionInCycle: (option: string) =>
    set(() => ({
      timerOptionInCycle: option,
    })),
  incrementPomodoroCountInCycle: () =>
    set((state) => ({
      pomodoroCountInCycle: state.pomodoroCountInCycle + 1,
    })),
  setPomodoroCountInCycleToOne: () =>
    set(() => ({
      pomodoroCountInCycle: 1,
    })),
}));

export default useTimerStore;
