"use client";

import AddRoutine from "@/components/forms/routine/AddRoutine";
import { getAllRoutines } from "@/controllers/routines";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RoutinesPage = () => {
  const router = useRouter();
  const [currentUser, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [router]);

  const routines = currentUser
    ? getAllRoutines(currentUser.uid)
    : getAllRoutines("");

  return (
    <div className="bg-neutral-950 flex justify-center">
      <main className="md:container mx-6 text-center">
        <h1 className="text-4xl font-bold mb-10">Routines</h1>

        <AddRoutine />

        {routines ? (
          <div className="bg-neutral-900 p-5 rounded-md">
            {routines.map((routine) => (
              <Link href={`/user/routines/${routine.id}`}>
                <div className="bg-neutral-800 p-5 cursor-pointer rounded-md flex justify-between my-4 hover:bg-neutral-700">
                  <div className="flex justify-center items-center">
                    <h4 className="text-center">{routine.name}</h4>
                  </div>
                  <div className="bg-rose-500 rounded-md p-3">
                    Workouts: {routine.workouts.length}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <>You do not have any routines</>
        )}
      </main>
    </div>
  );
};

export default RoutinesPage;
