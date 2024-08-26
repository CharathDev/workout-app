"use client";
import { useState, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";

const LoginPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      const newUser = userCredentials.user;
      const token = await newUser.getIdToken();
      document.cookie = `token=${token}; path=/;`;

      let docRef = doc(firestore, "users", newUser.uid);
      const userInfo = await getDoc(docRef);
      document.cookie = `role=${userInfo.data()!.isAdmin}; path=/;`;
      if (userInfo.data()!.isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const onChangeHandler = (e: { target: { name: any; value: any } }) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  return (
    <div className="justify-center items-center h-screen w-full flex flex-col relative bg-neutral-950">
      <h2 className="text-4xl font-medium text-white mb-10">Login</h2>
      <div className="p-5 bg-neutral-900 rounded-lg">
        <form onSubmit={handleLogin} className="space-y-6 px-6 pb-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium block mb-2 text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={onChangeHandler}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
            />
          </div>
          <div>
            <label
              htmlFor="firstName"
              className="text-sm font-medium block mb-2 text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={onChangeHandler}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Sign In
          </button>
        </form>
        <p className="text-sm font-medium text-gray-300 space-y-6 px-6 pb-4">
          Don`&apos;`t have an account?{" "}
          <Link href={"/register"} className="text-rose-700 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
