import RenameFolderModal from "@/src/components/modals/RenameFolderModal";
import DeleteFolderModal from "@/src/components/modals/DeleteFolderModal";

export default function ModalAnchor() {
    return (
        <>
            <RenameFolderModal/>
            <DeleteFolderModal/>
        </>
    )
}