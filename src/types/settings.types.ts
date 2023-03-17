export interface UpdateSettingsPayload {
  pomodoro_minutes: number;
  short_break_minutes: number;
  long_break_minutes: number;
  number_of_sessions_in_a_cycle: number;
  alarm_ringtone: string;
  alarm_volume: number;
  week_start: string;
}
