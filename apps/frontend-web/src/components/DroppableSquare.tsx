import { useDroppable } from "@dnd-kit/core";
import { useGameInfoStore, useUserSettings } from "../store/atoms";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
  onClick: () => void;
  color: string;
}

export default function DroppableSquare({
  id,
  children,
  onClick,
  color,
}: DroppableProps) {
  const { setNodeRef } = useDroppable({ id });
  const flipBoard = useGameInfoStore((state) => state.flipBoard);
  const moves = useGameInfoStore((state) => state.moves);
  const showPositionAtMovesIndex = useGameInfoStore(
    (state) => state.showPositionAtMovesIndex
  );
  
  const showBoardCoordinates = useUserSettings(
    (state) => state.showBoardCoordinates
  );

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      onTouchMove={onClick}
      className={`relative w-full aspect-square ${color} flex justify-center items-center z-0`}
    >
      {showPositionAtMovesIndex !== null &&
        (id == moves[showPositionAtMovesIndex]?.from ||
          id == moves[showPositionAtMovesIndex]?.to) && (
          <div
            className={`absolute bg-yellow-300/50 blur-xs h-full w-full inset-0 overflow-hidden`}
          />
        )}

      {showBoardCoordinates && !flipBoard && id.charAt(1) == "1" && (
        <AlphabetCoordinate coordinate={id.charAt(0)} />
      )}

      {showBoardCoordinates && !flipBoard && id.charAt(0) == "a" && (
        <NumbericCoordinate coordinate={id.charAt(1)} />
      )}

      {showBoardCoordinates && flipBoard && id.charAt(1) == "8" && (
        <AlphabetCoordinate coordinate={id.charAt(0)} rotated={true} />
      )}

      {showBoardCoordinates && flipBoard && id.charAt(0) == "h" && (
        <NumbericCoordinate coordinate={id.charAt(1)} rotated={true} />
      )}
      {children}
    </div>
  );
}

function AlphabetCoordinate({
  coordinate,
  rotated,
}: {
  coordinate: string;
  rotated?: boolean;
}) {
  return (
    <div
      className={`absolute font-proza font-bold text-[10px] xsmd:text-sm text-[#4A4847]/60 ${rotated ? "rotate-180 left-0.5 -top-0.5" : "right-0.5 -bottom-0.5"}`}
    >
      {coordinate}
    </div>
  );
}

function NumbericCoordinate({
  coordinate,
  rotated,
}: {
  coordinate: string;
  rotated?: boolean;
}) {
  return (
    <div
      className={`absolute w-full h-full flex justify-start items-start px-[2px] font-proza font-bold text-[10px] xsmd:text-sm text-[#4A4847]/60 ${rotated ? "rotate-180" : ""}`}
    >
      {coordinate}
    </div>
  );
}
