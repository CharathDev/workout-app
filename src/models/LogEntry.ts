export default interface LogEntry {
  id: string;
  logId: string;
  workoutId: string;
  exerciseId: string;
  set: Number;
  weight: Number;
  reps: Number;
  isWeighted: boolean;
}
