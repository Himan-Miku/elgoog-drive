import { firestoreData } from "@/components/NewItem";
import { create } from "zustand";

interface IMyDriveData {
  results: Array<firestoreData>;
  setResults: (r: Array<firestoreData>) => void;
}

export const ResultsStore = create<IMyDriveData>()((set) => ({
  results: [],
  setResults: (r: Array<firestoreData>) => set({ results: r }),
}));
