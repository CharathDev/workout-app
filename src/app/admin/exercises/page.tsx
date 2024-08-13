"use client";
import AddExercise from "@/components/forms/AddExercise";
import { getAllExercises } from "@/controllers/exercises";
import Image from "next/image";
import ExerciseItem from "./ExerciseItem";

const ExercisesPage = () => {
  const exercises = getAllExercises();
  return (
    <div className="bg-neutral-950">
      <main className="md:container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-10">Exercises</h1>

        <div className="bg-neutral-900 rounded-lg p-5 my-2 flex flex-col justify-center items-center shadow-lg mb-6">
          <AddExercise />
        </div>

        <div className="bg-neutral-900 rounded-lg p-5 my-2 flex flex-col justify-center items-center shadow-lg mb-6">
          <div className="grid grid-cols-4 gap-4">
            {exercises.map((exercise, i) => (
              <ExerciseItem exercise={exercise} key={i} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExercisesPage;
