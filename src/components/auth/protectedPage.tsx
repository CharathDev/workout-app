import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { firestore, auth } from "@/firebase/firebase";

export default function ProtectedPage() {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        document.cookie = `token=${token}; path=/;`; // Save token as cookie

        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const role = userDoc.data()?.isAdmin;
          setUserRole(role);
          document.cookie = `role=${role}; path=/;`; // Save role as cookie

          // Redirect based on role (optional)
          if (role) {
            router.push("/admin");
          } else {
            router.push("/user");
          }
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>; // Loading indicator
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Role: {userRole}</p>
      {/* Render your protected content here */}
    </div>
  );
}
