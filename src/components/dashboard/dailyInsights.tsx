"use client";

import { analyzeUserTrends } from "@/controllers/strength";
import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TrendData = {
  strengthChangePercent: number;
  contributingFactors: string[];
  trendData: Record<string, number[]>;
};

const DailyInsights = ({
  user,
  userId,
}: {
  user: DocumentData;
  userId: string;
}) => {
  const [trend, setTrend] = useState<TrendData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const result = await analyzeUserTrends(userId);
        if ("error" in result) {
          setError(result.error);
        } else {
          setTrend(result);
        }
      } catch (err) {
        setError("Failed to analyze trends.");
      }
    };

    fetchTrend();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!trend) return <div>Loading trend data...</div>;

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Trend Analysis</h2>
        <p>Strength Change: {trend.strengthChangePercent.toFixed(2)}%</p>
        <h3 className="font-medium mt-3">Contributing Factors:</h3>
        <ul className="list-disc list-inside">
          {trend.contributingFactors.map((reason, i) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
        <div className="mt-4">
          <h3 className="font-medium">Trend Data (Past 2 Weeks):</h3>
          <ul>
            {Object.entries(trend.trendData).map(([metric, values]) => (
              <li key={metric}>
                {metric}: {values[0].toFixed(1)} → {values[1].toFixed(1)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DailyInsights;
