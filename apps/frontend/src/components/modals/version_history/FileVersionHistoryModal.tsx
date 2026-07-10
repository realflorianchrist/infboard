import React from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {FileChangeEvent} from "@workspace/types";


const history: FileChangeEvent[] = [
    {
        version: 1,
        updatedAt: new Date(),
        updatedBy: 'admin',
        reason: 'create',
        changes: [{
            field: "name",
            from: 'depa',
            to: 'test'
        }],
    }, {
        version: 2,
        updatedAt: new Date(),
        updatedBy: 'admin',
        reason: 'update',
        changes: [{
            field: "deleted",
            from: false,
            to: true
        }],
    }
]

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

