"use client";
import { auth, firestore } from "@/firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AddRoutine = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();
  const [currentUser, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [router]);

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    await addDoc(collection(firestore, "routines"), {
      name: name,
      user: currentUser!.uid,
    });
    setName("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="flex justify-end my-2 mb-6">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-neutral-900 rounded-md font-bold px-4 py-2 mx-2"
        >
          {" + "}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-lg p-5 my-2 flex flex-col justify-center items-center shadow-lg mb-6">
      <form className="w-1/2" onSubmit={onSubmitHandler}>
        <h2 className="text-2xl mb-2">Add Routine</h2>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="font-medium block mb-2 text-gray-300 text-start"
          >
            Routine Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
          />
        </div>
        <div className="mb-6">
          <button
            className="bg-rose-500 hover:bg-rose-600 text-neutral-900 rounded-md font-bold p-3 mx-2"
            type="submit"
          >
            + Add Routine
          </button>
          <button
            className="bg-neutral-500 hover:bg-neutral-600 text-gray-300 rounded-md p-3 mx-2"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoutine;
