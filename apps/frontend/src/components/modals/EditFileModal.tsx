'use client'
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {useState} from "react";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import {useUpdateFile} from "@/src/api/hooks/api_hooks/fileHooks";
import ModalBreadCrumbs from "@/src/components/modals/ModalBreadCrumbs";
import {ErrorType} from "@workspace/types";

export default function EditFileModal() {
    const {editFileModal, closeEditFileModal} = useContextMenu();
    const {mutate, isPending: savingFolder} = useUpdateFile();

    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    const handleEditFile = () => {

        mutate({file: {id: editFileModal.fileId!, name}}, {
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
        closeEditFileModal();
        setName('');
        setErrorMessage([]);
    }

    return (
        <Dialog open={editFileModal.open} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Datei bearbeiten</DialogTitle>
                </DialogHeader>

                <ModalBreadCrumbs parentFolderId={editFileModal.parentFolderId}/>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleEditFile();
                }}>

                </form>
            </DialogContent>
        </Dialog>
    )
}