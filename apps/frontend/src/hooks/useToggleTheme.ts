import {useTheme} from "next-themes";

const useToggleTheme = () => {
    const {theme, setTheme} = useTheme();

    return () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
};

export default useToggleTheme;