export default function PlayerCard({
  player,
  color,
  rating,
  time,
  imageUrl,
  title,
}: {
  player: string;
  color: string;
  rating?: number;
  time?: number | null;
  imageUrl?: string;
  title?: string;
}) {
  function formatTime(time: number | null) {
    if (time === null) return "3:00";

    const totalSeconds =
      time % 1000 >= 500 ? Math.ceil(time / 1000) : Math.floor(time / 1000);

    const minutes = Math.floor(totalSeconds / 60);

    const seconds =
      totalSeconds % 60 >= 30
        ? Math.ceil(totalSeconds % 60)
        : Math.floor(totalSeconds % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    <div className="flex items-center w-full h-[40px]">
      <div className=" flex-grow px-[5px] h-full flex items-center gap-2">
        <img
          src={`${imageUrl ?? "/chezz.png"}`}
          alt=""
          className="w-[30px] rounded-sm"
        />
        {title && (
          <div className={`flex justify-center items-center bg-[#7B2929] h-4 rounded-xs`}>
            <p className="text-white text-xs p-0.5">{title}</p>
          </div>
        )}
        <div className={`dark:text-white`}>{player} </div>
        <div
          className={`text-xs px-1 rounded-sm text-white bg-black dark:bg-white dark:text-black`}
        >
          {rating}
        </div>
      </div>
      {time ? (
        <div
          className={`flex justify-end items-center px-[5px] h-[40px] w-[120px] ${color === "b" ? "text-white bg-black" : "text-black bg-white"} rounded-lg text-3xl`}
        >
          {formatTime(time)}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
