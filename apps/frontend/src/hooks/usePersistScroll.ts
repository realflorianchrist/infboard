import {RefObject, useCallback, useLayoutEffect} from "react";
import {usePathname} from "next/navigation";

export const usePersistScroll = (
    ref: RefObject<HTMLElement | null>,
    key: string
) => {
    const pathname = usePathname();

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const saved = sessionStorage.getItem(key);
        if (saved == null) return;

        const top = Number(saved);
        if (!Number.isFinite(top)) return;

        requestAnimationFrame(() => {
            el.scrollTop = top;
            requestAnimationFrame(() => {
                el.scrollTop = top;
            });
        });
    }, [pathname, key, ref]);

    const onScroll = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        sessionStorage.setItem(key, String(el.scrollTop));
    }, [key, ref]);

    return { onScroll };
};