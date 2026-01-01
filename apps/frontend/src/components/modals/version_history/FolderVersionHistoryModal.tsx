import React from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";

export default function FolderVersionHistoryModal() {

    const {folderVersionHistoryModal, closeFolderVersionHistoryModal} = useContextMenu();

    const close = () => {
        closeFolderVersionHistoryModal();
        // setErrorMessage([]);
    };

    return (
        <Dialog open={folderVersionHistoryModal.open} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ordner Änderungsverlauf</DialogTitle>
                </DialogHeader>

                Folder History
            </DialogContent>
        </Dialog>
    );
}

