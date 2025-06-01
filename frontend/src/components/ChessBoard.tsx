import { useState } from "react";
import type { Square, PieceSymbol, Color, Chess } from "chess.js";
import { RxCross2 } from "react-icons/rx";

export default function ChessBoard({
  socket,
  chess,
  board,
  setBoard,
  color,
  winner,
}: {
  socket: WebSocket | null;
  chess: Chess;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  setBoard: React.Dispatch<
    React.SetStateAction<
      ({
        square: Square;
        type: PieceSymbol;
        color: Color;
      } | null)[][]
    >
  >;
  setChess?: React.Dispatch<React.SetStateAction<Chess>>;
  color: string | null;
  winner: string | null;
}) {
  const [source, setSource] = useState<string | null>(null);

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
      socket.send(
        JSON.stringify({
          type: "move",
          payload: move,
        })
      );
    }
  };

  return (
    <div className="relative w-[580px] h-[580px] grid grid-rows-8">
      {winner !== null ? <GameResultCard winner={winner} /> : <></>}
      {board.map((row, i) => {
        return (
          <div key={i} className="grid grid-cols-8">
            {row.map((square, j) => {
              return (
                <div
                  onClick={() => handleMovement(i, j, square)}
                  key={j}
                  className={`w-full ${
                    (i + j) % 2 !== 0 ? "bg-[#8CA2AD]" : "bg-[#DEE3E6]"
                  }  flex justify-center items-center`}
                >
                  {square?.type ? (
                    <img
                      src={`/${square?.color}${square?.type}.svg`}
                      className="w-[60px]"
                    />
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
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
