"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "@/firebase/firebase";
import type { User } from "firebase/auth";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { PuffLoader } from "react-spinners";
import Log from "@/models/Log";
import { getLogsByUser } from "@/controllers/logs";
import HeatmapCalender from "@/components/dashboard/heatmapCalender";
import MusclesWorked from "@/components/dashboard/musclesWorked";
import { getTotalVolumeForUser } from "@/controllers/musclegroups";
import AddWeightForm from "@/components/forms/dashboard/AddWeight";
import WeightLineChart from "@/components/dashboard/weigthLineChart";

const DashboardPage = () => {
  const [reset, setReset] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<DocumentData | null>(null);
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
          const today =
            new Date(Date.now()).getDate() +
            "-" +
            new Date(Date.now()).getMonth() +
            "-" +
            new Date(Date.now()).getFullYear();
          const userFinalData = {
            ...userData,
            weightLogged: userData.weights.find((weight: any) => {
              return (
                new Date(weight.date).getDate() +
                  "-" +
                  new Date(weight.date).getMonth() +
                  "-" +
                  new Date(weight.date).getFullYear() ==
                today
              );
            }),
          };
          setUserInfo(userFinalData);
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
      {userInfo && user && (
        <main className="container text-center">
          <h1 className="text-4xl font-bold">
            {userInfo.firstName + " " + userInfo.lastName}
          </h1>

          <div className="bg-neutral-900 rounded-lg md:p-5 p-2 my-6 flex flex-col justify-center items-center shadow-lg">
            <div className="bg-neutral-800 rounded-lg md:p-5 p-2 xl:hidden flex flex-col justify-center items-center shadow-lg w-full mb-5">
              <h2 className="text-lg mb-2">Workouts</h2>
              {logs && <HeatmapCalender logs={logs} weeksToShow={18} />}
            </div>

            <div className="bg-neutral-800 rounded-lg md:p-5 p-2 flex flex-col justify-center items-center shadow-lg w-full mb-5">
              <div className="text-2xl mb-4 font-bold">Stats</div>
              <div className="xl:grid grid-cols-2">
                <div className="md:p-5 p-2 xl:flex hidden flex-col justify-center items-center mb-5">
                  <h2 className="text-xl mb-2 font-bold">Workouts</h2>
                  {logs && <HeatmapCalender logs={logs} weeksToShow={28} />}
                </div>
                <div className="flex flex-col mb-4">
                  <div className="">
                    <h2>{totalVolume}kg</h2>
                    <h2 className="font-bold text-neutral-500">Total Volume</h2>
                  </div>
                  <MusclesWorked />
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 rounded-lg md:p-5 p-2 flex flex-col justify-center items-center shadow-lg w-full">
              <h2 className="text-2xl mb-2 font-bold">Weight Tracking</h2>

              {!userInfo.weightLogged && (
                <AddWeightForm
                  user={userInfo}
                  userId={user.uid}
                  setReset={setReset}
                />
              )}

              <WeightLineChart weights={userInfo.weights} />
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default DashboardPage;
