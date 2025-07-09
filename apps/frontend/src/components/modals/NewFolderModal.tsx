'use client'
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {Button} from "@workspace/ui/components/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@workspace/ui/components/breadcrumb";
import {Fragment, useState} from "react";
import {Input} from "@workspace/ui/components/input";
import findPathInTree from "@/src/utils/findPathInTree";
import {useCreateFolder, useGetAllFolders} from "@/src/api/hooks/folderHooks";

export default function NewFolderModal() {
    const {newFolderModal, closeNewFolderModal} = useContextMenu();
    const {mutate} = useCreateFolder();

    const {data} = useGetAllFolders();
    const path = findPathInTree(data?.folders ?? null, newFolderModal?.parentFolderId);

    const [name, setName] = useState('');


    const handleAddNewFolder = () => {

        mutate({name, parentFolderId: newFolderModal.parentFolderId});

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

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>Home</BreadcrumbItem>
                        {(path?.length ?? 0) > 0 && <BreadcrumbSeparator/>}
                        {path?.map((pathSegment, index) => (
                            <Fragment key={pathSegment.id}>
                                <BreadcrumbItem>
                                    <span>{pathSegment.name}</span>
                                </BreadcrumbItem>
                                {index < path?.length - 1 && <BreadcrumbSeparator/>}
                            </Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>

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