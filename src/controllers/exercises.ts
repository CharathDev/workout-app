"use client";

import { app, firestore } from "@/firebase/firebase";
import Exercise from "@/models/Exercise";
import MuscleGroup from "@/models/MuscleGroup";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, getStorage, ref as storageRef } from "firebase/storage";
import { useEffect, useState } from "react";

interface TempExercise {
  id: string;
  name: string;
  muscle_groups: string[]; // Array of muscle group IDs
  gif_url: string;
}

export function getAllExercises(): Exercise[] | null {
  const [exercises, setExercises] = useState<Exercise[] | null>(null);

  useEffect(() => {
    // Listener for the exercises collection
    const exercisesCollection = collection(firestore, "exercises");
    const unsubscribeExercises = onSnapshot(
      exercisesCollection,
      async (exercisesSnap) => {
        const exercisesData: Exercise[] = [];

        const exercisePromises = exercisesSnap.docs.map(async (exerciseDoc) => {
          const exerciseData = exerciseDoc.data() as TempExercise;

          // Fetch the corresponding muscle groups based on muscleGroupIds
          const muscleGroupPromises = exerciseData.muscle_groups.map(
            async (muscleGroupId) => {
              const muscleGroupDocRef = doc(
                firestore,
                "muscle_groups",
                muscleGroupId
              );
              const muscleGroupDocSnap = await getDoc(muscleGroupDocRef);
              return muscleGroupDocSnap.exists()
                ? ({
                    id: muscleGroupDocSnap.id,
                    ...muscleGroupDocSnap.data(),
                  } as MuscleGroup)
                : null;
            }
          );

          const muscle_groups = (await Promise.all(muscleGroupPromises)).filter(
            Boolean
          ) as MuscleGroup[];

          exercisesData.push({
            ...exerciseData,
            id: exerciseDoc.id,
            muscle_groups,
          });
        });

        await Promise.all(exercisePromises);
        setExercises(exercisesData);
      }
    );

    // Cleanup the listener on component unmount
    return () => {
      unsubscribeExercises();
    };
  }, []);

  return exercises;
}

export function getExerciseById(id: string): Exercise | null {
  const [exercise, setExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const docSnapshot = await getDoc(doc(firestore, "exercises", id));
      // const exerciseInfo: Exercise = docSnapshot.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // })) as Exercise;
      const docData = docSnapshot.data() as TempExercise;
      const muscleGroupsQuery = await getDocs(
        query(
          collection(firestore, "muscle_groups"),
          where("__name__", "in", docData.muscle_groups)
        )
      );
      const muscle_groups: MuscleGroup[] = [];
      muscleGroupsQuery.forEach((doc) => {
        muscle_groups.push({ id: doc.id, ...doc.data() } as MuscleGroup);
      });
      const exerciseInfo: Exercise = {
        ...docSnapshot.data(),
        id: docSnapshot.id,
        muscle_groups: muscle_groups,
      } as Exercise;
      setExercise(exerciseInfo);
    };

    fetchData();
  }, []);

  return exercise;
}

export async function deleteExercise(id: string, gif_url: string) {
  const names = gif_url.split("/");
  const url = names[names.length - 1];
  const storage = getStorage(app);
  const urlRef = storageRef(storage, url);
  deleteObject(urlRef);
  await deleteDoc(doc(firestore, "exercises", id));
}
