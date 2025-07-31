import {MdOutlineDeleteOutline, MdOutlineEdit} from "react-icons/md";
import {IoDownloadOutline} from "react-icons/io5";
import {BsCheck2Square} from "react-icons/bs";
import {PiPlusBold} from "react-icons/pi";
import {FiUpload} from "react-icons/fi";

const className = 'flex gap-2 items-center justify-center';

const menuOptions = {
    newFolder: <div className={className}><PiPlusBold />Neuer Ordner</div>,
    rename: <div className={className}><MdOutlineEdit/>Umbenennen</div>,
    delete: <div className={className}><MdOutlineDeleteOutline/>Löschen</div>,
    download: <div className={className}><IoDownloadOutline/>Download</div>,
    uploadFile: <div className={className}><FiUpload />Datei hochladen</div>,
    select: <div className={className}><BsCheck2Square/>Auswählen</div>,
}

export default menuOptions;