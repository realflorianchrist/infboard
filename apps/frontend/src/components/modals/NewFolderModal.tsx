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
import {useCreateFolder, useGetAllFolders} from "@/src/api/hooks/api_hooks/folderHooks";
import findFolderPathById from "@/src/utils/findFolderPathById";
import Loader from "../loader/Loader";

export default function NewFolderModal() {
    const {newFolderModal, closeNewFolderModal} = useContextMenu();
    const {mutate, isPending: savingFolder} = useCreateFolder();

    const {data} = useGetAllFolders();
    const path = findFolderPathById(data?.folders ?? null, newFolderModal?.parentFolderId);

    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    const handleAddNewFolder = () => {

        mutate({name, parentFolderId: newFolderModal?.parentFolderId}, {
            onSuccess: () => close(),
            onError: (error) => {
                if (error.validationErrors) {
                    setErrorMessage(error.validationErrors);
                }
            }
        });
    };

    const close = () => {
        closeNewFolderModal();
        setName('');
        setErrorMessage([]);
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


                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleAddNewFolder();
                }}>
                    <Input
                        autoFocus
                        placeholder="Ordnername"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {errorMessage && (
                        <ul className={'text-red-700'}>
                            {errorMessage.map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                    )}

                    {savingFolder ? (
                        <Loader/>
                    ) : (
                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="secondary" onClick={close}>
                                Abbrechen
                            </Button>
                            <Button type="submit"
                                    disabled={!name.trim() || savingFolder}
                            >
                                Speichern
                            </Button>
                        </div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}