"use client";
import dynamic from "next/dynamic";
import "chart.js/auto";
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

const SleepLineChart = ({ sleep }: { sleep: any[] }) => {
  const data = {
    labels: sleep.map(
      (sleepHours) =>
        new Date(sleepHours.date).getDate() +
        "-" +
        (new Date(sleepHours.date).getMonth() + 1) +
        "-" +
        new Date(sleepHours.date).getFullYear()
    ),
    datasets: [
      {
        label: "Sleep",
        data: sleep.map((sleepHours) => sleepHours.sleep),
        fill: true,
        borderColor: "rgb(6 182 212)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {},
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{ height: "800px" }}
      className="w-full xl:px-12 flex justify-center items-center relative"
    >
      <Line data={data} options={options} />
    </div>
  );
};
export default SleepLineChart;
