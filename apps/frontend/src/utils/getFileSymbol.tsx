import {
    GoFile,
    GoFileCode,
    GoFileMedia,
    GoFileZip,
} from "react-icons/go";
import {FiFileText} from "react-icons/fi";
import {FaRegFileExcel, FaRegFilePdf, FaRegFilePowerpoint, FaRegFileWord} from "react-icons/fa";

export const getFileSymbol = (contentType?: string) => {
    if (!contentType) return <GoFile/>;

    if (contentType.startsWith("image/")) {
        return <GoFileMedia/>;
    }

    switch (contentType) {
        case "application/pdf":
            return <FaRegFilePdf/>;

        case "text/plain":
        case "text/csv":
            return <FiFileText/>;

        case "application/json":
            return <GoFileCode/>;

        case "application/zip":
        case "application/x-7z-compressed":
        case "application/x-rar-compressed":
            return <GoFileZip/>;

        // Word
        case "application/msword":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return <FaRegFileWord/>;

        // Excel
        case "application/vnd.ms-excel":
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            return <FaRegFileExcel/>;

        // PowerPoint
        case "application/vnd.ms-powerpoint":
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            return <FaRegFilePowerpoint/>;

        default:
            return <GoFile/>;
    }
};
