import { Workout } from "./Workout";

export default interface Routine {
  id: string;
  name: string;
  workouts: Workout[];
}
