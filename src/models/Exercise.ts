import MuscleGroup from "./MuscleGroup";

export default interface Exercise {
  id: string;
  name: string;
  muscle_groups: MuscleGroup[];
  gif_url: string;
}
