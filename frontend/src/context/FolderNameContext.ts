import { create } from "zustand";

interface FolderName {
  folName: string;
  setFolName: (folName: string) => void;
}

export const FolderNameStore = create<FolderName>()((set) => ({
  folName: "",
  setFolName: (folName: string) => set({ folName }),
}));
