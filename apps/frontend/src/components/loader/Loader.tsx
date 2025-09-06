import styles from "./Loader.module.css";
import {createPortal} from "react-dom";

export default function Loader(
    {
        isFullScreen,
    }: {
        isFullScreen?: boolean,
    }) {

    const isClient = typeof window !== "undefined" && typeof document !== "undefined";

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