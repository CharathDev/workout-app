import Exercise from "@/models/Exercise";
import MuscleGroup from "@/models/MuscleGroup";
import { WorkoutTarget } from "@/models/WorkoutTarget";
import { Dispatch, SetStateAction, useState } from "react";

const AddExerciseTarget = ({
  exercises,
  setWorkouts,
  workoutList,
  setIsOpen,
  muscleGroups,
}: {
  exercises: Exercise[] | null;
  setWorkouts: Dispatch<SetStateAction<WorkoutTarget[]>>;
  workoutList: WorkoutTarget[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  muscleGroups: MuscleGroup[];
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const searchedExercises = () => {
    if (filter != "" && search == "") {
      return exercises?.filter((exercise) => {
        return (
          exercise.muscle_groups.find(
            (muscle_group) => muscle_group.id == filter
          ) != null
        );
      });
    } else if (filter == "" && search != "") {
      return exercises?.filter((exercise) => {
        return exercise.name.toLowerCase().includes(search);
      });
    } else if (filter != "" && search != "") {
      return exercises?.filter((exercise) => {
        return (
          exercise.name.toLowerCase().includes(search) &&
          exercise.muscle_groups.find(
            (muscle_group) => muscle_group.id == filter
          ) != null
        );
      });
    }

    return exercises;
  };

  const onSubmitHandler = (e: any) => {
    e.preventDefault();
  };

  const handleAddExercise = (id: Exercise) => {
    setWorkouts([
      ...workoutList,
      {
        id: "",
        workoutId: "",
        exerciseId: id,
        exerciseName: id.name,
        set: 1,
        minReps: 1,
        maxReps: 1,
        order: 0,
      } as WorkoutTarget,
    ]);
    setIsOpen(false);
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
                Add Exercise
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-neutral-600 hover:text-white"
                data-modal-hide="static-modal"
                onClick={() => setIsOpen(false)}
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
              <div className="mb-6 grid grid-cols-12 gap-1">
                <div className="col-span-9">
                  <label
                    htmlFor="name"
                    className="font-medium block mb-2 text-gray-300 text-start"
                  >
                    Search By Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    required
                    className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
                  />
                </div>
                <div className="col-span-3">
                  <label
                    htmlFor="name"
                    className="font-medium block mb-2 text-gray-300 text-start"
                  >
                    Filter
                  </label>
                  <select
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter}
                    className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
                  >
                    <option value={""}>All</option>
                    {muscleGroups.map((muscleGroup) => (
                      <option value={muscleGroup.id}>{muscleGroup.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="overflow-y-auto h-32">
                {searchedExercises()?.map((exercise, i) => (
                  <div
                    key={i}
                    className="bg-neutral-600 hover:bg-neutral-500 text-center p-2 my-1 rounded-md cursor-pointer hover:ring-2 hover:ring-rose-500 mx-1"
                    onClick={() => handleAddExercise(exercise)}
                  >
                    {exercise.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-neutral-600">
              <button
                data-modal-hide="static-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium focus:outline-none  rounded-lg border focus:z-10 focus:ring-gray-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
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

export default AddExerciseTarget;
