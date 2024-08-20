import { firestore } from "@/firebase/firebase";
import { WorkoutTarget } from "@/models/WorkoutTarget";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export const getWorkoutItemsById = (id: string): WorkoutTarget[] | null => {
  const [workoutTargets, setWorkoutTargets] = useState<WorkoutTarget[] | null>(
    null
  );

  useEffect(() => {
    // Query the workoutTargets collection for targets with the specific workout ID
    const workoutTargetsQuery = query(
      collection(firestore, "workout_items"),
      where("workoutId", "==", id)
    );

    // Listener for the workoutTargets collection based on the workout ID query
    const unsubscribe = onSnapshot(
      workoutTargetsQuery,
      (workoutTargetsSnap) => {
        const workoutTargetsData: WorkoutTarget[] = workoutTargetsSnap.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as WorkoutTarget[];

        setWorkoutTargets(workoutTargetsData);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      unsubscribe();
    };
  }, [id]);

  if (workoutTargets)
    workoutTargets.sort(
      (a, b) => parseInt(a.order.toString()) - parseInt(b.order.toString())
    );

  return workoutTargets;
};
