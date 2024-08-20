import LogEntry from "./LogEntry";

export default interface Log {
  id: string;
  userId: string;
  workoutId: string;
  date: Date;
  logEntries?: LogEntry[];
  workoutName?: string;
}
