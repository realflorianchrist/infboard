import RenameFolderModal from "@/src/components/modals/RenameFolderModal";
import DeleteFolderModal from "@/src/components/modals/DeleteFolderModal";
import NewFolderModal from "@/src/components/modals/NewFolderModal";
import UploadFileModal from "@/src/components/modals/UploadFileModal";
import DeleteFileModal from "@/src/components/modals/DeleteFileModal";
import EditFileModal from "@/src/components/modals/EditFileModal";
import FileVersionHistoryModal from "@/src/components/modals/version_history/FileVersionHistoryModal";
import FolderVersionHistoryModal from "@/src/components/modals/version_history/FolderVersionHistoryModal";

export default function ModalAnchor() {
    return (
        <>
            <NewFolderModal/>
            <UploadFileModal/>
            <RenameFolderModal/>
            <EditFileModal/>
            <DeleteFolderModal/>
            <DeleteFileModal/>
            <FileVersionHistoryModal/>
            <FolderVersionHistoryModal/>
        </>
    )
}