"use client";

import { useGetLogInfo } from "@/controllers/logs";
import { useGetWorkoutItemsById } from "@/controllers/workoutitems";
import { firestore } from "@/firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import Swal from "sweetalert2";

const LogInfoPage = () => {
  const searchParams = usePathname();
  const logId = searchParams.split("/")[3];
  const workoutId = searchParams.split("/")[4];
  const [logEntries, log] = useGetLogInfo(logId);
  const workoutTargets = useGetWorkoutItemsById(workoutId);
  const router = useRouter();

  const deleteHandler = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        for (let logEntry of logEntries) {
          await deleteDoc(doc(firestore, "log_items", logEntry.id));
        }

        await deleteDoc(doc(firestore, "logs", logId));
        Swal.fire({
          title: "Deleted!",
          text: "Your log has been deleted.",
          icon: "success",
        });
        router.push("/user/logs");
      }
    });
  };

  return (
    <div className="bg-neutral-950 flex justify-center">
      {log && logEntries.length != 0 && workoutTargets && (
        <main className="container text-center">
          <div className="grid grid-cols-3 mb-10">
            <div className="flex">
              <button
                className="rounded-full bg-neutral-950 hover:bg-neutral-900 p-2"
                onClick={() => router.push(`/user/logs`)}
              >
                <IoIosArrowRoundBack size={32} />
              </button>
            </div>
            <h1 className="text-4xl font-bold">Log {log.workoutName}</h1>
            <div></div>
          </div>

          <div className="bg-neutral-900 rounded-lg p-5 my-2 flex flex-col justify-center items-center shadow-lg mb-6">
            <div className="w-full bg-neutral-800 rounded-md divide-y divide-neutral-500 mb-3">
              {workoutTargets.map((workoutTarget, i) => {
                let sets = [];
                for (
                  let i = 0;
                  i < parseInt(workoutTarget.set.toString());
                  i++
                ) {
                  sets.push(i);
                }
                return (
                  <div className="p-3 mb-6 w-full" key={i}>
                    <div className="grid grid-cols-3 pb-3 md:text-base text-sm">
                      <h2 className="mx-2 text-left">{i + 1}</h2>
                      <h2 className="mx-2">{workoutTarget.exerciseName}</h2>
                      <div className="flex justify-end"></div>
                    </div>
                    <div className="pt-3">
                      <div className="grid grid-cols-3 mb-3 text-neutral-500 md:text-base text-sm">
                        <div className="flex justify-center items-center">
                          <h2 className="me-2">Set </h2>
                        </div>
                        <div className="flex justify-center items-center">
                          {workoutTarget.isWeighted ? (
                            <h2 className="me-2">Weight (kg)</h2>
                          ) : (
                            <h2></h2>
                          )}
                        </div>
                        <div className="flex justify-center items-center">
                          <h2 className="me-2">Reps</h2>
                        </div>
                      </div>
                      {sets.map((set) => {
                        const targetIndex =
                          workoutTargets.reduce((sum, workout, index) => {
                            return index < i
                              ? sum + parseInt(workout.set.toString())
                              : sum;
                          }, 0) + set;
                        return (
                          <div
                            className="grid grid-cols-3 my-2 md:text-base text-sm"
                            key={targetIndex}
                          >
                            <div className="flex justify-center items-center">
                              <h2 className="me-2">{set + 1}</h2>
                            </div>
                            {workoutTarget.isWeighted ? (
                              <div className="flex justify-center items-center">
                                <input
                                  type="number"
                                  className="border-2 outline-none rounded-lg block w-10 md:w-16 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-neutral-500 cursor-not-allowed"
                                  name="minReps"
                                  value={parseInt(
                                    logEntries[targetIndex].weight.toString()
                                  )}
                                  disabled
                                />
                              </div>
                            ) : (
                              <div></div>
                            )}

                            <div className="flex justify-center items-center">
                              <input
                                type="number"
                                className="border-2 outline-none rounded-lg block w-10 md:w-14 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-neutral-500 cursor-not-allowed"
                                name="minReps"
                                value={parseInt(
                                  logEntries[targetIndex].reps.toString()
                                )}
                                disabled
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="px-4 py-2 rounded-md bg-rose-500 hover:bg-rose-600 font-bold text-neutral-900"
              onClick={deleteHandler}
            >
              Delete
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

export default LogInfoPage;
