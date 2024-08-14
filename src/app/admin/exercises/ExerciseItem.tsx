import Exercise from "@/models/Exercise";
import Link from "next/link";

const ExerciseItem = ({ exercise }: { exercise: Exercise }) => {
  return (
    <Link href={`/admin/exercises/${exercise.id}`}>
      <div className="bg-rose-500 hover:bg-rose-600 font-bold text-neutral-900 p-5 rounded-md">
        <h2>{exercise.name}</h2>
      </div>
    </Link>
  );
};

export default ExerciseItem;
