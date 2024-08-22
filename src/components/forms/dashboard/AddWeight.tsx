"use client";

import { firestore } from "@/firebase/firebase";
import { doc, DocumentData, setDoc, updateDoc } from "firebase/firestore";
import { Dispatch, SetStateAction, useState } from "react";

const AddWeightForm = ({
  user,
  userId,
  setReset,
}: {
  user: DocumentData;
  userId: string;
  setReset: Dispatch<SetStateAction<boolean>>;
}) => {
  const [weight, setWeight] = useState(0);

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    const weights = user.weights;
    weights.push({
      weight: weight,
      date: Date.now(),
    });
    await updateDoc(doc(firestore, "users", userId), {
      weights: weights,
    });
  };

  return (
    <div className="w-full">
      <form onSubmit={onSubmitHandler}>
        <div className="mb-2 flex justify-center items-center">
          <label
            htmlFor="name"
            className="font-medium mb-2 text-gray-300 text-start mx-3"
          >
            Weight (kg):
          </label>
          <input
            type="number"
            name="name"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            required
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 w-16 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
          />
          <button
            type="submit"
            className="px-4 p-2 bg-rose-500 hover:bg-rose-600 rounded-md cursor-pointer text-gray-300 text-base mx-3"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWeightForm;
