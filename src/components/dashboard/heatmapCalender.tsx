import Log from "@/models/Log";

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
      1000 * 60 * 60 * 24 * (weeksToShow * 7 + endingDate.getDay())
  );
  const daysInMonth = weeksToShow * 7 + 1 + endingDate.getDay();
  const calenderGrid = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(startingDate);
    date.setDate(startingDate.getDate() + i);
    return date.toISOString().slice(0, 10);
  });
  const months = Math.ceil(weeksToShow / 4);
  const currentMonth = endingDate.getMonth();
  const startingMonth = startingDate.getMonth();
  const diff = currentMonth - months;
  const monthsArray = [];
  for (let i = startingMonth + 1; i <= currentMonth; i++) {
    monthsArray.push(numberToMonth[i]);
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex justify-center items-center">
        {monthsArray.map((month) => (
          <h4 className="md:text-base text-xs text-neutral-400 md:ml-16 ml-5">
            {month}
          </h4>
        ))}
      </div>
      <div className="flex w-full justify-center items-center">
        <div className="flex flex-col justify-around py-2 text-neutral-400 md:text-base text-xs mx-2 h-full">
          <h4 className="md:my-2 mb-1">Mon</h4>
          <h4 className="md:my-2 mb-1">Wed</h4>
          <h4 className="md:my-2">Fri</h4>
        </div>
        <div className="grid grid-flow-col grid-rows-7 md:gap-1 gap-0.5">
          {calenderGrid.map((day, index) => {
            const currentLog = logs.find((log) => {
              return new Date(log.date).toISOString().slice(0, 10) == day;
            });
            return (
              <div
                className={`md:w-4 md:h-4 w-2 h-2 md:rounded rounded-sm ${
                  !currentLog
                    ? "bg-neutral-600"
                    : "bg-rose-500 tooltip cursor-pointer"
                }`}
                data-title={
                  currentLog && `You logged ${currentLog.workoutName}`
                }
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeatmapCalender;
