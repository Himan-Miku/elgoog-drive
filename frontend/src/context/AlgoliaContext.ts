import { create } from "zustand";
import { SearchResults } from "@/components/Navbar";

interface IAlgoliaContext {
  query: string;
  setQuery: (q: string) => void;
  searchResults: SearchResults;
  setSearchResults: (sr: SearchResults) => void;
}

export const AlgoliaStore = create<IAlgoliaContext>()((set) => ({
  query: "",
  setQuery: (q: string) => set({ query: q }),
  searchResults: [],
  setSearchResults: (sr: SearchResults) => set({ searchResults: sr }),
}));
