'use client'
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {Button} from "@workspace/ui/components/button";

export default function DeleteFolderModal() {
    const {deleteFolderModal, closeDeleteFolderModal} = useContextMenu();

    const handleDelete = () => {
        if (!deleteFolderModal.folderId) return;

        // TODO: Call rename mutation or service function here
        console.log('Deleted folder', deleteFolderModal.folderId);

        closeDeleteFolderModal();
    };

    return (
        <Dialog open={deleteFolderModal.open} onOpenChange={closeDeleteFolderModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ordner wirklich Löschen?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Es werden alle Daten gelöscht!
                </DialogDescription>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="secondary" onClick={closeDeleteFolderModal}>
                        Abbrechen
                    </Button>
                    <Button onClick={handleDelete}>
                        Löschen
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}