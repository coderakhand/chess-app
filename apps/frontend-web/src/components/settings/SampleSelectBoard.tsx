interface SampleSelectBoardProps {
  id: number;
  darkSquare: string;
  lightSquare: string;
  sampleBoardColor: {
    id: number;
    darkSquare: string;
    lightSquare: string;
  };
  setSampleBoardColor: React.Dispatch<
    React.SetStateAction<{
      id: number;
      darkSquare: string;
      lightSquare: string;
    }>
  >;
}

export default function SampleSelectBoard({
  id,
  darkSquare,
  lightSquare,
  sampleBoardColor,
  setSampleBoardColor,
}: SampleSelectBoardProps) {
  const isSelected = id === sampleBoardColor.id;

  return (
    <div
      className={`cursor-pointer}`}
      onClick={() =>
        setSampleBoardColor({
          id,
          darkSquare,
          lightSquare,
        })
      }
    >
      <SmallBoard
        isSelected={isSelected}
        darkSquare={darkSquare}
        lightSquare={lightSquare}
      />
    </div>
  );
}

interface SmallBoardProps {
  darkSquare: string;
  lightSquare: string;
  size?: string;
  isSelected?: boolean;
}

export function SmallBoard({
  darkSquare,
  lightSquare,
  size,
  isSelected,
}: SmallBoardProps) {
  return (
    <div
      style={{
        height: (size ?? "60") + "px",
        width: (size ?? "60") + "px",
      }}
      className={`grid grid-cols-2 grid-rows-2 ${isSelected ? "border-3 border-black" : ""} rounded-lg overflow-hidden`}
    >
      <div className={darkSquare}></div>
      <div className={lightSquare}></div>
      <div className={lightSquare}></div>
      <div className={darkSquare}></div>
    </div>
  );
}
