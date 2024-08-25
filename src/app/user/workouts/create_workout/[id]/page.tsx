"use client";

import AddExerciseTarget from "@/components/forms/workout/AddExerciseTarget";
import AddWorkoutNamePage from "@/components/forms/workout/AddWorkoutName";
import { getAllExercises } from "@/controllers/exercises";
import { getMuscleGroups } from "@/controllers/musclegroups";
import { WorkoutTarget } from "@/models/WorkoutTarget";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

const CreateWorkoutPage = () => {
  const searchParams = usePathname();
  const routineId = searchParams.split("/")[4];
  const exercises = getAllExercises();
  const muscleGroups = getMuscleGroups();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [workoutNameIsOpen, setWorkoutNameIsOpen] = useState(false);
  const [workouts, setWorkouts] = useState<WorkoutTarget[]>([]);

  const handleAddExercise = (e: any) => {
    setIsOpen(true);
  };

  const handleCreateWorkout = (e: any) => {
    setWorkoutNameIsOpen(true);
  };

  const onChangeHandler = (e: any, index: Number) => {
    const updatedWorkouts: WorkoutTarget[] = workouts.map((workout, i) => {
      if (i == index) {
        return {
          ...workout,
          [e.target.name]:
            parseInt(e.target.value) <= 0 ? 1 : parseInt(e.target.value),
        } as WorkoutTarget;
      } else {
        return workout;
      }
    });
    setWorkouts(updatedWorkouts);
  };

  const removeWorkout = (e: any, index: number) => {
    const updatedWorkouts: WorkoutTarget[] = workouts.filter(
      (workout, i) => i != index
    );
    setWorkouts(updatedWorkouts);
  };

  return (
    <div className="bg-neutral-950 flex justify-center items-center">
      <main className="md:container mx-6 text-center">
        <div className="flex justify-between items-center mb-10">
          <button
            className="rounded-full bg-neutral-950 hover:bg-neutral-900 p-2"
            onClick={() => router.push(`/user/routines/${routineId}`)}
          >
            <IoIosArrowRoundBack size={32} />
          </button>
          <h1 className="text-4xl font-bold">Create Workout</h1>
          <div></div>
        </div>

        <div className="bg-neutral-900 p-3 rounded-md">
          {workouts.map((workoutTarget, i) => (
            <div className="bg-neutral-800 p-3 rounded-md mb-6 grid grid-cols-5">
              <div className="flex justify-center items-center">
                <h2 className="mx-2">{workoutTarget.exerciseId.name}</h2>
              </div>
              <div className="flex justify-center items-center">
                <h2 className="me-2">Sets: </h2>
                <input
                  type="number"
                  className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-14 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
                  name="set"
                  value={workoutTarget.set.toString()}
                  onChange={(e) => onChangeHandler(e, i)}
                />
              </div>
              <div className="flex justify-center items-center">
                <h2 className="me-2">Min Reps: </h2>
                <input
                  type="number"
                  className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-14 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
                  name="minReps"
                  value={workoutTarget.minReps.toString()}
                  onChange={(e) => onChangeHandler(e, i)}
                />
              </div>
              <div className="flex justify-center items-center">
                <h2 className="me-2">Max Reps: </h2>
                <input
                  type="number"
                  className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-14 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
                  name="maxReps"
                  value={workoutTarget.maxReps.toString()}
                  onChange={(e) => onChangeHandler(e, i)}
                />
              </div>
              <div className="">
                <button
                  className="px-4 p-2 bg-rose-500 hover:bg-rose-600 rounded-md text-neutral-950 font-bold"
                  onClick={(e) => removeWorkout(e, i)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-center items-center mb-3">
            <button
              className="px-4 p-2 bg-rose-500 hover:bg-rose-600 rounded-md text-neutral-950 font-bold"
              onClick={handleAddExercise}
            >
              Add Exercise
            </button>

            {isOpen && (
              <AddExerciseTarget
                exercises={exercises}
                setWorkouts={setWorkouts}
                workoutList={workouts}
                setIsOpen={setIsOpen}
                muscleGroups={muscleGroups}
              />
            )}
          </div>
        </div>
        <div className="flex justify-center items-center my-3">
          <button
            className="px-4 p-2 bg-rose-500 hover:bg-rose-600 rounded-md text-neutral-950 font-bold"
            onClick={handleCreateWorkout}
          >
            Create
          </button>

          {workoutNameIsOpen && (
            <AddWorkoutNamePage
              workouts={workouts}
              setWorkoutNameIsOpen={setWorkoutNameIsOpen}
              routineId={routineId}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateWorkoutPage;
