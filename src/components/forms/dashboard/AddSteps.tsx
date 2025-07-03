"use client";

import { firestore } from "@/firebase/firebase";
import { doc, DocumentData, setDoc, updateDoc } from "firebase/firestore";
import { Dispatch, SetStateAction, useState } from "react";

const AddStepsForm = ({
  user,
  userId,
  setReset,
}: {
  user: DocumentData;
  userId: string;
  setReset: Dispatch<SetStateAction<boolean>>;
}) => {
  const [steps, setSteps] = useState(0);

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    const userSteps = user.steps ? user.steps : [];
    userSteps.push({
      steps: steps,
      date: Date.now() - 24 * 60 * 60 * 1000,
    });
    await updateDoc(doc(firestore, "users", userId), {
      steps: userSteps,
    });
    setReset(true);
  };

  return (
    <div className="w-full">
      <form onSubmit={onSubmitHandler} className="h-full">
        <div className="mb-2 flex justify-center items-center h-full">
          <label htmlFor="name" className="font-medium mb-2 text-gray-300 mx-3">
            Steps:
          </label>
          <input
            type="number"
            name="name"
            value={steps}
            onChange={(e) => setSteps(parseFloat(e.target.value))}
            required
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 w-16 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
          />
          <button
            type="submit"
            className="px-4 p-2 bg-violet-500 hover:bg-violet-600 rounded-md cursor-pointer text-gray-300 text-base mx-3"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStepsForm;
