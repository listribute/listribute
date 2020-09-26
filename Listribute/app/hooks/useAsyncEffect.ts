import { DependencyList, useEffect } from "react";

// Call async function and apply result if not cancelled
const useAsyncEffect = <T>(
    asyncCall: () => Promise<T>,
    apply: (result: T) => void,
    deps?: DependencyList,
) => {
    useEffect(() => {
        let cancelled = false;

        asyncCall().then(result => {
            if (!cancelled) apply(result);
        });

        return () => {
            cancelled = true;
        };
    }, deps);
};

export default useAsyncEffect;
