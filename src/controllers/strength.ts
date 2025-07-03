import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { getISOWeek, getYear } from "date-fns";

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

async function fetchLogItemsInChunks(allLogIds: string[]) {
  if (allLogIds.length === 0) return [];

  const chunks = chunkArray(allLogIds, 10);
  const allDocs: any[] = [];

  for (const chunk of chunks) {
    const q = query(
      collection(firestore, "log_items"),
      where("logId", "in", chunk)
    );

    const snap = await getDocs(q);
    snap.forEach((doc) => allDocs.push(doc));
  }

  return allDocs;
}

function groupByWeek(
  data: { date: number; [key: string]: any }[],
  valueKey: string
) {
  const weekMap = new Map<string, number[]>();

  data.forEach((entry) => {
    const d = new Date(entry.date);
    const week = `${getYear(d)}-${getISOWeek(d)}`;
    const value = entry[valueKey];

    if (typeof value !== "number") return;

    if (!weekMap.has(week)) weekMap.set(week, []);
    weekMap.get(week)?.push(value);
  });

  if (valueKey == "weight") console.log(weekMap.entries());

  return Array.from(weekMap.entries())
    .map(([week, values]) => ({
      week,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    }))
    .sort((a, b) => {
      const [aYear, aWeek] = a.week.split("-").map(Number);
      const [bYear, bWeek] = b.week.split("-").map(Number);

      return bYear - aYear || bWeek - aWeek; // newest first
    }) // newest first
    .slice(0, 2);
}

function analyzeCorrelations(
  week1: MetricWeek,
  week2: MetricWeek
): CorrelationResult {
  const pctChange = (before: number, after: number) =>
    before === 0 ? 0 : ((after - before) / before) * 100;

  const strengthChange = pctChange(week1.strength, week2.strength);
  const stepsChange = pctChange(week1.steps, week2.steps);
  const sleepChange = pctChange(week1.sleep, week2.sleep);
  const weightChange = pctChange(week1.weight, week2.weight);

  const contributors: string[] = [];

  if (strengthChange < -3) {
    if (sleepChange < -5)
      contributors.push("Reduced sleep may have impacted strength");
    if (weightChange < -2)
      contributors.push("Weight loss may be contributing to strength loss");
    if (stepsChange > 10)
      contributors.push("High step count may indicate fatigue or overtraining");
  } else if (strengthChange > 3) {
    if (sleepChange > 5)
      contributors.push("Improved sleep may be aiding strength");
    if (weightChange > 2)
      contributors.push("Weight gain could be supporting strength gain");
    if (stepsChange < -10)
      contributors.push("Reduced cardio could be helping recovery");
  }

  return {
    strengthChangePercent: parseFloat(strengthChange.toFixed(2)),
    contributingFactors:
      contributors.length > 0
        ? contributors
        : ["No strong correlations detected"],
    trendData: {
      strength: [week1.strength, week2.strength],
      weight: [week1.weight, week2.weight],
      sleep: [week1.sleep, week2.sleep],
      steps: [week1.steps, week2.steps],
    },
  };
}

type MetricWeek = {
  steps: number;
  sleep: number;
  weight: number;
  strength: number;
};

type CorrelationResult = {
  strengthChangePercent: number;
  contributingFactors: string[];
  trendData: Record<string, number[]>;
};

export async function analyzeUserTrends(userId: string) {
  const userDoc = await getDoc(doc(firestore, "users", userId));
  const userData = userDoc.data();

  const weights = groupByWeek(userData?.weights || [], "weight");
  const sleep = groupByWeek(userData?.sleep || [], "sleep");
  const steps = groupByWeek(userData?.steps || [], "steps");

  const logsSnap = await getDocs(
    query(collection(firestore, "logs"), where("userId", "==", userId))
  );

  const allLogIds: string[] = [];
  const logDates: Record<string, Date> = {};

  logsSnap.forEach((docSnap) => {
    const data = docSnap.data();
    allLogIds.push(docSnap.id);
    logDates[docSnap.id] = new Date(data.date);
  });

  const logItemsSnap = await fetchLogItemsInChunks(allLogIds);

  const strengthByWeek: Map<string, number[]> = new Map();
  logItemsSnap.forEach((docSnap) => {
    const { logId, weight, reps } = docSnap.data();
    const date = logDates[logId];
    if (!date) return;

    const est1RM = weight * (1 + reps / 30);
    const weekKey = `${getYear(date)}-${getISOWeek(date)}`;

    if (!strengthByWeek.has(weekKey)) strengthByWeek.set(weekKey, []);
    strengthByWeek.get(weekKey)?.push(est1RM);
  });

  const strength = Array.from(strengthByWeek.entries())
    .map(([week, lifts]) => ({
      week,
      avg: lifts.reduce((a, b) => a + b, 0) / lifts.length,
    }))
    .sort((a, b) => (a.week < b.week ? 1 : -1)); // newest first

  console.log(strength);
  console.log(weights);
  console.log(sleep);
  console.log(steps);

  // Find intersection of weeks available in all metrics
  const weeksSets = [weights, sleep, steps, strength].map(
    (arr) => new Set(arr.map((w) => w.week))
  );

  const commonWeeks = Array.from(weeksSets[0]).filter((week) =>
    weeksSets.every((ws) => ws.has(week))
  );

  if (commonWeeks.length < 2) {
    return {
      error: "Not enough common weeks with full data for trend analysis",
    };
  }

  // Sort commonWeeks descending to get the most recent two
  commonWeeks.sort((a, b) => (a < b ? 1 : -1));
  const weekToUse = commonWeeks.slice(0, 2);

  // Helper fn to pick avg by week key
  const getAvgByWeek = (arr: { week: string; avg: number }[], week: string) => {
    const found = arr.find((w) => w.week === week);
    return found ? found.avg : NaN;
  };

  const week1 = {
    strength: getAvgByWeek(strength, weekToUse[1]),
    weight: getAvgByWeek(weights, weekToUse[1]),
    sleep: getAvgByWeek(sleep, weekToUse[1]),
    steps: getAvgByWeek(steps, weekToUse[1]),
  };

  const week2 = {
    strength: getAvgByWeek(strength, weekToUse[0]),
    weight: getAvgByWeek(weights, weekToUse[0]),
    sleep: getAvgByWeek(sleep, weekToUse[0]),
    steps: getAvgByWeek(steps, weekToUse[0]),
  };

  return analyzeCorrelations(week1, week2);
}
