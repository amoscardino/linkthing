import useMedia from "./useMedia";

const useDarkMode = () => useMedia(["(prefers-color-scheme: dark)"], [true], false);

export default useDarkMode;
