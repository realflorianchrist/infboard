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
import {useCreateFolder, useGetAllFolders, useUpdateFolder} from "@/src/api/hooks/api_hooks/folderHooks";
import findFolderPathById from "@/src/utils/findFolderPathById";
import Loader from "../loader/Loader";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import {useUpdateFile} from "@/src/api/hooks/api_hooks/fileHooks";
import ModalBreadCrumbs from "@/src/components/modals/ModalBreadCrumbs";

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
                e.validationErrors?.forEach((error) => {
                    messages.push(getErrorMessage(error));
                })
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