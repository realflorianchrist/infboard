import {MdOutlineDeleteOutline, MdOutlineEdit, MdOutlineWorkHistory} from "react-icons/md";
import {IoArrowUndoOutline} from "react-icons/io5";
import {BsCheck2Square} from "react-icons/bs";
import {PiPlusBold} from "react-icons/pi";
import {FiDownload, FiUpload} from "react-icons/fi";
import {BiHide, BiShowAlt} from "react-icons/bi";

const className = 'flex gap-2 items-center justify-center';

const menuOptions = {
    newFolder: <span className={className}><PiPlusBold/>Neuer Ordner</span>,
    edit: <span className={className}><MdOutlineEdit/>Bearbeiten</span>,
    delete: <span className={className}><MdOutlineDeleteOutline/>Löschen</span>,
    unDelete: <span className={className}><IoArrowUndoOutline/>Löschen wiederrufen</span>,
    showDeletedFile: <span className={className}><BiShowAlt />Zeige gelöschte</span>,
    hideDeletedFile: <span className={className}><BiHide />Verstecke gelöschte</span>,
    showHistory: <span className={className}><MdOutlineWorkHistory />Änderungsverlauf</span>,
    download: <span className={className}><FiDownload />Download</span>,
    uploadFile: <span className={className}><FiUpload/>Datei hochladen</span>,
    select: <span className={className}><BsCheck2Square/>Auswählen</span>,
}

export default menuOptions;