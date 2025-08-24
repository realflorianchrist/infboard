'use client'
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {Button} from "@workspace/ui/components/button";
import {cn} from "@workspace/ui/lib/utils";
import {ChangeEvent, DragEvent, useRef, useState} from "react";
import {FiUpload} from "react-icons/fi";
import {useUploadFiles} from "@/src/hooks/useUploadFiles";
import Loader from "../loader/Loader";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import {ErrorType} from "@workspace/types/src/apiResponses";
import ModalBreadCrumbs from "@/src/components/modals/ModalBreadCrumbs";
import {Input} from "@workspace/ui/components/input";
import {successMessage} from "@/src/utils/getSuccessMessage";
import {toast} from "sonner";

export default function UploadFileModal() {
    const {uploadFileModal, closeUploadFileModal} = useContextMenu();

    const {uploadFiles, isUploading} = useUploadFiles();

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [comment, setComment] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    const handleUploadFile = async () => {
        if (file === null) return;

        const results = await uploadFiles([{file, comment}], uploadFileModal.parentFolderId!);
        const failed = results.filter(r => r.status === 'error');
        const validationErrors = results.filter(r => r.validationErrors?.length);

        if (failed.length > 0) {
            if (validationErrors.length > 0) {
                const messages: string[] = [];
                validationErrors.forEach((r) => {
                    r.validationErrors?.forEach((e) => {
                        messages.push(getErrorMessage(e));
                    })
                })
                setErrorMessage(messages);
            } else {
                setErrorMessage([getErrorMessage(ErrorType.UPLOAD_ERROR)]);
            }
        } else {
            toast.success(successMessage.FILE_UPLOADED);
            close();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);

        setFile(files[0] ?? null);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.dataTransfer.files) return;

        const files = Array.from(e.dataTransfer.files);

        setFile(files[0] ?? null);
    };

    const openFilePicker = () => {
        inputRef.current?.click();
    };

    const close = () => {
        closeUploadFileModal();
        setFile(null);
        setComment('');
        setErrorMessage([]);
    }

    return (
        <Dialog open={uploadFileModal.open} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Datei hochladen</DialogTitle>
                </DialogHeader>

                <ModalBreadCrumbs parentFolderId={uploadFileModal.parentFolderId}/>

                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className={cn(
                        'flex flex-col gap-4 border border-dashed border-border rounded-md p-6 cursor-pointer justify-center items-center',
                        'hover:border-accent transition-colors text-muted-foreground'
                    )}
                    onClick={openFilePicker}
                >
                    {isUploading ? (
                        <Loader/>
                    ) : (
                        <>
                            <FiUpload className={'text-4xl'}/>
                            <p>Datei hierher ziehen oder klicken zum Auswählen</p>
                            <p className={'text-xs'}>
                                {file ? `"${file.name}" ausgewählt` : "Keine Datei ausgewählt"}
                            </p>
                            <input
                                ref={inputRef}
                                type="file"
                                hidden
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                </div>

                <Input
                    placeholder="Kommentar"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                {errorMessage.length > 0 && (
                    <ul className={'text-error whitespace-normal break-all'}>
                        {errorMessage.map((error, i) => (
                            <li key={i}>{error}</li>
                        ))}
                    </ul>
                )}

                <div className={"flex justify-end gap-2 mt-4"}>
                    <Button variant="secondary" onClick={close}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={handleUploadFile}
                        disabled={!file || isUploading}
                    >
                        Hochladen
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}