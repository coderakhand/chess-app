import { useDroppable } from "@dnd-kit/core";
import { useGameInfoStore } from "../store/atoms";

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
  const playerColor = useGameInfoStore((state) => state.color);

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`relative w-full aspect-square ${color} flex justify-center items-center z-0`}
    >
      {playerColor === "w" && id.charAt(1) == "1" && (
        <AlphabetCoordinate coordinate={id.charAt(0)} />
      )}

      {playerColor === "w" && id.charAt(0) == "a" && (
        <NumbericCoordinate coordinate={id.charAt(1)} />
      )}

      {playerColor === "b" && id.charAt(1) == "8" && (
        <AlphabetCoordinate coordinate={id.charAt(0)} rotated={true} />
      )}

      {playerColor === "b" && id.charAt(0) == "h" && (
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
      className={`absolute right-0.5 -bottom-0.5 font-bold text-[10px] xsmd:text-sm text-[#4A4847]/60 ${rotated ? "rotate-180" : ""}`}
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
      className={`absolute w-full h-full flex justify-start items-start px-[2px] font-bold text-[10px] xsmd:text-sm text-[#4A4847]/60 ${rotated ? "rotate-180" : ""}`}
    >
      {coordinate}
    </div>
  );
}
