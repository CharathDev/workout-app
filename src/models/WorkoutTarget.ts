import Exercise from "./Exercise";

export interface WorkoutTarget {
  id: string;
  workoutId: string;
  exerciseId: Exercise;
  exerciseName: string;
  set: Number;
  minReps: Number;
  maxReps: Number;
  order: Number;
  isWeighted: boolean;
}
