"use client";
import { useGetMuscleGroups } from "@/controllers/musclegroups";
import { app, firestore } from "@/firebase/firebase";
import { ChangeEvent, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

export default function AddExercise() {
  const storage = getStorage(app);
  const [isOpen, setIsOpen] = useState(false);
  const muscle_groups = useGetMuscleGroups();
  const [exercise, setExercise] = useState({
    name: "",
    muscle_groups: Array<string>(),
    isWeighted: true,
  });

  const [gif, setGif] = useState<File>();

  const onChangeHandler = (e: { target: { name: any; value: any } }) => {
    setExercise({ ...exercise, [e.target.name]: e.target.value });
  };

  const onMuscleGroupChangeHandler = (e: { target: { value: any } }) => {
    const clickedId = e.target.value;
    if (exercise.muscle_groups.includes(clickedId)) {
      setExercise({
        ...exercise,
        muscle_groups: exercise.muscle_groups.filter((id) => id !== clickedId),
      });
    } else {
      setExercise({
        ...exercise,
        muscle_groups: [...exercise.muscle_groups, clickedId],
      });
    }
  };

  const isChecked = (id: string): boolean => {
    return exercise.muscle_groups.includes(id);
  };

  const onSubmitHandler = (e: any) => {
    e.preventDefault();
    const imageName = gif?.name.split(".");
    const imageRef = ref(storage, imageName![0]);
    uploadBytes(imageRef, gif!).then(async (imageURL) => {
      const fileUrl = `https://storage.googleapis.com/${imageRef.bucket}/${imageRef.fullPath}`;
      await addDoc(collection(firestore, "exercises"), {
        name: exercise.name,
        muscle_groups: exercise.muscle_groups,
        gif_url: fileUrl,
        isWeighted: exercise.isWeighted,
      });
      setExercise({
        name: "",
        muscle_groups: Array<string>(),
        isWeighted: true,
      });
      setIsOpen(false);
    });
  };

  const onGifUploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e?.target?.files?.[0];
    setGif(image);
  };

  if (!isOpen) {
    return (
      <div className="flex justify-end my-2 mb-6">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-neutral-900 rounded-md font-bold p-3 mx-2"
        >
          + Add Exercise
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-lg p-5 my-2 flex flex-col justify-center items-center shadow-lg mb-6">
      <form className="w-1/2" onSubmit={onSubmitHandler}>
        <h2 className="text-2xl mb-2">Add Exercise</h2>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="font-medium block mb-2 text-gray-300 text-start"
          >
            Exercise Name
          </label>
          <input
            type="text"
            name="name"
            value={exercise.name}
            onChange={onChangeHandler}
            required
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="font-medium block mb-2 text-gray-300 text-start"
          >
            Exercise GIF
          </label>
          <input
            type="file"
            name="name"
            onChange={onGifUploadHandler}
            required
            className="block w-full border-2 rounded-lg cursor-pointer text-gray-300 focus:outline-none bg-neutral-700 border-neutral-600 placeholder-neutral-400 file:bg-neutral-600 file:border-none file:text-gray-300 file:p-2.5 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="font-medium block mb-2 text-gray-300 text-start"
          >
            Is Weighted
          </label>
          <div className="relative flex gap-x-3">
            <div className="flex h-6 items-center">
              <input
                id="candidates"
                name="muscle_groups"
                type="checkbox"
                onChange={() =>
                  setExercise({ ...exercise, isWeighted: !exercise.isWeighted })
                }
                checked={exercise.isWeighted}
                className="h-4 w-4 rounded bg-gray-300 text-rose-600 focus:ring-rose-600"
              />
            </div>
            <div className="text-sm leading-6">
              <label htmlFor="candidates" className="font-medium text-gray-300">
                Weighted
              </label>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="font-medium block mb-2 text-gray-300 text-start"
          >
            Muscle Groups
          </label>
          <div className="grid grid-cols-4 gap-4">
            {muscle_groups.map((muscle_group, i) => (
              <div className="relative flex gap-x-3" key={i}>
                <div className="flex h-6 items-center">
                  <input
                    id="candidates"
                    name="muscle_groups"
                    type="checkbox"
                    value={muscle_group.id}
                    onChange={onMuscleGroupChangeHandler}
                    checked={isChecked(muscle_group.id)}
                    className="h-4 w-4 rounded bg-gray-300 text-rose-600 focus:ring-rose-600"
                  />
                </div>
                <div className="text-sm leading-6">
                  <label
                    htmlFor="candidates"
                    className="font-medium text-gray-300"
                  >
                    {muscle_group.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <button
            className="bg-rose-500 hover:bg-rose-600 text-neutral-900 rounded-md font-bold p-3 mx-2"
            type="submit"
          >
            + Add Exercise
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
}
