'use client'
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {Button} from "@workspace/ui/components/button";
import {useDeleteFolder} from "@/src/api/hooks/api_hooks/folderHooks";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {successMessage} from "@/src/utils/getSuccessMessage";
import {ErrorType} from "@workspace/types/src/apiResponses";

export default function DeleteFolderModal() {
    const {deleteFolderModal, closeDeleteFolderModal} = useContextMenu();

    const {mutate} = useDeleteFolder();

    const handleDelete = () => {
        if (!deleteFolderModal.folderId) return;

        mutate({id: deleteFolderModal.folderId}, {
            onSuccess: () => {
                toast.success(successMessage.FOLDER_DELETED);
                closeDeleteFolderModal();
            },
            onError: () => {
                toast.error(ErrorType.FOLDER_DELETION_FAILED);
            }
        });
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