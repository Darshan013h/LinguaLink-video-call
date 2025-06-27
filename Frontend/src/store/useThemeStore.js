import { create } from 'zustand'

// the inside object will accessible as global object
export const useThemeStore = create((set) => ({ 
    theme: localStorage.getItem("streamy-Theme") || "coffee",
    setTheme : (theme) => {
        localStorage.setItem("streamy-Theme",theme)
        set({theme})},
}))

// we are using localStorage here because we want to rember the theme 
// selected my user and stay in that theme itself and not jump on default