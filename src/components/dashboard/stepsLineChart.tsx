"use client";
import dynamic from "next/dynamic";
import "chart.js/auto";
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

const StepsLineChart = ({ steps }: { steps: any[] }) => {
  const data = {
    labels: steps.map(
      (step) =>
        new Date(step.date).getDate() +
        "-" +
        (new Date(step.date).getMonth() + 1) +
        "-" +
        new Date(step.date).getFullYear()
    ),
    datasets: [
      {
        label: "Steps",
        data: steps.map((step) => step.steps),
        fill: true,
        borderColor: "rgb(139 92 246)",
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
      className="w-full xl:p-12 flex justify-center items-center relative"
    >
      <Line data={data} options={options} />
    </div>
  );
};
export default StepsLineChart;
