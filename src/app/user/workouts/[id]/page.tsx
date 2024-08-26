"use client";

import { useGetWorkoutItemsById } from "@/controllers/workoutitems";
import { useGetWorkoutById } from "@/controllers/workouts";
import { auth, firestore } from "@/firebase/firebase";
import LogEntry from "@/models/LogEntry";
import { WorkoutTarget } from "@/models/WorkoutTarget";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ExerciseInfoModal from "./ExerciseInfoModal";
import { useGetMostRecentLogs } from "@/controllers/logs";

const LogWorkoutPage = () => {
  const searchParams = usePathname();
  const workoutId = searchParams.split("/")[3];
  const workoutInfo = useGetWorkoutById(workoutId);
  const workoutTargetInfo = useGetWorkoutItemsById(workoutId);
  const getPastLogInfo = useGetMostRecentLogs(workoutId);
  const [user, setUser] = useState<User | null>(null);
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
          weight: 1,
          reps: 0,
          isWeighted: workoutTarget.isWeighted,
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
  }, [workoutTargetInfo, workoutId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

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
    if (user) {
      const logInfo = await addDoc(collection(firestore, "logs"), {
        workoutId: workoutId,
        userId: user.uid,
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
          isWeighted: logEntry.isWeighted,
        });
      });

      router.push("/user/routines");
    }
  };

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
                    <div className="grid grid-cols-3 pb-3 md:text-base text-sm">
                      <h2 className="mx-2 text-left">{i + 1}</h2>
                      <h2 className="mx-2">{workoutTarget.exerciseName}</h2>
                      <div className="flex justify-end">
                        <ExerciseInfoModal
                          exerciseId={workoutTarget.exerciseId.toString()}
                        />
                      </div>
                    </div>
                    <div className="pt-3">
                      <div className="grid grid-cols-4 mb-3 text-neutral-500 md:text-base text-sm">
                        <div className="flex justify-center items-center">
                          <h2 className="me-2">Set </h2>
                        </div>
                        <div className="flex justify-center items-center">
                          <h2 className="me-2">Last </h2>
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
                          workoutTargetInfo.reduce((sum, workout, index) => {
                            return index < i
                              ? sum + parseInt(workout.set.toString())
                              : sum;
                          }, 0) + set;
                        return (
                          <div
                            className="grid grid-cols-4 my-2 md:text-base text-sm"
                            key={targetIndex}
                          >
                            <div className="flex justify-center items-center">
                              <h2 className="me-2">{set + 1}</h2>
                            </div>
                            <div className="flex justify-center items-center">
                              <h2 className="me-2 text-neutral-400">
                                {getPastLogInfo.length != 0
                                  ? getPastLogInfo[targetIndex].isWeighted
                                    ? `${getPastLogInfo[targetIndex].weight}kg * ${getPastLogInfo[targetIndex].reps}`
                                    : `${getPastLogInfo[targetIndex].reps}`
                                  : "--"}
                              </h2>
                            </div>
                            {log[targetIndex].isWeighted ? (
                              <div className="flex justify-center items-center">
                                <input
                                  type="number"
                                  className="border-2 outline-none rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-10 md:w-16 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
                                  name="minReps"
                                  onChange={(e) =>
                                    onWeightChangeHandler(e, targetIndex)
                                  }
                                  value={parseInt(
                                    log[targetIndex].weight.toString()
                                  )}
                                />
                              </div>
                            ) : (
                              <div></div>
                            )}

                            <div className="flex justify-center items-center">
                              <input
                                type="number"
                                className="border-2 outline-none rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-10 md:w-14 p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-white"
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
