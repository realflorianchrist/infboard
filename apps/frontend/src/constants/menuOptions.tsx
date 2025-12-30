import {MdOutlineDeleteOutline, MdOutlineEdit, MdOutlineWorkHistory} from "react-icons/md";
import {IoArrowUndoOutline, IoDownloadOutline} from "react-icons/io5";
import {BsCheck2Square} from "react-icons/bs";
import {PiPlusBold} from "react-icons/pi";
import {FiUpload} from "react-icons/fi";
import {BiHide, BiShowAlt} from "react-icons/bi";

const className = 'flex gap-2 items-center justify-center';

const menuOptions = {
    newFolder: <div className={className}><PiPlusBold/>Neuer Ordner</div>,
    edit: <div className={className}><MdOutlineEdit/>Bearbeiten</div>,
    delete: <div className={className}><MdOutlineDeleteOutline/>Löschen</div>,
    unDelete: <div className={className}><IoArrowUndoOutline/>Löschen wiederrufen</div>,
    showDeletedFile: <div className={className}><BiShowAlt />Zeige gelöschte</div>,
    hideDeletedFile: <div className={className}><BiHide />Verstecke gelöschte</div>,
    showHistory: <div className={className}><MdOutlineWorkHistory />Änderungsverlauf</div>,
    download: <div className={className}><IoDownloadOutline/>Download</div>,
    uploadFile: <div className={className}><FiUpload/>Datei hochladen</div>,
    select: <div className={className}><BsCheck2Square/>Auswählen</div>,
}

export default menuOptions;