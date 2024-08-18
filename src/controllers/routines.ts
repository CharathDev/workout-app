"use client";

import { firestore } from "@/firebase/firebase";
import Routine from "@/models/Routine";
import { Workout } from "@/models/Workout";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

interface tempRoutine {
  id: string;
  name: string;
}

export function getAllRoutines(userId: string): Routine[] | null {
  const [routines, setRoutines] = useState<Routine[] | null>(null);

  useEffect(() => {
    // Listener for the routines collection
    const routinesCollection = collection(firestore, "routines");
    const routinesQuery = query(
      routinesCollection,
      where("user", "==", userId)
    );
    const unsubscribeRoutines = onSnapshot(routinesQuery, (routinesSnap) => {
      const routinesData: Routine[] = [];
      console.log(userId);
      routinesSnap.forEach(async (routineDoc) => {
        const routineData = {
          id: routineDoc.id,
          ...routineDoc.data(),
        } as tempRoutine;

        // Query the workouts collection for workouts with the current routine ID
        const workoutsQuery = query(
          collection(firestore, "workouts"),
          where("routineId", "==", routineData.id)
        );
        const workoutIds: string[] = [];

        const unsubscribeWorkouts = onSnapshot(
          workoutsQuery,
          (workoutsSnap) => {
            const workoutsData: Workout[] = workoutsSnap.docs.map(
              (workoutDoc) => ({
                id: workoutDoc.id,
                ...workoutDoc.data(),
              })
            ) as Workout[];

            // Update the routine with its workout IDs
            const updatedRoutine: Routine = {
              ...routineData,
              workouts: workoutsData,
            };

            // Replace or add the updated routine in the routinesData array
            const routineIndex = routinesData.findIndex(
              (routine) => routine.id === updatedRoutine.id
            );
            if (routineIndex >= 0) {
              routinesData[routineIndex] = updatedRoutine;
            } else {
              routinesData.push(updatedRoutine);
            }

            setRoutines([...routinesData]); // Trigger re-render
          }
        );

        () => unsubscribeWorkouts();
      });
    });

    // Cleanup listener on component unmount
    return () => unsubscribeRoutines();
  }, [userId]);

  return routines;
}

export function getRoutineById(routineId: string): Routine | null {
  const [routine, setRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    // Listener for a specific routine document
    const routineDocRef = doc(firestore, "routines", routineId);
    const unsubscribeRoutine = onSnapshot(routineDocRef, async (routineDoc) => {
      if (routineDoc.exists()) {
        const routineData = {
          id: routineDoc.id,
          ...routineDoc.data(),
        } as tempRoutine;

        // Query the workouts collection for workouts with the current routine ID
        const workoutsQuery = query(
          collection(firestore, "workouts"),
          where("routineId", "==", routineData.id)
        );
        const workoutIds: string[] = [];

        const unsubscribeWorkouts = onSnapshot(
          workoutsQuery,
          (workoutsSnap) => {
            const workoutsData: Workout[] = workoutsSnap.docs.map(
              (workoutDoc) => ({
                id: workoutDoc.id,
                ...workoutDoc.data(),
              })
            ) as Workout[];

            // Update the routine with its workout IDs
            const populatedRoutine: Routine = {
              ...routineData,
              workouts: workoutsData,
            };

            setRoutine(populatedRoutine);
          }
        );

        return () => unsubscribeWorkouts();
      } else {
        setRoutine(null); // Handle case where the routine does not exist
      }
    });

    // Cleanup listener on component unmount
    return () => {
      unsubscribeRoutine();
    };
  }, [routineId]);

  return routine;
}
