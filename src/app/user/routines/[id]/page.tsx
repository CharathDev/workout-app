"use client";

import { getRoutineById } from "@/controllers/routines";
import { getWorkoutItemsById } from "@/controllers/workoutitems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WorkoutItem from "./workoutItem";

const RoutineInfoPage = () => {
  const searchParams = usePathname();
  const routineId = searchParams.split("/")[3];
  const routineInfo = getRoutineById(routineId);

  return (
    <div className="bg-neutral-950">
      {routineInfo ? (
        <main className="md:cotainer mx-6 text-center">
          <h1 className="text-4xl font-bold mb-10">{routineInfo.name}</h1>

          {routineInfo.workouts.length == 0 ? (
            <h3 className="mb-10">You have no workouts in this routine</h3>
          ) : (
            <div className="bg-neutral-900 rounded-lg p-5 my-2 flex flex-col justify-center items-center shadow-lg mb-6">
              {routineInfo.workouts.map((workout) => (
                <WorkoutItem workout={workout} />
              ))}
            </div>
          )}

          <div className="flex justify-center items-center ">
            <Link href={`/user/workouts/create_workout/${routineId}`}>
              <div className="px-4 p-2 bg-rose-500 hover:bg-rose-600 rounded-md cursor-pointer">
                +
              </div>
            </Link>
          </div>
        </main>
      ) : (
        <div>loading</div>
      )}
    </div>
  );
};

export default RoutineInfoPage;
