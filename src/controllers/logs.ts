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
  orderBy,
  limit,
} from "firebase/firestore";
import { useEffect, useState } from "react";

async function fetchWorkoutName(workoutId: string): Promise<string> {
  const workoutDoc = await getDoc(doc(firestore, "workouts", workoutId));
  return workoutDoc.exists() ? workoutDoc.data()?.name ?? null : null;
}

export const useGetLogsByUser = (): Log[] | null => {
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

async function getMostRecentLogForCurrentWorkout(
  workoutId: string,
  userId: string
): Promise<Log | null> {
  // Step 1: Query the most recent log for the current workout and user, sorted by timestamp
  const logsQuery = query(
    collection(firestore, "logs"),
    where("workoutId", "==", workoutId),
    where("userId", "==", userId),
    orderBy("date", "desc"),
    limit(1) // Only get the most recent log
  );

  const logsSnap = await getDocs(logsQuery);

  // Step 2: Check if a log is found and return it
  if (!logsSnap.empty) {
    const doc = logsSnap.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      date: doc.data(), // Convert Firestore timestamp to JS Date
    } as Log;
  } else {
    return null;
  }
}

async function getLogEntriesForLog(logId: string): Promise<LogEntry[]> {
  // Query log entries associated with the most recent log
  const logEntriesQuery = query(
    collection(firestore, "log_items"),
    where("logId", "==", logId),
    orderBy("set", "asc") // Optionally order by the set number
  );

  const logEntriesSnap = await getDocs(logEntriesQuery);

  const logEntries: LogEntry[] = logEntriesSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as LogEntry[];

  return logEntries;
}

export function useGetMostRecentLogs(workoutId: string) {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user && workoutId) {
        const mostRecentLog = await getMostRecentLogForCurrentWorkout(
          workoutId,
          user.uid
        );
        if (mostRecentLog) {
          const entries = await getLogEntriesForLog(mostRecentLog.id);
          setLogEntries(entries);
        }
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [workoutId]);

  return logEntries;
}
