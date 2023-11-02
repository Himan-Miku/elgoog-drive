import { firestoreData } from "@/components/NewItem";
import { create } from "zustand";

interface IStarredResultData {
  starredResults: Array<firestoreData>;
  setStarredResults: (r: Array<firestoreData>) => void;
}

export const StarredResultsStore = create<IStarredResultData>()((set) => ({
  starredResults: [],
  setStarredResults: (r: Array<firestoreData>) => set({ starredResults: r }),
}));
