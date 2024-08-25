"use client";

import { app, auth, firestore } from "@/firebase/firebase";
import Exercise from "@/models/Exercise";
import LogEntry from "@/models/LogEntry";
import MuscleGroup from "@/models/MuscleGroup";
import { onAuthStateChanged } from "firebase/auth";
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
  isWeighted: boolean;
}

export function useGetAllExercises(): Exercise[] | null {
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

export function useGetExerciseById(id: string): Exercise | null {
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

export async function useDeleteExercise(id: string, gif_url: string) {
  const names = gif_url.split("/");
  const url = names[names.length - 1];
  const storage = getStorage(app);
  const urlRef = storageRef(storage, url);
  deleteObject(urlRef);
  await deleteDoc(doc(firestore, "exercises", id));
}

interface ExerciseCount {
  exerciseId: string;
  name: string;
  totalSets: number;
}

async function getTopExercisesForUserAsync(
  userId: string
): Promise<ExerciseCount[]> {
  // Step 1: Get all logs for the current user
  const logsQuery = query(
    collection(firestore, "logs"),
    where("userId", "==", userId)
  );
  const logsSnap = await getDocs(logsQuery);

  const logIds = logsSnap.docs.map((logDoc) => logDoc.id);

  // Step 2: Get all log entries that reference these logs
  const logEntriesQuery = query(
    collection(firestore, "log_entries"),
    where("logId", "in", logIds)
  );
  const logEntriesSnap = await getDocs(logEntriesQuery);

  const logEntries: LogEntry[] = logEntriesSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as LogEntry[];

  // Step 3: Count sets per exercise
  const exerciseCountMap: { [key: string]: number } = {};

  logEntries.forEach((logEntry) => {
    if (exerciseCountMap[logEntry.exerciseId]) {
      exerciseCountMap[logEntry.exerciseId] += parseInt(
        logEntry.set.toString()
      );
    } else {
      exerciseCountMap[logEntry.exerciseId] = parseInt(logEntry.set.toString());
    }
  });

  // Step 4: Get exercise details (name)
  const exerciseIds = Object.keys(exerciseCountMap);
  const exercisesQuery = query(
    collection(firestore, "exercises"),
    where("__name__", "in", exerciseIds)
  );
  const exercisesSnap = await getDocs(exercisesQuery);

  const exerciseCounts: ExerciseCount[] = exercisesSnap.docs.map((doc) => {
    const totalSets = exerciseCountMap[doc.id] || 0;
    return {
      exerciseId: doc.id,
      name: doc.data().name as string,
      totalSets,
    };
  });

  // Step 5: Sort exercises by total sets
  exerciseCounts.sort((a, b) => b.totalSets - a.totalSets);

  return exerciseCounts;
}

export function useGetTopExercisesForUser() {
  const [topExercises, setTopExercises] = useState<ExerciseCount[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const counts = await getTopExercisesForUserAsync(user.uid);
        setTopExercises(counts);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return topExercises;
}

async function getTopExercisesAsync(): Promise<ExerciseCount[]> {
  // Step 1: Get all logs for the current user
  const logsQuery = query(collection(firestore, "logs"));
  const logsSnap = await getDocs(logsQuery);

  const logIds = logsSnap.docs.map((logDoc) => logDoc.id);
  console.log(logIds);

  // Step 2: Get all log entries that reference these logs
  const logEntriesQuery = query(
    collection(firestore, "log_items"),
    where("logId", "in", logIds)
  );
  const logEntriesSnap = await getDocs(logEntriesQuery);

  const logEntries: LogEntry[] = logEntriesSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as LogEntry[];

  // Step 3: Count sets per exercise
  const exerciseCountMap: { [key: string]: number } = {};

  logEntries.forEach((logEntry) => {
    if (exerciseCountMap[logEntry.exerciseId]) {
      exerciseCountMap[logEntry.exerciseId] += 1;
    } else {
      exerciseCountMap[logEntry.exerciseId] = 1;
    }
  });

  // Step 4: Get exercise details (name)
  const exerciseIds = Object.keys(exerciseCountMap);
  const exercisesQuery = query(
    collection(firestore, "exercises"),
    where("__name__", "in", exerciseIds)
  );
  const exercisesSnap = await getDocs(exercisesQuery);

  const exerciseCounts: ExerciseCount[] = exercisesSnap.docs.map((doc) => {
    const totalSets = exerciseCountMap[doc.id] || 0;
    return {
      exerciseId: doc.id,
      name: doc.data().name as string,
      totalSets,
    };
  });

  // Step 5: Sort exercises by total sets
  exerciseCounts.sort((a, b) => b.totalSets - a.totalSets);

  return exerciseCounts;
}

export function useGetTopExercises() {
  const [topExercises, setTopExercises] = useState<ExerciseCount[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const counts = await getTopExercisesAsync();
        setTopExercises(counts);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return topExercises;
}
