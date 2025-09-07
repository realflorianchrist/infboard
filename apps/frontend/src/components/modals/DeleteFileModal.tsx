'use client'
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {Button} from "@workspace/ui/components/button";
import {useDeleteFile} from "@/src/api/hooks/api_hooks/fileHooks";
import {toast} from "sonner";
import {successMessage} from "@/src/utils/getSuccessMessage";
import {ErrorType} from "@workspace/types";

export default function DeleteFileModal() {
    const {deleteFileModal, closeDeleteFileModal} = useContextMenu();

    const {mutate} = useDeleteFile();

    const handleDelete = () => {
        if (!deleteFileModal.fileId) return;

        mutate({id: deleteFileModal.fileId}, {
            onSuccess: () => {
                toast.success(successMessage.FILE_DELETED);
                closeDeleteFileModal();
            },
            onError: () => {
                toast.error(ErrorType.FILE_DELETION_FAILED);
            }
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