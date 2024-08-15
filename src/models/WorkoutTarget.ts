import Exercise from "./Exercise";

export interface WorkoutTarget {
  id: string;
  workoutId: string;
  exerciseId: Exercise;
  set: Number;
  minReps: Number;
  maxReps: Number;
}
