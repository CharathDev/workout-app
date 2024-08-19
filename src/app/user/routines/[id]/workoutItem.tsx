"use client";
import { getWorkoutItemsById } from "@/controllers/workoutitems";
import { Workout } from "@/models/Workout";
import Link from "next/link";
import { useRouter } from "next/navigation";

const WorkoutItem = ({ workout }: { workout: Workout }) => {
  let workout_targets = getWorkoutItemsById(workout.id);

  const router = useRouter();

  return (
    <div className="bg-neutral-800 p-5 rounded-md flex justify-between my-4  w-full text-center">
      <div className="flex flex-col items-start justify-center">
        <h2 className="text-lg font-bold">{workout.name}</h2>

        {workout_targets &&
          workout_targets.map((workout_target) => (
            <h4 className="text-sm text-neutral-400">
              {`${
                workout_target.exerciseName
              } ${workout_target.set.toString()}x${workout_target.minReps.toString()}-${workout_target.maxReps.toString()}`}
            </h4>
          ))}
      </div>
      <div className="flex justify-center items-center">
        <button
          className="mx-1 px-4 py-2 font-bold bg-cyan-500 text-neutral-950 rounded-md hover:bg-cyan-600"
          // onClick={() => {
          //   router.push(`/user/workouts/${workout.id}`);
          // }}
        >
          Edit
        </button>
        <button
          className="mx-1 px-4 py-2 font-bold bg-rose-500 text-neutral-950 rounded-md hover:bg-rose-600"
          onClick={() => {
            router.push(`/user/workouts/${workout.id}`);
          }}
        >
          Log
        </button>
      </div>
    </div>
  );
};

export default WorkoutItem;
