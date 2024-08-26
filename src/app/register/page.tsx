"use client";
import { useState, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, firestore } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";

const RegisterPage = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleRegister = async (event: any) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      const newUser = userCredentials.user;
      localStorage.setItem("registrationData", JSON.stringify(user));

      await setDoc(doc(firestore, "users", newUser.uid), {
        firstName: user.firstName,
        lastName: user.lastName,
        email: newUser.email,
        isAdmin: false,
        weights: [],
      });

      setUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      router.push("/user/dashboard");
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
    <div className="justify-center items-center h-screen w-screen flex flex-col relative bg-neutral-950">
      <h2 className="text-4xl font-medium text-white mb-10">Register</h2>
      <div className="p-5 bg-neutral-900 rounded-lg">
        <form onSubmit={handleRegister} className="space-y-6 px-6 pb-6">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="firstName"
                className="text-sm font-medium block mb-2 text-gray-300"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={onChangeHandler}
                required
                className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="lastName"
                className="text-sm font-medium block mb-2 text-gray-300"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={onChangeHandler}
                required
                className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
              />
            </div>
          </div>
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
          <div className="flex space-x-4">
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
            <div>
              <label
                htmlFor="firstName"
                className="text-sm font-medium block mb-2 text-gray-300"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={onChangeHandler}
                required
                className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm font-medium text-gray-300 space-y-6 px-6 pb-4">
          Already have an account?{" "}
          <Link href={"/login"} className="text-rose-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
