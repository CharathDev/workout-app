"use client";
import AddExercise from "@/components/forms/exercise/AddExercise";
import { useGetAllExercises } from "@/controllers/exercises";
import ExerciseItem from "./ExerciseItem";
import { useState } from "react";
import { useGetMuscleGroups } from "@/controllers/musclegroups";

const ExercisesPage = () => {
  const exercises = useGetAllExercises();
  const muscleGroups = useGetMuscleGroups();

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

  return (
    <div className="bg-neutral-950 flex justify-center">
      <main className="container text-center">
        <h1 className="text-4xl font-bold mb-10">Exercises</h1>

        <AddExercise />

        <div className="bg-neutral-900 rounded-lg p-5 my-2 flex flex-col justify-center items-center shadow-lg mb-6">
          <div className="w-full flex justify-between mb-3">
            <div className="">
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
                className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-52 md:w-96 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
              />
            </div>
            <div className="">
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
                {muscleGroups.map((muscleGroup, i) => (
                  <option value={muscleGroup.id} key={i}>
                    {muscleGroup.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {exercises &&
              searchedExercises()!.map((exercise, i) => (
                <ExerciseItem exercise={exercise} key={i} />
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExercisesPage;
