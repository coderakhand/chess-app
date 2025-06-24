import { useState } from "react";
import type { Square, PieceSymbol, Color } from "chess.js";
import { RxCross2 } from "react-icons/rx";
import {
  DndContext,
  useDroppable,
  useDraggable,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { useBoardStore, useGameInfoStore } from "../store/atoms";

interface ChessBoardProps {
  socket: WebSocket | null;
  winner: string | null;

  customClass?: string;
}

export default function ChessBoard({
  socket,
  winner,
  customClass,
}: ChessBoardProps) {
  const color = useGameInfoStore((state) => state.color);
  const chess = useGameInfoStore((state) => state.chess);
  const board = useGameInfoStore((state) => state.board);
  const setBoard = useGameInfoStore((state) => state.setBoard);
  const lightSquare = useBoardStore((state) => state.lightSquare);
  const darkSquare = useBoardStore((state) => state.darkSquare);

  const [source, setSource] = useState<string | null>(null);

  const setMoves = useGameInfoStore((state) => state.setMoves);

  const handleMovement = (
    i: number,
    j: number,
    square: {
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null
  ) => {
    const cellCode = String.fromCharCode(97 + (j % 8)) + (8 - i);
    if (source === null) {
      if (square === null) return;
      if (square.color != color) return;
      setSource(cellCode);
    } else {
      if (socket === null) {
        setSource(null);
        return;
      }

      const move = {
        from: source,
        to: cellCode,
      };

      setSource(null);
      try {
        chess.move(move);
      } catch {
        return;
      }

      setBoard(chess.board());
      setMoves(move);
      socket.send(
        JSON.stringify({
          type: "move",
          payload: move,
        })
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const from = event.active.id as string;
    const to = event.over?.id as string;
    if (!to || from === to) return;
    if (color === null || color !== chess.turn()) return;
    const move = { from, to };

    if (chess.move(move)) {
      setBoard(chess.board());
      if (socket === null) return;
      setMoves(move);
      socket.send(
        JSON.stringify({
          type: "move",
          payload: move,
        })
      );
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToFirstScrollableAncestor]}
    >
      <div
        className={`${
          color !== null ? (color === "b" ? "rotate-180" : "") : ""
        } relative ${customClass ?? "w-[600px] h-[600px]"} grid grid-rows-8`}
      >
        {winner !== null ? <GameResultCard winner={winner} /> : <></>}
        {board.map((row, i) => {
          return (
            <div key={i} className="grid grid-cols-8">
              {row.map((square, j) => {
                const cellCode = String.fromCharCode(97 + (j % 8)) + (8 - i);

                return (
                  <DroppableSquare
                    key={j}
                    id={cellCode}
                    onClick={() => handleMovement(i, j, square)}
                    color={(i + j) % 2 !== 0 ? darkSquare : lightSquare}
                  >
                    {square !== null ? (
                      <ChessPiece square={square} color={color} id={cellCode} />
                    ) : null}
                  </DroppableSquare>
                );
              })}
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}

export function GameResultCard({ winner }: { winner: string }) {
  const [close, setClose] = useState(false);
  if (close) return <></>;
  return (
    <div className="absolute inset-x-[150px] inset-y-[165px] w-[280px] h-[250px] text-white bg-[#262421] rounded-xl shadow-2xl border border-[#3C3A36]">
      <RxCross2
        onClick={() => setClose(true)}
        className="absolute top-[5px] right-[3px] rounded-full text-xl text-white cursor-pointer"
      />
      <div className="flex flex-col justify-center items-center bg-[#3C3A36] h-[80px] rounded-t-xl">
        <div className="text-3xl font-bold">
          {winner === "w" ? "White Wins" : "Black Wins"}
        </div>
        <div className="text-sm">By CheckMate</div>
      </div>
    </div>
  );
}

interface DroppableProps {
  id: string;
  children: React.ReactNode;
  onClick: () => void;
  color: string;
}

function DroppableSquare({ id, children, onClick, color }: DroppableProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`w-full ${color} flex justify-center items-center`}
    >
      {children}
    </div>
  );
}

interface ChessPieceProps {
  square: {
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null;
  color: string | null;
  id: string;
}

function ChessPiece({ square, color, id }: ChessPieceProps) {
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
          } w-[60px]`}
        />
      ) : (
        ""
      )}
    </div>
  );
}
