"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { PuffLoader } from "react-spinners";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (!userDoc.exists()) {
          // Retriece user data from local storage
          const registrationData = localStorage.getItem("registrationData");
          const { firstName = "", lastName = "" } = registrationData
            ? JSON.parse(registrationData)
            : {};

          await setDoc(doc(firestore, "users", user.uid), {
            firstName,
            lastName,
            email: user.email,
          });

          // Clear registration data from local storage
          localStorage.removeItem("registrationData");
        }
        setUser(user);
        router.push("/dashboard");
      } else {
        setUser(null);
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <PuffLoader />;
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
          {user ? "Redirecting to dashboard..." : "Redirecting to login"}
        </div>
      </main>
    </>
  );
}
