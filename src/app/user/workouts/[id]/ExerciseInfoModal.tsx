"use client";

import { useGetExerciseById } from "@/controllers/exercises";
import Exercise from "@/models/Exercise";
import Image from "next/image";
import { useState } from "react";

const ExerciseInfoModal = ({ exerciseId }: { exerciseId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const exercise = useGetExerciseById(exerciseId);

  return (
    <>
      <button
        className="px-4 py-2 bg-neutral-700 hover:ring-2 hover:ring-rose-500 rounded-md text-neutral-200"
        onClick={() => setIsOpen(true)}
      >
        Info
      </button>
      {isOpen && (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative rounded-lg shadow bg-neutral-800 border-4 border-neutral-700">
              <div className="flex items-center justify-center p-4 md:p-5 border-neutral-800">
                {exercise && (
                  <div className="flex flex-col justify-center items-center">
                    <div className="rounded-2xl">
                      <Image
                        src={exercise.gif_url}
                        alt={exercise.name}
                        width={400}
                        height={400}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="text-center my-3">
                      <h4 className="text-lg">Muscle Groups: </h4>
                      <ul>
                        {exercise.muscle_groups.map((muscle_group, i) => (
                          <li key={i}>{muscle_group.name}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className="px-4 py-2 rounded-md bg-rose-500 hover:bg-rose-600 font-bold text-neutral-900"
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExerciseInfoModal;
