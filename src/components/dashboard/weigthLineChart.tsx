"use client";
import dynamic from "next/dynamic";
import "chart.js/auto";
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

const WeightLineChart = ({ weights }: { weights: any[] }) => {
  const data = {
    labels: weights.map(
      (weight) =>
        new Date(weight.date).getDate() +
        "-" +
        (new Date(weight.date).getMonth() + 1) +
        "-" +
        new Date(weight.date).getFullYear()
    ),
    datasets: [
      {
        label: "Weights",
        data: weights.map((weight) => weight.weight),
        fill: true,
        borderColor: "rgb(244,63,94)",
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
export default WeightLineChart;
