import { create } from "zustand";
import { persist } from "zustand/middleware";

const useHistoryStore = create(
    persist(
        (set) => ({
            history: null,

            setHistory: (data) => set({ history: data }),

            clearHistory: () => set({ history: null }),
        }),
        {
            name: "history-data", // localStorage key
        }
    )
);

export default useHistoryStore;
