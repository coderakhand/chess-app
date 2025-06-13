import { create } from "zustand";

interface bgImageStore {
  bgImage: string;
  setBgImage: (newImage: string) => void;
}

export const useBgImageStore = create<bgImageStore>((set) => ({
  bgImage: "bg-[url(/background/bg-1.jpg)]",
  setBgImage: (newImage: string) => set({ bgImage: newImage }),
}));

interface BoardStore {
  darkSquare: string;
  lightSquare: string;
  pieces: string;
  setDarkSquare: (newDarkSquare: string) => void;
  setLightSquare: (newLightSquare: string) => void;
  setPieces: (newPieces: string) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  darkSquare: "",
  lightSquare: "",
  pieces: "normal",
  setDarkSquare: (newDarkSquare: string) => set({ darkSquare: newDarkSquare }),
  setLightSquare: (newLightSquare: string) =>
    set({ lightSquare: newLightSquare }),
  setPieces: (newPieces: string) => set({ pieces: newPieces }),
}));
