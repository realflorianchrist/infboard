'use client'
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@workspace/ui/components/dialog";
import {Button} from "@workspace/ui/components/button";
import {cn} from "@workspace/ui/lib/utils";
import {Fragment, useRef, useState} from "react";
import {FiUpload} from "react-icons/fi";
import {useGetAllFolders} from "@/src/api/hooks/api_hooks/folderHooks";
import findPathInTree from "@/src/utils/findPathInTree";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@workspace/ui/components/breadcrumb";
import {useUploadFiles} from "@/src/hooks/uploadFiles";

export default function UploadFileModal() {
    const {uploadFileModal, closeUploadFileModal} = useContextMenu();

    const [files, setFiles] = useState<File[]>([]);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const {data} = useGetAllFolders();
    const path = findPathInTree(data?.folders ?? null, uploadFileModal?.parentFolderId);

    const {uploadFiles, isUploading} = useUploadFiles();

    const handleUploadFile = async () => {
        if (files.length === 0) return;

        const results = await uploadFiles(files, uploadFileModal.parentFolderId!);
        const failed = results.filter(r => r.status === 'error');

        if (failed.length > 0) {
            console.error("Fehler beim Upload folgender Dateien:", failed.map(f => f.file.name));
        } else {
            close();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFiles(Array.from(e.target.files));
    };

    const handleDrop = (e: React.DragEvent) => {
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
                </div>

                {isUploading ? (
                    <div>Loading...</div>
                ) : (
                    <div className={"flex justify-end gap-2 mt-4"}>
                        <Button variant="secondary" onClick={close}>
                            Abbrechen
                        </Button>
                        <Button onClick={handleUploadFile}>
                            Hochladen
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}