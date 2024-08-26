"use client";

import { auth, firestore } from "@/firebase/firebase";
import Exercise from "@/models/Exercise";
import LogEntry from "@/models/LogEntry";
import MuscleGroup from "@/models/MuscleGroup";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

interface MuscleGroupCount {
  muscleGroupId: string;
  name: string;
  count: number;
}

export function useGetMuscleGroups(): MuscleGroup[] {
  const [data, setData] = useState<MuscleGroup[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        collection(firestore, "muscle_groups")
      );
      const dataArray: MuscleGroup[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MuscleGroup[];
      setData(dataArray);
    };

    fetchData();
  }, []);

  return data;
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function fetchLogEntriesInBatches(logIds: string[]): Promise<LogEntry[]> {
  const entriesRef = collection(firestore, "log_items");
  const chunkedLogIds = chunkArray(logIds, 20); // Split logIds into chunks of 30

  const allLogEntries: LogEntry[] = [];

  // Perform queries for each chunk of logIds
  for (const chunk of chunkedLogIds) {
    const entriesQuery = query(entriesRef, where("logId", "in", chunk));
    const querySnapshot = await getDocs(entriesQuery);

    querySnapshot.forEach((doc) => {
      allLogEntries.push({ id: doc.id, ...doc.data() } as LogEntry);
    });
  }

  return allLogEntries;
}

async function fetchExercisesInBatches(
  exerciseIds: string[]
): Promise<Exercise[]> {
  const exercisesRef = collection(firestore, "exercises");
  const chunkedExerciseIds = chunkArray(exerciseIds, 30); // Split exerciseIds into chunks of 30

  const allExercises: Exercise[] = [];

  // Perform queries for each chunk of exerciseIds
  for (const chunk of chunkedExerciseIds) {
    const exercisesQuery = query(exercisesRef, where("__name__", "in", chunk));
    const querySnapshot = await getDocs(exercisesQuery);

    querySnapshot.forEach((doc) => {
      allExercises.push({ id: doc.id, ...doc.data() } as Exercise);
    });
  }

  return allExercises;
}

async function getMuscleGroupCountForUser(
  userId: string
): Promise<MuscleGroupCount[]> {
  const logsQuery = query(
    collection(firestore, "logs"),
    where("userId", "==", userId)
  );
  const logsSnap = await getDocs(logsQuery);

  const logIds = logsSnap.docs.map((logDoc) => logDoc.id);

  if (logIds.length != 0) {
    // Step 2: Get all log entries that reference these logs

    const logEntries: LogEntry[] = await fetchLogEntriesInBatches(logIds);

    // Step 3: Get all exercises that match the exerciseId in log entries
    const exerciseIds = logEntries.map((entry) => entry.exerciseId);

    const exercises: Exercise[] = await fetchExercisesInBatches(exerciseIds);

    // Step 4: Get all muscle groups
    const muscleGroupsSnap = await getDocs(
      collection(firestore, "muscle_groups")
    );

    const muscleGroups: MuscleGroup[] = muscleGroupsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MuscleGroup[];

    // Step 5: Count the occurrences of each muscle group in log entries
    const muscleGroupCountMap: { [key: string]: number } = {};

    logEntries.forEach((logEntry) => {
      const exercise = exercises.find((ex) => ex.id === logEntry.exerciseId);
      if (exercise) {
        exercise.muscle_groups.forEach((muscleGroupId) => {
          if (muscleGroupCountMap[muscleGroupId.toString()]) {
            muscleGroupCountMap[muscleGroupId.toString()]++;
          } else {
            muscleGroupCountMap[muscleGroupId.toString()] = 1;
          }
        });
      }
    });

    // Step 6: Create an array of MuscleGroupCount from the map
    const muscleGroupCounts: MuscleGroupCount[] = muscleGroups.map(
      (muscleGroup) => ({
        muscleGroupId: muscleGroup.id,
        name: muscleGroup.name,
        count: muscleGroupCountMap[muscleGroup.id] || 0,
      })
    );
    return muscleGroupCounts;
  }

  return [];
}

export function useGetMuscleGroupCount() {
  const [muscleGroupCounts, setMuscleGroupCounts] = useState<
    MuscleGroupCount[]
  >([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const counts = await getMuscleGroupCountForUser(user.uid);
        setMuscleGroupCounts(counts);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return muscleGroupCounts;
}

async function getMuscleGroupCountAll(): Promise<MuscleGroupCount[]> {
  const logsQuery = query(collection(firestore, "logs"));
  const logsSnap = await getDocs(logsQuery);

  const logIds = logsSnap.docs.map((logDoc) => logDoc.id);

  // Step 2: Get all log entries that reference these logs

  const logEntries: LogEntry[] = await fetchLogEntriesInBatches(logIds);

  // Step 3: Get all exercises that match the exerciseId in log entries
  const exerciseIds = logEntries.map((entry) => entry.exerciseId);

  const exercises: Exercise[] = await fetchExercisesInBatches(exerciseIds);

  // Step 4: Get all muscle groups
  const muscleGroupsSnap = await getDocs(
    collection(firestore, "muscle_groups")
  );

  const muscleGroups: MuscleGroup[] = muscleGroupsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MuscleGroup[];

  // Step 5: Count the occurrences of each muscle group in log entries
  const muscleGroupCountMap: { [key: string]: number } = {};

  logEntries.forEach((logEntry) => {
    const exercise = exercises.find((ex) => ex.id === logEntry.exerciseId);
    if (exercise) {
      exercise.muscle_groups.forEach((muscleGroupId) => {
        if (muscleGroupCountMap[muscleGroupId.toString()]) {
          muscleGroupCountMap[muscleGroupId.toString()]++;
        } else {
          muscleGroupCountMap[muscleGroupId.toString()] = 1;
        }
      });
    }
  });

  // Step 6: Create an array of MuscleGroupCount from the map
  const muscleGroupCounts: MuscleGroupCount[] = muscleGroups.map(
    (muscleGroup) => ({
      muscleGroupId: muscleGroup.id,
      name: muscleGroup.name,
      count: muscleGroupCountMap[muscleGroup.id] || 0,
    })
  );

  return muscleGroupCounts;
}

export function useGetAllMuscleGroupCount() {
  const [muscleGroupCounts, setMuscleGroupCounts] = useState<
    MuscleGroupCount[]
  >([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const counts = await getMuscleGroupCountAll();
        setMuscleGroupCounts(counts);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return muscleGroupCounts;
}

async function getTotalVolume(userId: string): Promise<number> {
  const logsQuery = query(
    collection(firestore, "logs"),
    where("userId", "==", userId)
  );
  const logsSnap = await getDocs(logsQuery);

  const logIds = logsSnap.docs.map((logDoc) => logDoc.id);

  if (logIds.length != 0) {
    const logEntries: LogEntry[] = await fetchLogEntriesInBatches(logIds);

    const totalVolume = logEntries
      .map(
        (current) =>
          parseInt(current.reps.toString()) *
          parseInt(current.weight.toString())
      )
      .reduce((sum, current) => sum + current, 0);

    return totalVolume;
  }

  return 0;
}

export function useGetTotalVolumeForUser() {
  const [muscleGroupCounts, setMuscleGroupCounts] = useState<number>(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const counts = await getTotalVolume(user.uid);
        setMuscleGroupCounts(counts);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return muscleGroupCounts;
}
