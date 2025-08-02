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
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import ModalBreadCrumbs from "@/src/components/modals/ModalBreadCrumbs";
import {ErrorType} from "@workspace/types/apiResponses";

export default function NewFolderModal() {
    const {newFolderModal, closeNewFolderModal} = useContextMenu();
    const {mutate, isPending: savingFolder} = useCreateFolder();

    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    const handleAddNewFolder = () => {

        mutate({name, parentFolderId: newFolderModal?.parentFolderId}, {
            onSuccess: () => close(),
            onError: (e) => {
                const messages: string[] = [];
                if (e.errorType === ErrorType.VALIDATION_ERROR) {
                    e.validationErrors?.forEach((error) => {
                        messages.push(getErrorMessage(error));
                    });
                } else {
                    messages.push(getErrorMessage(e.errorType));
                }
                setErrorMessage(messages);
            },
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

                <ModalBreadCrumbs parentFolderId={newFolderModal.parentFolderId} />

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

                    {errorMessage.length > 0 && (
                        <ul className={'text-error whitespace-normal break-all pt-2'}>
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