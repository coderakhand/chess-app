// import { useState } from "react";
// import { Chess } from "chess.js";
// import { INIT_GAME, MOVE, GAME_OVER } from "../config";
// import { useSocket } from "./useSocket";

// export const useChessBoard = () => {
//   const socket = useSocket();
//   const [chess, setChess] = useState(new Chess());
//   const [board, setBoard] = useState(chess.board());

//   if (!socket) return;

//   socket.onmessage = (e) => {
//     const message = JSON.parse(e.data);
//     switch (message.type) {
//       case INIT_GAME: {
//         setChess(new Chess());
//         setBoard(chess.board());
//         break;
//       }
//       case MOVE: {
//         const move = message.payload;
//         chess.move(move);
//         setBoard(chess.board());
//         break;
//       }
//       case GAME_OVER: {
//         chess.isGameOver();
//         break;
//       }
//     }
//   };

//   return {
//     chess,
//     setChess,
//     board,
//     setBoard,
//   };
// };
