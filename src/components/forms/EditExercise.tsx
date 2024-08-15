"use client";

import { getMuscleGroups } from "@/controllers/musclegroups";
import { app, firestore } from "@/firebase/firebase";
import Exercise from "@/models/Exercise";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

const EditExercise = ({ exerciseInfo }: { exerciseInfo: Exercise }) => {
  const storage = getStorage(app);
  const [isOpen, setIsOpen] = useState(false);
  const muscle_groups = getMuscleGroups();
  const [gif, setGif] = useState<File>();
  const [exercise, setExercise] = useState({
    name: exerciseInfo.name,
    muscle_groups: exerciseInfo.muscle_groups.map(
      (muscle_group) => muscle_group.id
    ),
  });
  const router = useRouter();

  const onGifUploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e?.target?.files?.[0];
    setGif(image);
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

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    const exerciseRef = doc(firestore, "exercises", exerciseInfo.id);
    if (gif) {
      const oldGif = exerciseInfo.gif_url.split("/");
      const oldGifUrl = oldGif[oldGif.length - 1];
      deleteObject(ref(storage, oldGifUrl));
      const imageName = gif?.name.split(".");
      const imageRef = ref(storage, imageName![0]);
      uploadBytes(imageRef, gif!).then(async (imageURL) => {
        const fileUrl = `https://storage.googleapis.com/${imageRef.bucket}/${imageRef.fullPath}`;
        await updateDoc(exerciseRef, {
          name: exercise.name,
          muscle_groups: exercise.muscle_groups,
          gif_url: fileUrl,
        });
        setIsOpen(false);
      });
    } else {
      await updateDoc(exerciseRef, {
        name: exercise.name,
        muscle_groups: exercise.muscle_groups,
      });
      setIsOpen(false);
    }
    router.push("/admin/exercises");
  };

  return (
    <>
      <button
        data-modal-target="static-modal"
        data-modal-toggle="static-modal"
        className="block text-neutral-900 bg-cyan-500 hover:bg-cyan-600 font-bold rounded-lg px-5 py-2.5 text-center"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Edit
      </button>

      {isOpen && (
        <div
          id="static-modal"
          data-modal-backdrop="static"
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative rounded-lg shadow bg-neutral-700">
              <form onSubmit={onSubmitHandler}>
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-neutral-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Edit Exercise
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-neutral-600 hover:text-white"
                    data-modal-hide="static-modal"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
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
                      onChange={(e) =>
                        setExercise({ ...exercise, name: e.target.value })
                      }
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
                      className="block w-full border-2 rounded-lg cursor-pointer text-gray-300 focus:outline-none bg-neutral-700 border-neutral-600 placeholder-neutral-400 file:bg-neutral-600 file:border-none file:text-gray-300 file:p-2.5 focus:ring-rose-500 focus:border-rose-500"
                    />
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
                </div>
                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-neutral-600">
                  <button
                    data-modal-hide="static-modal"
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    I accept
                  </button>
                  <button
                    data-modal-hide="static-modal"
                    type="button"
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Decline
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditExercise;
