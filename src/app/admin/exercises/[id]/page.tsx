"use client";

import EditExercise from "@/components/forms/EditExercise";
import { deleteExercise, getExerciseById } from "@/controllers/exercises";
import { getMuscleGroups } from "@/controllers/musclegroups";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { PuffLoader } from "react-spinners";

const ExerciseInfoPage = () => {
  const searchParams = usePathname();
  const exerciseId = searchParams.split("/")[3];
  const exercise = getExerciseById(exerciseId);
  const router = useRouter();

  const onDeleteHandler = (e: any) => {
    deleteExercise(exercise!.id, exercise!.gif_url);
    router.push("/admin/exercises");
  };

  return (
    <div className="bg-neutral-950">
      {exercise ? (
        <main className="md:cotainer mx-6 text-center">
          <h1 className="text-4xl font-bold mb-10">{exercise.name}</h1>

          <div className="bg-neutral-900 rounded-lg p-5 my-2 flex flex-col justify-center items-center shadow-lg mb-6">
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
                {exercise.muscle_groups.map((muscle_group) => (
                  <li>{muscle_group.name}</li>
                ))}
              </ul>
            </div>

            <div className="my-3 flex">
              <EditExercise />
              <button
                className="bg-rose-500 hover:bg-rose-600 text-neutral-900 rounded-md font-bold p-3 mx-2"
                onClick={onDeleteHandler}
              >
                Delete
              </button>
            </div>
          </div>
        </main>
      ) : (
        <>
          <PuffLoader />
        </>
      )}
    </div>
  );
};

export default ExerciseInfoPage;
