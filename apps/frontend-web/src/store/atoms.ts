import { create } from "zustand";
import { boardColorsList } from "../config";
import { Chess, type Square, type PieceSymbol, type Color } from "chess.js";

interface BoardStoreType {
  darkSquare: string;
  lightSquare: string;
  pieces: string;
  setDarkSquare: (newDarkSquare: string) => void;
  setLightSquare: (newLightSquare: string) => void;
  setPieces: (newPieces: string) => void;
}

export const useBoardStore = create<BoardStoreType>((set) => ({
  darkSquare: boardColorsList[0].darkSquare,
  lightSquare: boardColorsList[0].lightSquare,
  pieces: "normal",
  setDarkSquare: (newDarkSquare: string) => set({ darkSquare: newDarkSquare }),
  setLightSquare: (newLightSquare: string) =>
    set({ lightSquare: newLightSquare }),
  setPieces: (newPieces: string) => set({ pieces: newPieces }),
}));

interface UserInfoType {
  isGuest: boolean;
  id: string;
  username: string;
  email: string;
  ratings: {
    bullet: number;
    blitz: number;
    rapid: number;
  };
}
interface UserInfoStoreType {
  userInfo: UserInfoType;
  setUserInfo: (newUserInfo: UserInfoType) => void;
}

export const useUserInfoStore = create<UserInfoStoreType>((set) => ({
  userInfo: {
    isGuest: true,
    id: "",
    username: "Guest",
    email: "",
    ratings: {
      bullet: 800,
      rapid: 800,
      blitz: 800,
    },
  },
  setUserInfo: (newUserInfo: UserInfoType) => set({ userInfo: newUserInfo }),
}));

interface timeControlType {
  name: string;
  baseTime: number;
  increment: number;
}
interface gameInfoStoreType {
  chess: Chess;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  gameStatus: string | null;
  moves: { from: string; to: string }[];
  color: string;
  opponentInfo: { username: string; rating: number };
  timeControl: timeControlType;
  opponentTimeLeft: number | null;
  timeLeft: number | null;
  gameCreationTime: number | null;
  setChess: (newChess: Chess) => void;
  setBoard: (
    newBoard: ({
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null)[][]
  ) => void;
  setGameStatus: (newGameStatus: string) => void;
  setMoves: (newMove: { from: string; to: string }) => void;
  setColor: (newColor: string) => void;
  setOpponentInfo: (newOpponentInfo: {
    username: string;
    rating: number;
  }) => void;
  setTimeControl: (newTimeControl: timeControlType) => void;
  setOpponentTimeLeft: (newOpponentTimeLeft: number) => void;
  setTimeLeft: (newTimeLeft: number) => void;
  setGameCreationTime: (newGameCreationTime: number) => void;
}

export const useGameInfoStore = create<gameInfoStoreType>((set) => ({
  chess: new Chess(),
  board: new Chess().board(),
  gameStatus: null,
  moves: [],
  color: "w",
  opponentInfo: { username: "Opponent", rating: 800 },
  timeControl: { name: "BULLET", baseTime: 1 * 60 * 1000, increment: 2 * 1000 },
  opponentTimeLeft: 1 * 60 * 1000,
  timeLeft: 1 * 60 * 1000,
  gameCreationTime: null,

  setChess: (newChess: Chess) => set({ chess: newChess }),
  setBoard: (
    newBoard: ({
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null)[][]
  ) => set({ board: newBoard }),

  setGameStatus: (newGameStatus: string) => set({ gameStatus: newGameStatus }),

  setMoves: (newMove: { from: string; to: string }) =>
    set((state) => ({ moves: [...state.moves, newMove] })),

  setColor: (newColor: string) => set({ color: newColor }),

  setOpponentInfo: (newOpponentInfo: { username: string; rating: number }) =>
    set({ opponentInfo: newOpponentInfo }),

  setTimeControl: (newTimeControl: timeControlType) =>
    set({ timeControl: newTimeControl }),

  setOpponentTimeLeft: (newOpponentTimeLeft: number) =>
    set({ opponentTimeLeft: newOpponentTimeLeft }),

  setTimeLeft: (newTimeLeft: number) => set({ timeLeft: newTimeLeft }),

  setGameCreationTime: (newGameCreationTime: number) =>
    set({ gameCreationTime: newGameCreationTime }),
}));
