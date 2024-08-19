"use client";

import { firestore } from "@/firebase/firebase";
import { Workout } from "@/models/Workout";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const getWorkoutById = (id: string): Workout | null => {
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    // Reference to the specific workout document
    const workoutDocRef = doc(firestore, "workouts", id);

    // Listener for the workout document
    const unsubscribe = onSnapshot(workoutDocRef, (workoutDoc) => {
      if (workoutDoc.exists()) {
        setWorkout({ id: workoutDoc.id, ...workoutDoc.data() } as Workout);
      } else {
        setWorkout(null); // Handle case where the workout does not exist
      }
    });

    // Cleanup listener on component unmount
    return () => {
      unsubscribe();
    };
  }, [id]);

  return workout;
};
