import { create } from "zustand";

interface ISidebarContext {
  showSidebar: boolean;
  setShowSidebar: (b: boolean) => void;
}

export const SidebarStore = create<ISidebarContext>()((set) => ({
  showSidebar: false,
  setShowSidebar: (b: boolean) => set({ showSidebar: b }),
}));
