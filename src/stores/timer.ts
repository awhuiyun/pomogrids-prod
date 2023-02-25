import create from "zustand";

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
  timerMinutes: 25, // Minutes shown in Timer
  timerSeconds: 0, // Seconds shown in Timer
  remainingDurationInMilliseconds: 1500000,
  isTimerOn: false,
  isPauseOn: false,
  isSessionOn: false,
  isCycleOn: false,
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
