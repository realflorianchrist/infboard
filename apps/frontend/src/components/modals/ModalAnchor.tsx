import RenameFolderModal from "@/src/components/modals/RenameFolderModal";
import DeleteFolderModal from "@/src/components/modals/DeleteFolderModal";
import NewFolderModal from "@/src/components/modals/NewFolderModal";
import UploadFileModal from "@/src/components/modals/UploadFileModal";

export default function ModalAnchor() {
    return (
        <>
            <NewFolderModal/>
            <UploadFileModal/>
            <RenameFolderModal/>
            <DeleteFolderModal/>
        </>
    )
}