'use client'
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {Button} from "@workspace/ui/components/button";
import {cn} from "@workspace/ui/lib/utils";
import {ChangeEvent, DragEvent, Fragment, useRef, useState} from "react";
import {FiUpload} from "react-icons/fi";
import {useGetAllFolders} from "@/src/api/hooks/api_hooks/folderHooks";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@workspace/ui/components/breadcrumb";
import {useUploadFiles} from "@/src/hooks/useUploadFiles";
import Loader from "../loader/Loader";
import findFolderPathById from "@/src/utils/findFolderPathById";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import {ErrorType} from "@workspace/types/apiResponses";

export default function UploadFileModal() {
    const {uploadFileModal, closeUploadFileModal} = useContextMenu();

    const {uploadFiles, isUploading} = useUploadFiles();
    const {data} = useGetAllFolders();
    const path = findFolderPathById(data?.folders, uploadFileModal?.parentFolderId);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [files, setFiles] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    const handleUploadFile = async () => {
        if (files.length === 0) return;

        const results = await uploadFiles(files, uploadFileModal.parentFolderId!);
        const successful = results.filter(result => result.status === "success");
        const failed = results.filter(r => r.status === 'error');
        const validationErrors = results.filter(r => r.validationErrors?.length);

        if (successful.length > 0) {
            setFiles((f) => f.filter((v) => successful.some(s => s.file.name === v.name)))
        }

        if (failed.length > 0) {
            if (validationErrors.length > 0) {
                const messages: string[] = [];
                validationErrors.forEach((r) => {
                    r.validationErrors?.forEach((e) => {
                        messages.push(`${r.file.name}: ${getErrorMessage(e)}`);
                    })
                })
                setErrorMessage(messages);
            } else {
                setErrorMessage([getErrorMessage(ErrorType.UPLOAD_ERROR)]);
            }
        } else {
            close();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFiles(Array.from(e.target.files));
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            setFiles(Array.from(e.dataTransfer.files));
        }
    };

    const openFilePicker = () => {
        inputRef.current?.click();
    };

    const close = () => {
        closeUploadFileModal();
        setFiles([]);
        setErrorMessage([]);
    }

    return (
        <Dialog open={uploadFileModal.open} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Datei hochladen</DialogTitle>
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
                            <p>Dateien hierher ziehen oder klicken zum Auswählen</p>
                            <p className={'text-xs'}>
                                {files.length > 0 ? `${files.length} Datei(en) ausgewählt` : "Keine Datei ausgewählt"}
                            </p>
                            <input
                                ref={inputRef}
                                type="file"
                                multiple
                                hidden
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                </div>

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
                        disabled={files.length === 0 || isUploading}
                    >
                        Hochladen
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}