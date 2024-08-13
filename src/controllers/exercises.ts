"use client";

import { firestore } from "@/firebase/firebase";
import Exercise from "@/models/Exercise";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function getAllExercises(): Exercise[] {
  const [data, setData] = useState<Exercise[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "exercises"),
      (snapshot) => {
        const dataArray: Exercise[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Exercise[];
        setData(dataArray);
      }
    );

    return () => unsubscribe();
  }, []);

  return data;
}
