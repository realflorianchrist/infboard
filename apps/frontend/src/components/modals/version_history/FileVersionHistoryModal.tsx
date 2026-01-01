import React from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";

export default function FileVersionHistoryModal() {

    const {fileVersionHistoryModal, closeFileVersionHistoryModal} = useContextMenu();

    const close = () => {
        closeFileVersionHistoryModal();
        // setErrorMessage([]);
    };

    return (
        <Dialog open={fileVersionHistoryModal.open} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Datei Änderungsverlauf</DialogTitle>
                </DialogHeader>

                File History
            </DialogContent>
        </Dialog>
    );
}

