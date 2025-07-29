import styles from "./Loader.module.css";

export default function Loader(
    {
        isFullScreen,
    }: {
        isFullScreen?: boolean,
    }) {

    return (
        <div className={isFullScreen ? styles.fullScreen : styles.container}>
            <div className={styles.loader}/>
        </div>
    )
}