import RenameFolderModal from "@/src/components/modals/RenameFolderModal";
import DeleteFolderModal from "@/src/components/modals/DeleteFolderModal";
import NewFolderModal from "@/src/components/modals/NewFolderModal";
import UploadFileModal from "@/src/components/modals/UploadFileModal";
import DeleteFileModal from "@/src/components/modals/DeleteFileModal";
import EditFileModal from "@/src/components/modals/EditFileModal";

export default function ModalAnchor() {
    return (
        <>
            <NewFolderModal/>
            <UploadFileModal/>
            <RenameFolderModal/>
            <EditFileModal/>
            <DeleteFolderModal/>
            <DeleteFileModal/>
        </>
    )
}