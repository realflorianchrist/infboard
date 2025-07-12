'use client'
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {Button} from "@workspace/ui/components/button";
import {useDeleteFile} from "@/src/api/hooks/api_hooks/fileHooks";

export default function DeleteFileModal() {
    const {deleteFileModal, closeDeleteFileModal} = useContextMenu();

    const {mutate} = useDeleteFile();

    const handleDelete = () => {
        if (!deleteFileModal.fileId) return;

        mutate({id: deleteFileModal.fileId, parentFolderId: deleteFileModal.parentFolderId ?? 'root'}, {
            onSuccess: () => closeDeleteFileModal()
        });
    };

    return (
        <Dialog open={deleteFileModal.open} onOpenChange={closeDeleteFileModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Datei wirklich Löschen?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Die Datei wird nicht dauerhaft gelöscht!
                </DialogDescription>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="secondary" onClick={closeDeleteFileModal}>
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