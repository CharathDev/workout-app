import Exercise from "@/models/Exercise";
import Link from "next/link";

const ExerciseItem = ({ exercise }: { exercise: Exercise }) => {
  return (
    <Link href={`/admin/exercises/${exercise.id}`}>
      <div
        className="bg-neutral-800 hover:ring-2 hover:ring-rose-500 text-grey-300 p-5 rounded-md tooltip h-full flex justify-center items-center"
        data-title="View More"
      >
        <h2>{exercise.name}</h2>
      </div>
    </Link>
  );
};

export default ExerciseItem;
