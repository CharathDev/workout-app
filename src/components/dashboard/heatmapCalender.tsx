import Log from "@/models/Log";
import { useRouter } from "next/navigation";

const HeatmapCalender = ({
  logs,
  weeksToShow,
}: {
  logs: Log[];
  weeksToShow: number;
}) => {
  const numberToMonth: Record<number, string> = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  };
  let endingDate = new Date();
  let startingDate = new Date(
    endingDate.getTime() -
      1000 * 60 * 60 * 24 * (weeksToShow * 7 - (7 - endingDate.getDay()))
  );
  const daysInMonth = weeksToShow * 7 + 1 - (7 - endingDate.getDay());
  const calenderGrid = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(startingDate);
    date.setDate(startingDate.getDate() + i);
    return date.toISOString().slice(0, 10);
  });
  const months = Math.ceil(weeksToShow / 4);
  const currentMonth = endingDate.getMonth();
  const startingMonth = startingDate.getMonth();
  const diff = currentMonth - months;
  const monthsArray: string[] = [];
  const router = useRouter();

  for (let i = 0; i < weeksToShow; i++) {
    let thisDate = new Date(
      startingDate.getTime() + 1000 * 60 * 60 * 24 * (i * 7)
    );
    // console.log(thisDate.getMonth() + " " + thisDate.getDate());
    if (monthsArray.includes(numberToMonth[thisDate.getMonth()])) {
      monthsArray.push(" ");
    } else {
      monthsArray.push(numberToMonth[thisDate.getMonth()]);
    }
  }

  // for (let i = startingMonth + 1; i <= currentMonth; i++) {
  //   monthsArray.push(numberToMonth[i]);
  // }

  return (
    <div className="flex flex-col w-full justify-center items-center xl:items-end">
      <div className="flex flex-col justify-center items-end">
        <div className="grid grid-flow-col gap-0.5 md:gap-1">
          {monthsArray.map((month, i) => (
            <h4
              className="md:text-xs text-xs text-neutral-400 md:w-4 w-2"
              key={i}
            >
              {month}
            </h4>
          ))}
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-around py-2 text-neutral-400 md:text-base text-xs mx-2 h-full">
            <h4 className="md:my-2 mb-1 text-xs">Mon</h4>
            <h4 className="md:my-2 mb-1 text-xs">Wed</h4>
            <h4 className="md:my-2 text-xs">Fri</h4>
          </div>
          <div className="grid grid-flow-col grid-rows-7 md:gap-1 gap-0.5">
            {calenderGrid.map((day, index) => {
              const currentLog = logs.find((log) => {
                return new Date(log.date).toISOString().slice(0, 10) == day;
              });
              return (
                <div
                  className={`md:w-4 md:h-4 w-2 h-2 md:rounded rounded-sm tooltip ${
                    !currentLog
                      ? "bg-neutral-600"
                      : "bg-rose-500 cursor-pointer"
                  }`}
                  data-title={`${day} ${
                    currentLog ? `: You logged ${currentLog.workoutName}` : ""
                  }`}
                  key={index}
                  onClick={() =>
                    currentLog &&
                    router.push(
                      `/user/logs/${currentLog.id}/${currentLog.workoutId}`
                    )
                  }
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapCalender;
