"use client";

import { firestore } from "@/firebase/firebase";
import MuscleGroup from "@/models/MuscleGroup";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

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
