"use client";
import dynamic from "next/dynamic";
import "chart.js/auto";
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

interface ExerciseCount {
  exerciseId: string;
  name: string;
  totalSets: number;
}

const TopExercisesChart = ({ exercises }: { exercises: ExerciseCount[] }) => {
  const finalExercises = exercises.filter((exercise, i) => i < 5);

  const data = {
    labels: finalExercises.map((exercise) => exercise.name),
    datasets: [
      {
        label: "Top Exercises",
        barThickness: 50,
        maxBarThickness: 200,
        minBarLength: 2,
        data: finalExercises.map((exercise) => exercise.totalSets),
        fill: true,
        backgroundColor: "rgb(244 63 94)",
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
      className="w-[90%] xl:p-12 flex justify-center items-center relative bg-rose"
    >
      <Bar data={data} options={options} />
    </div>
  );
};
export default TopExercisesChart;
