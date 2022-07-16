/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

export const useDebounceSearch = (value: string = "", delay: number = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value]);

    return debouncedValue;
};
