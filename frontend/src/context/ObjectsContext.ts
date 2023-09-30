import { create } from "zustand";

interface IObject {
  objectNames: Array<string>;
  setObjectNames: (objectNames: Array<string>) => void;
}

export const objectNamesStore = create<IObject>()((set) => ({
  objectNames: [],
  setObjectNames: (objectNames: Array<string>) => set({ objectNames }),
}));
