import Exercise from "@/models/Exercise";

const ExerciseItem = ({ exercise }: { exercise: Exercise }) => {
  return (
    <div className="bg-rose-500 hover:bg-rose-600 font-bold text-neutral-900 p-5 rounded-md">
      <h2>{exercise.name}</h2>
    </div>
  );
};

export default ExerciseItem;
