"use client";
import dynamic from "next/dynamic";
import "chart.js/auto";
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  {
    ssr: false,
  }
);

interface MuscleGroupCount {
  muscleGroupId: string;
  name: string;
  count: number;
}

const WorkoutDoughnutChart = ({
  muscleGroups,
}: {
  muscleGroups: MuscleGroupCount[];
}) => {
  const data = {
    labels: muscleGroups.map((muscleGroup) => muscleGroup.name),
    datasets: [
      {
        label: "Muscle Group",
        data: muscleGroups.map((muscleGroup) => muscleGroup.count),
        borderColor: [
          "rgb(236 72 153)",
          "rgb(34 197 94)",
          "rgb(249 115 22)",
          "rgb(168 85 247)",
          "rgb(6 182 212)",
          "rgb(139 92 246)",
          "rgb(99 102 241)",
          "rgb(14 165 233)",
          "rgb(16 185 129)",
          "rgb(20 184 166)",
          "rgb(217 70 239)",
          "rgb(239 68 68)",
          "rgb(245 158 11)",
          "rgb(132 204 22)",
          "rgb(59 130 246)",
        ],
        backgroundColor: [
          "rgb(236 72 153)",
          "rgb(34 197 94)",
          "rgb(249 115 22)",
          "rgb(168 85 247)",
          "rgb(6 182 212)",
          "rgb(139 92 246)",
          "rgb(99 102 241)",
          "rgb(14 165 233)",
          "rgb(16 185 129)",
          "rgb(20 184 166)",
          "rgb(217 70 239)",
          "rgb(239 68 68)",
          "rgb(245 158 11)",
          "rgb(132 204 22)",
          "rgb(59 130 246)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{ height: "800px" }}
      className="w-[90%] xl:p-6 flex justify-center items-center relative"
    >
      <Doughnut data={data} options={options} />
    </div>
  );
};
export default WorkoutDoughnutChart;
