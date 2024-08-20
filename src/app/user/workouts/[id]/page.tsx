"use client";

import { getWorkoutItemsById } from "@/controllers/workoutitems";
import { getWorkoutById } from "@/controllers/workouts";
import { firestore } from "@/firebase/firebase";
import LogEntry from "@/models/LogEntry";
import { WorkoutTarget } from "@/models/WorkoutTarget";
import { addDoc, collection } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LogWorkoutPage = () => {
  const searchParams = usePathname();
  const workoutId = searchParams.split("/")[3];
  const workoutInfo = getWorkoutById(workoutId);
  const workoutTargetInfo = getWorkoutItemsById(workoutId);
  const generateLogEntries = (
    workoutTargetInfo: WorkoutTarget[],
    workoutId: string
  ): LogEntry[] => {
    const logEntries: LogEntry[] = [];
    workoutTargetInfo?.forEach((workoutTarget) => {
      for (let i = 0; i < parseInt(workoutTarget.set.toString()); i++) {
        let logEntry: LogEntry = {
          id: "",
          logId: "",
          workoutId: workoutId,
          exerciseId: workoutTarget.exerciseId.toString(),
          set: i + 1,
          weight: 0,
          reps: 0,
        };
        logEntries.push(logEntry);
      }
    });
    return logEntries;
  };

  const [log, setLog] = useState<LogEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (workoutTargetInfo) {
      const logEntries = generateLogEntries(workoutTargetInfo, workoutId);
      setLog(logEntries);
    }
  }, [workoutTargetInfo]);

  const onWeightChangeHandler = (e: any, i: number) => {
    setLog(
      log.map((logEntry, index) => {
        let tempEntry = logEntry;

        if (i == index) {
          tempEntry.weight = parseInt(e.target.value);
        }

        return tempEntry;
      })
    );
  };

  const onRepChangeHandler = (e: any, i: number) => {
    setLog(
      log.map((logEntry, index) => {
        let tempEntry = logEntry;

        if (i == index) {
          tempEntry.reps = parseInt(e.target.value);
        }

        return tempEntry;
      })
    );
  };

  const onSubmitHandler = async (e: any) => {
    const logInfo = await addDoc(collection(firestore, "logs"), {
      workoutId: workoutId,
      date: Date.now(),
    });

    log.forEach(async (logEntry, i) => {
      await addDoc(collection(firestore, "log_items"), {
        logId: logInfo.id,
        workoutId: workoutId,
        exerciseId: logEntry.exerciseId,
        set: logEntry.set,
        weight: logEntry.weight,
        reps: logEntry.reps,
        order: i,
      });
    });

    router.push("/user/routines");
  };

  console.log(log);

  return (
    <div className="bg-neutral-950">
      {workoutInfo && workoutTargetInfo && log.length > 0 && (
        <main className="md:cotainer mx-6 text-center">
          <h1 className="text-4xl font-bold mb-10">Log {workoutInfo.name}</h1>

          <div className="bg-neutral-900 rounded-lg p-5 my-2 flex flex-col justify-center items-center shadow-lg mb-6">
            <div className="w-full bg-neutral-800 rounded-md divide-y divide-neutral-500 mb-3">
              {workoutTargetInfo.map((workoutTarget, i) => {
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
                    <div className="flex justify-between items-center pb-3">
                      <h2 className="mx-2">{i + 1}</h2>
                      <h2 className="mx-2">{workoutTarget.exerciseName}</h2>
                      <h2 className="mx-2"></h2>
                    </div>
                    <div className="pt-3">
                      <div className="grid grid-cols-3 mb-3 text-neutral-500">
                        <div className="flex justify-center items-center">
                          <h2 className="me-2">Set </h2>
                        </div>
                        <div className="flex justify-center items-center">
                          <h2 className="me-2">Weight (kg)</h2>
                        </div>
                        <div className="flex justify-center items-center">
                          <h2 className="me-2">Reps</h2>
                        </div>
                      </div>
                      {sets.map((set) => {
                        const targetIndex =
                          workoutTargetInfo.reduce((sum, workout, index) => {
                            return index < i
                              ? sum + parseInt(workout.set.toString())
                              : sum;
                          }, 0) + set;
                        return (
                          <div
                            className="grid grid-cols-3 my-2"
                            key={targetIndex}
                          >
                            <div className="flex justify-center items-center">
                              <h2 className="me-2">{set + 1}</h2>
                            </div>
                            <div className="flex justify-center items-center">
                              <input
                                type="number"
                                className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-16 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
                                name="minReps"
                                onChange={(e) =>
                                  onWeightChangeHandler(e, targetIndex)
                                }
                                value={parseInt(
                                  log[targetIndex].weight.toString()
                                )}
                              />
                            </div>
                            <div className="flex justify-center items-center">
                              <input
                                type="number"
                                className="border-2 outline-none sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-14 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
                                name="minReps"
                                onChange={(e) =>
                                  onRepChangeHandler(e, targetIndex)
                                }
                                value={parseInt(
                                  log[targetIndex].reps.toString()
                                )}
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
              onClick={onSubmitHandler}
            >
              Log Workout
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

export default LogWorkoutPage;
