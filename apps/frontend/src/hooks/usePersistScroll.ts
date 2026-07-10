import {useCallback, useLayoutEffect, useRef} from "react";
import {usePathname} from "next/navigation";

export const usePersistScroll = (key: string) => {
    const ref = useRef<HTMLDivElement>(null);
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
    }, [pathname, key]);

    const onScroll = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        sessionStorage.setItem(key, String(el.scrollTop));
    }, [key]);

    return { ref, onScroll };
};