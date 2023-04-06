import { useEffect, useState } from "react";

// From https://usehooks.com/useMedia

const useMedia = <T>(queries: string[], values: T[], defaultValue: T) => {
    const mediaQueryLists = queries.map((q) => window.matchMedia(q));

    const getValue = () => {
        const index = mediaQueryLists.findIndex((mql) => mql.matches);

        return values?.[index] || defaultValue;
    };

    const [value, setValue] = useState<T>(getValue);

    useEffect(() => {
        const handler = () => setValue(getValue);
        mediaQueryLists.forEach((mql) => mql.addListener(handler));
        return () => mediaQueryLists.forEach((mql) => mql.removeListener(handler));
    }, []);

    return value;
};

export default useMedia;
