import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
	persist(
		(set) => ({
			user: null,

			setUser: (data) => set({ user: data }),

            clearUser: () => set({ user: null }),

			clearUser: () => set({ user: null }),
		}),
		{
			name: "user-data", // localStorage key
		}
	)
);

export default useUserStore;
