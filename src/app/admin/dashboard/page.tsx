"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "@/firebase/firebase";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { PuffLoader } from "react-spinners";
import { getAllMuscleGroupCount } from "@/controllers/musclegroups";
import WorkoutDoughnutChart from "@/components/dashboard/musclesWorkedDonutChart";
const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const muscleGroups = getAllMuscleGroupCount();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`);
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <PuffLoader />;
  }

  return (
    <div className="bg-neutral-950">
      <main className="md:container mx-auto text-center">
        {userName && (
          <h1 className="text-4xl font-bold mb-3">Hi, Admin {userName}</h1>
        )}

        <div className="bg-neutral-900 rounded-lg grid grid-cols-2">
          <div className="bg-neutral-800 m-4 rounded-lg">
            <h2 className="text-2xl font-bold mt-3">Muscle Groups</h2>
            {muscleGroups && (
              <WorkoutDoughnutChart muscleGroups={muscleGroups} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
