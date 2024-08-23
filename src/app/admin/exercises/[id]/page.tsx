"use client";

import EditExercise from "@/components/forms/exercise/EditExercise";
import { deleteExercise, getExerciseById } from "@/controllers/exercises";
import { getMuscleGroups } from "@/controllers/musclegroups";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
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
          <div className="flex justify-between items-center mb-10">
            <button
              className="rounded-full bg-neutral-950 hover:bg-neutral-900 p-2"
              onClick={() => router.push(`/admin/exercises`)}
            >
              <IoIosArrowRoundBack size={32} />
            </button>
            <h1 className="text-4xl font-bold">Create Workout</h1>
            <div></div>
          </div>

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

            <div className="text-center my-3">
              <h4 className="text-lg">
                Exercise Type:{" "}
                {exercise.isWeighted ? "Weighted" : "Calisthenics"}
              </h4>
            </div>

            <div className="my-3 flex">
              <EditExercise exerciseInfo={exercise} />
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
