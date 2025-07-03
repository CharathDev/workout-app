"use client";

import { firestore } from "@/firebase/firebase";
import { doc, DocumentData, setDoc, updateDoc } from "firebase/firestore";
import { Dispatch, SetStateAction, useState } from "react";

const AddSleepForm = ({
  user,
  userId,
  setReset,
}: {
  user: DocumentData;
  userId: string;
  setReset: Dispatch<SetStateAction<boolean>>;
}) => {
  const [sleep, setSleep] = useState(0);

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    const userSleep = user.sleep ? user.sleep : [];
    userSleep.push({
      sleep: sleep,
      date: Date.now(),
    });
    await updateDoc(doc(firestore, "users", userId), {
      sleep: userSleep,
    });
    setReset(true);
  };

  return (
    <div className="w-full">
      <form onSubmit={onSubmitHandler} className="h-full">
        <div className="mb-2 flex justify-center items-center h-full">
          <label htmlFor="name" className="font-medium mb-2 text-gray-300 mx-3">
            Steps (hours):
          </label>
          <input
            type="number"
            name="name"
            value={sleep}
            onChange={(e) => setSleep(parseFloat(e.target.value))}
            required
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 w-16 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
          />
          <button
            type="submit"
            className="px-4 p-2 bg-cyan-500 hover:bg-cyan-600 rounded-md cursor-pointer text-gray-300 text-base mx-3"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSleepForm;
