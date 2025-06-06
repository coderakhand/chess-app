import { atom } from "recoil";

export const winnerAtom = atom<string | null>({
  key: "winnerAtom",
  default: null,
});
