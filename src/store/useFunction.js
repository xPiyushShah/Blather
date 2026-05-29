import { create } from "zustand";
import { axiosInstance } from "../libs/axiosInstance";

export const useFunction = create((set, get) => ({
    function: false,
    bgColor: "",
    starredMessageIds: [],
    isSelectedMessage: false,
    selectMsg: false,
    isSearchBox: false,
    isSeachingVal: false,
    SearchVal: [],

    setSelectMsg: () => {
        get().setSearchTerm("");
        set((state) => ({
            selectMsg: !state.selectMsg
        }));
    },
    setFunction: (func) => set({ function: func }),
    setSearchBox: () =>
        set((state) => ({
            isSearchBox: !state.isSearchBox,
        })),
    setSearchTerm: (val) => set({ searchTerm: val }),
    onGlobalSearch: async (val) => {
        // console.log("Searching for:", val);
        get().setSearchTerm(val);
        set({ isSeachingVal: true });
        try {
            const res = await axiosInstance.post("/auth/gSearch", { query: val, });
            const data = res.data;
            set({ SearchVal: data });
            // console.log("Search results:", data);
        } catch (error) {
            // console.error("Error occurred while searching:", error);
            set({ isSeachingVal: false })
        } finally {
            set({ isSeachingVal: false })
        }
    },
}));