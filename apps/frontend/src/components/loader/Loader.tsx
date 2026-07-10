import styles from "./Loader.module.css";
import {createPortal} from "react-dom";
import {useEffect, useRef, useState} from "react";


/**
 * Props for the Loader component.
 */
type Props = {
    active?: boolean;
    isFullScreen?: boolean;
    delay?: number;
    minDisplay?: number;
}

/**
 * Loader component with delayed appearance and minimum display duration.
 *
 * The loader appears after a configurable delay and stays visible for at least
 * the specified minimum display time. It can optionally render fullscreen
 * using a portal.
 */
export default function Loader(
    {
        active = true,
        isFullScreen,
        delay = 250,
        minDisplay = 400,
    }: Props) {

    const [visible, setVisible] = useState(false);
    const shownAtRef = useRef<number | null>(null);
    const delayTimeout = useRef<number | null>(null);
    const hideTimeout = useRef<number | null>(null);

    useEffect(() => {
        if (active) {
            delayTimeout.current = window.setTimeout(() => {
                setVisible(true);
                shownAtRef.current = Date.now();
            }, delay);
        } else {
            if (!visible) {
                if (delayTimeout.current !== null) {
                    clearTimeout(delayTimeout.current);
                }
                return;
            }

            const elapsed = Date.now() - (shownAtRef.current ?? 0);
            const remaining = Math.max(minDisplay - elapsed, 0);

            hideTimeout.current = window.setTimeout(() => {
                setVisible(false);
                shownAtRef.current = null;
            }, remaining);
        }

        return () => {
            if (delayTimeout.current !== null) {
                clearTimeout(delayTimeout.current);
            }
            if (hideTimeout.current !== null) {
                clearTimeout(hideTimeout.current);
            }
        };
    }, [active, delay, minDisplay, visible]);

    if (!visible) return null;

    const isClient =
        typeof window !== "undefined" &&
        typeof document !== "undefined";

    const content = (
        <div className={isFullScreen ? styles.fullScreen : styles.container}>
            <div className={styles.loader}/>
        </div>
    );

    if (isFullScreen && isClient) {
        return createPortal(content, document.body);
    }

    return content;
}
