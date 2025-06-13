import { create } from "zustand";

interface bgImageStore {
  bgImage: string;
  setBgImage: (newImage: string) => void;
}

export const useBgImageStore = create<bgImageStore>((set) => ({
  bgImage: "/background/bg-1.jpg",
  setBgImage: (newImage: string) => set({ bgImage: newImage }),
}));
