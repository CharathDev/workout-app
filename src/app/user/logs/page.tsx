"use client";

import { useGetLogsByUser } from "@/controllers/logs";
import { useRouter } from "next/navigation";

const LogsPage = () => {
  const logs = useGetLogsByUser();
  const router = useRouter();

  if (logs) {
    logs.sort(
      (a, b) => parseInt(b.date.toString()) - parseInt(a.date.toString())
    );
  }

  return (
    <div className="bg-neutral-950 flex justify-center">
      <main className="container text-center">
        <h1 className="text-4xl font-bold mb-10">All logs</h1>
        {logs ? (
          <div className="bg-neutral-900 rounded-lg p-5 my-2 flex flex-col justify-center items-center shadow-lg mb-6">
            {logs.map((log, i) => (
              <div
                key={i}
                className="w-full bg-neutral-800 rounded-md mb-3 p-5 flex justify-between cursor-pointer hover:bg-neutral-700 hover:scale-101 transition-all"
                onClick={() =>
                  router.push(`/user/logs/${log.id}/${log.workoutId}`)
                }
              >
                <h2>{log.workoutName}</h2>
                <h2>{new Date(log.date).toDateString()}</h2>
              </div>
            ))}
          </div>
        ) : (
          <h2>loading</h2>
        )}
      </main>
    </div>
  );
};

export default LogsPage;
