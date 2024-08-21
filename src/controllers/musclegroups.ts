"use client";

import { auth, firestore } from "@/firebase/firebase";
import Exercise from "@/models/Exercise";
import LogEntry from "@/models/LogEntry";
import MuscleGroup from "@/models/MuscleGroup";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

interface MuscleGroupCount {
  muscleGroupId: string;
  name: string;
  count: number;
}

export function getMuscleGroups(): MuscleGroup[] {
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

async function getMuscleGroupCountForUser(
  userId: string
): Promise<MuscleGroupCount[]> {
  const logsQuery = query(
    collection(firestore, "logs"),
    where("userId", "==", userId)
  );
  const logsSnap = await getDocs(logsQuery);

  const logIds = logsSnap.docs.map((logDoc) => logDoc.id);

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

  // Step 3: Get all exercises that match the exerciseId in log entries
  const exerciseIds = logEntries.map((entry) => entry.exerciseId);
  const exercisesQuery = query(
    collection(firestore, "exercises"),
    where("__name__", "in", exerciseIds)
  );
  const exercisesSnap = await getDocs(exercisesQuery);

  const exercises: Exercise[] = exercisesSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Exercise[];

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

export function getMuscleGroupCount() {
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

async function getTotalVolume(userId: string): Promise<number> {
  const logsQuery = query(
    collection(firestore, "logs"),
    where("userId", "==", userId)
  );
  const logsSnap = await getDocs(logsQuery);

  const logIds = logsSnap.docs.map((logDoc) => logDoc.id);

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

  const totalVolume = logEntries
    .map(
      (current) =>
        parseInt(current.reps.toString()) * parseInt(current.weight.toString())
    )
    .reduce((sum, current) => sum + current, 0);

  return totalVolume;
}

export function getTotalVolumeForUser() {
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
