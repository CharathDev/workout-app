import { auth, firestore } from "@/firebase/firebase";
import Log from "@/models/Log";
import LogEntry from "@/models/LogEntry";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

async function fetchWorkoutName(workoutId: string): Promise<string> {
  const workoutDoc = await getDoc(doc(firestore, "workouts", workoutId));
  return workoutDoc.exists() ? workoutDoc.data()?.name ?? null : null;
}

export const getLogsByUser = (): Log[] | null => {
  const [logs, setLogs] = useState<Log[] | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;

        // Query to get all logs for the current user
        const logsQuery = query(
          collection(firestore, "logs"),
          where("userId", "==", userId)
        );

        const unsubscribeLogs = onSnapshot(logsQuery, async (logsSnap) => {
          const populatedLogs: Log[] = await Promise.all(
            logsSnap.docs.map(async (logDoc) => {
              const logData = { id: logDoc.id, ...logDoc.data() } as Log;
              const logWorkoutName = await fetchWorkoutName(logData.workoutId);

              // Query to get all log entries for the current log
              const logEntriesQuery = query(
                collection(firestore, "log_items"),
                where("logId", "==", logData.id)
              );
              const logEntriesSnap = await getDocs(logEntriesQuery);

              const logEntries: LogEntry[] = logEntriesSnap.docs.map(
                (entryDoc) => ({
                  id: entryDoc.id,
                  ...entryDoc.data(),
                })
              ) as LogEntry[];

              return { ...logData, logEntries, workoutName: logWorkoutName };
            })
          );

          setLogs(populatedLogs);
        });

        // Cleanup the log listener on unmount
        return () => {
          unsubscribeLogs();
        };
      }
    });

    // Cleanup the auth listener on unmount
    return () => {
      unsubscribeAuth();
    };
  }, []);

  logs &&
    logs.sort(
      (a, b) => parseInt(a.date.toString()) - parseInt(b.date.toString())
    );

  return logs;
};
