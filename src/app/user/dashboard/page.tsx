"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "@/firebase/firebase";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { PuffLoader } from "react-spinners";
import Log from "@/models/Log";
import { getLogsByUser } from "@/controllers/logs";
import HeatmapCalender from "@/components/dashboard/heatmapCalender";
import MusclesWorked from "@/components/dashboard/musclesWorked";
import { getTotalVolumeForUser } from "@/controllers/musclegroups";

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const logs = getLogsByUser();
  const totalVolume = getTotalVolumeForUser();

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
    <div className="bg-neutral-950 flex justify-center items-center">
      {userName && (
        <main className="container mx-2 text-center">
          <h1 className="text-4xl font-bold">{userName}</h1>

          <div className="bg-neutral-900 rounded-lg md:p-5 p-2 my-6 flex flex-col justify-center items-center shadow-lg">
            <div className="bg-neutral-800 rounded-lg md:p-5 p-2 md:hidden flex flex-col justify-center items-center shadow-lg w-full mb-5">
              <h2 className="text-lg mb-2">Workouts</h2>
              {logs && <HeatmapCalender logs={logs} weeksToShow={18} />}
            </div>
            <div className="bg-neutral-800 rounded-lg md:p-5 p-2 md:flex hidden flex-col justify-center items-center shadow-lg w-full mb-5">
              <h2 className="text-2xl mb-2 font-bold">Workouts</h2>
              {logs && <HeatmapCalender logs={logs} weeksToShow={32} />}
            </div>

            <div className="bg-neutral-800 rounded-lg md:p-5 p-2 flex flex-col justify-center items-center shadow-lg w-full">
              <div className="text-2xl mb-4 font-bold">Stats</div>
              <div className="flex mb-4">
                <div className="">
                  <h2>{totalVolume}kg</h2>
                  <h2 className="font-bold text-neutral-500">Total Volume</h2>
                </div>
              </div>
              <MusclesWorked />
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default DashboardPage;
