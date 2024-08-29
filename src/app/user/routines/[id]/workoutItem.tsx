"use client";
import { useGetWorkoutItemsById } from "@/controllers/workoutitems";
import { firestore } from "@/firebase/firebase";
import { Workout } from "@/models/Workout";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const WorkoutItem = ({ workout }: { workout: Workout }) => {
  let workout_targets = useGetWorkoutItemsById(workout.id);

  const router = useRouter();

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        await setDoc(doc(firestore, "workouts", workout.id), {
          name: workout.name,
          routineId: workout.routineId,
          isActivated: false,
        });
      }
    });
  };

  return (
    <div className="bg-neutral-800 p-5 rounded-md flex md:flex-row flex-col justify-between my-4 w-full text-center">
      <div className="flex flex-col items-center md:items-start justify-center md:mb-0 mb-3">
        <h2 className="text-lg font-bold">{workout.name}</h2>

        {workout_targets &&
          workout_targets.map((workout_target, i) => (
            <h4 className="text-sm text-neutral-400" key={i}>
              {`${
                workout_target.exerciseName
              } ${workout_target.set.toString()}x${workout_target.minReps.toString()}-${workout_target.maxReps.toString()}`}
            </h4>
          ))}
      </div>
      <div className="flex justify-center items-center">
        <button
          className="mx-1 px-4 py-2 font-bold bg-rose-500 text-neutral-950 rounded-md hover:bg-rose-600"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="mx-1 px-4 py-2 font-bold bg-cyan-500 text-neutral-950 rounded-md hover:bg-cyan-600"
          onClick={() => {
            router.push(`/user/workouts/${workout.id}`);
          }}
        >
          Log
        </button>
      </div>
    </div>
  );
};

export default WorkoutItem;
