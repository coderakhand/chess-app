export default function PlayerCard({
  player,
  color,
  rating,
  time,
}: {
  player: string;
  color: string;
  rating: number;
  time: number | null;
}) {
  function formatTime(time: number | null) {
    if (time === null) return "3:00";
    const m = Math.floor(time / 3600);

    const s =
      Math.ceil((time / 60) % 60) === 60 ? 0 : Math.ceil((time / 60) % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  return (
    <div className="flex items-center w-full h-[40px]">
      <div className=" flex-grow px-[5px] h-full flex items-center gap-2">
        <img src="/chezz.png" alt="" className="w-[30px] rounded-sm" />
        <div>{player} </div>
        <div>{rating}</div>
      </div>
      <div
        className={`flex justify-end items-center px-[5px] h-[40px] w-[120px] ${color === "b" ? "text-white bg-black" : "text-black bg-white"} rounded-lg text-3xl`}
      >
        {formatTime(time)}
      </div>
    </div>
  );
}
