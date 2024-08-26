"use client";

import { useGetRoutineById } from "@/controllers/routines";
import { useGetWorkoutItemsById } from "@/controllers/workoutitems";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import WorkoutItem from "./workoutItem";
import { IoIosArrowRoundBack } from "react-icons/io";

const RoutineInfoPage = () => {
  const searchParams = usePathname();
  const routineId = searchParams.split("/")[3];
  const routineInfo = useGetRoutineById(routineId);
  const router = useRouter();

  return (
    <div className="bg-neutral-950">
      {routineInfo ? (
        <main className="md:cotainer mx-6 text-center">
          <div className="flex justify-between items-center mb-10">
            <button
              className="rounded-full bg-neutral-950 hover:bg-neutral-900 p-2"
              onClick={() => router.push(`/user/routines`)}
            >
              <IoIosArrowRoundBack size={32} />
            </button>
            <h1 className="text-4xl font-bold">{routineInfo.name}</h1>
            <div></div>
          </div>

          {routineInfo.workouts.length == 0 ? (
            <h3 className="mb-10">You have no workouts in this routine</h3>
          ) : (
            <div className="bg-neutral-900 rounded-lg p-5 my-2 flex flex-col justify-center items-center shadow-lg mb-6">
              {routineInfo.workouts.map((workout, i) => (
                <WorkoutItem key={i} workout={workout} />
              ))}
            </div>
          )}

          <div className="flex justify-center items-center ">
            <Link href={`/user/workouts/create_workout/${routineId}`}>
              <div className="px-4 p-2 bg-rose-500 hover:bg-rose-600 rounded-md cursor-pointer text-neutral-950 font-bold">
                + Add Workout
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
