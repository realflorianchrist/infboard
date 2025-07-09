'use client'
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {Button} from "@workspace/ui/components/button";
import {useFolderPath} from "@/src/providers/FolderPathProvider";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@workspace/ui/components/breadcrumb";
import {Fragment, useState} from "react";
import {Input} from "@workspace/ui/components/input";
import {FolderPath} from "@/src/components/FolderPath";

export default function NewFolderModal() {
    const {newFolderModal, closeNewFolderModal} = useContextMenu();

    const [name, setName] = useState('');


    const handleAddNewFolder = () => {

        // TODO: Call rename mutation or service function here

        close();
    };

    const close = () => {
        closeNewFolderModal();
        setName('');
    }

    return (
        <Dialog open={newFolderModal.open} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Neuer Ordner</DialogTitle>
                </DialogHeader>

                <FolderPath/>

                <Input
                    autoFocus
                    placeholder="Ordnername"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="secondary" onClick={close}>
                        Abbrechen
                    </Button>
                    <Button onClick={handleAddNewFolder}>
                        Speichern
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}