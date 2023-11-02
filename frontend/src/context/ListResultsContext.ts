import { firestoreData } from "@/components/NewItem";
import { create } from "zustand";

interface IListResultData {
  listResults: Array<firestoreData>;
  setListResults: (r: Array<firestoreData>) => void;
}

export const ListResultsStore = create<IListResultData>()((set) => ({
  listResults: [],
  setListResults: (r: Array<firestoreData>) => set({ listResults: r }),
}));
