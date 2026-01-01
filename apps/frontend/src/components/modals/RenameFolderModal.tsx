'use client';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@workspace/ui/components/dialog';
import {Input} from '@workspace/ui/components/input';
import {Button} from '@workspace/ui/components/button';
import {useContextMenu} from '@/src/providers/ContextMenuProvider';
import {useEffect, useState} from 'react';
import {useUpdateFolder} from "@/src/api/hooks/api_hooks/folderHooks";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import ModalBreadCrumbs from "@/src/components/modals/ModalBreadCrumbs";
import {ErrorType} from "@workspace/types";
import {toast} from "sonner";
import {successMessage} from "@/src/utils/getSuccessMessage";

export default function RenameFolderModal() {
    const {renameFolderModal, closeRenameFolderModal} = useContextMenu();
    const {mutate} = useUpdateFolder();

    const [newName, setNewName] = useState('');
    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    useEffect(() => {
        setNewName(renameFolderModal.folderName ?? '');
    }, [renameFolderModal.folderName]);

    const handleRename = () => {
        if (!renameFolderModal.folderId || !newName) return;

        mutate({folder: {id: renameFolderModal.folderId, name: newName}}, {
            onSuccess: () => {
                toast.success(successMessage.FOLDER_RENAMED);
                close();
            },
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
        })
    };

    const close = () => {
        closeRenameFolderModal();
        setErrorMessage([]);
    };

    return (
        <Dialog open={renameFolderModal.open} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ordner umbenennen</DialogTitle>
                </DialogHeader>

                <ModalBreadCrumbs parentFolderId={renameFolderModal.parentFolderId}/>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRename();
                    }}
                >
                    <Input
                        autoFocus
                        placeholder="Neuer Ordnername"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />

                    {errorMessage.length > 0 && (
                        <ul className={'text-error whitespace-normal break-all pt-2'}>
                            {errorMessage.map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="secondary" onClick={close}>
                            Abbrechen
                        </Button>
                        <Button type="submit" disabled={!newName.trim()}>
                            Speichern
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
