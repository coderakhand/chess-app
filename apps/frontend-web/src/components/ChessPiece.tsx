import { useDraggable } from "@dnd-kit/core";
import type { Square, PieceSymbol, Color } from "chess.js";

interface ChessPieceProps {
  square: {
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null;
  color: string | null;
  id: string;
  customClass?: string;
}

export default function ChessPiece({
  square,
  color,
  id,
  customClass,
}: ChessPieceProps) {
  const { setNodeRef, attributes, listeners, transform } = useDraggable({ id });

  const style = transform
    ? {
        transform:
          color === "b"
            ? `translate(${-transform.x}px, ${-transform.y}px)`
            : `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 10,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      id={id}
      {...attributes}
      {...listeners}
      style={style}
      className="text-3xl select-none cursor-grab"
    >
      {square?.type ? (
        <img
          src={`/${square?.color}${square?.type}.svg`}
          className={`${
            color !== null && color === "b" ? "rotate-180" : ""
          } ${customClass ?? "w-[60px]"}`}
        />
      ) : (
        ""
      )}
    </div>
  );
}
