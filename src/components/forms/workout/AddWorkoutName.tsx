import { firestore } from "@/firebase/firebase";
import { WorkoutTarget } from "@/models/WorkoutTarget";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

const AddWorkoutNamePage = ({
  workouts,
  setWorkoutNameIsOpen,
  routineId,
}: {
  workouts: WorkoutTarget[];
  setWorkoutNameIsOpen: Dispatch<SetStateAction<boolean>>;
  routineId: string;
}) => {
  const [name, setName] = useState("");
  const router = useRouter();

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    const workoutRef = await addDoc(collection(firestore, "workouts"), {
      routineId: routineId,
      name: name,
    });
    const workoutId = workoutRef.id;
    workouts.forEach(async (workoutItem) => {
      await addDoc(collection(firestore, "workout_items"), {
        workoutId: workoutId,
        exerciseId: workoutItem.exerciseId.id,
        exerciseName: workoutItem.exerciseId.name,
        set: workoutItem.set,
        minReps: workoutItem.minReps,
        maxReps: workoutItem.maxReps,
      });
    });
    router.push("../../");
  };

  return (
    <div
      id="static-modal"
      data-modal-backdrop="static"
      aria-hidden="true"
      className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative rounded-lg shadow bg-neutral-700">
          <form onSubmit={onSubmitHandler}>
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-neutral-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create Workout
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-neutral-600 hover:text-white"
                data-modal-hide="static-modal"
                onClick={() => setWorkoutNameIsOpen(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="font-medium block mb-2 text-gray-300 text-start"
                >
                  Workout Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
                />
              </div>
            </div>
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-neutral-600">
              <button
                className="px-4 p-2 bg-rose-500 hover:bg-rose-600 rounded-md text-white"
                //   onClick={handleAddExercise}
              >
                Create Workout
              </button>
              <button
                data-modal-hide="static-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium focus:outline-none  rounded-lg border focus:z-10 focus:ring-gray-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
                onClick={() => setWorkoutNameIsOpen(false)}
              >
                Decline
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWorkoutNamePage;
