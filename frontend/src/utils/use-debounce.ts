import { useEffect, useState } from "react";

const useDebounce = (initialValue: string | number, debounce: number) => {
    const [value, setValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, debounce);

        return () => {
            clearTimeout(timeout);
        };
    }, [value, debounce]);

    return [debouncedValue, setValue];
}

export default useDebounce;