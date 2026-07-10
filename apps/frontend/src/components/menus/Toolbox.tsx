'use client'
import {Button} from "@workspace/ui/components/button";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import menuOptions from "@/src/constants/menuOptions";
import {useDownloadFile} from "@/src/hooks/useDownloadFile";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import {isFileMeta, isFolder} from "@workspace/types";
import Loader from "@/src/components/loader/Loader";
import {useDndMonitor} from "@dnd-kit/core";
import {useState} from "react";
import {useHasFolderDeletedFiles} from "@/src/api/hooks/api_hooks/folderHooks";

export default function Toolbox() {

    const [isDragging, setIsDragging] = useState(false);


    useDndMonitor({
        onDragStart() {
            setIsDragging(true);
        },
        onDragCancel() {
            setIsDragging(false);
        },
        onDragEnd() {
            setIsDragging(false);
        }
    });

    const {
        includeDeleted,
        setIncludeDeleted,
        openNewFolderModal,
        isSelectMode,
        selected,
        openUploadFileModal,
    } = useContextMenu();

    const {downloadFile, downloadFiles, isDownloading} = useDownloadFile();

    const {folderId} = useFolderPath();
    const {data} = useHasFolderDeletedFiles(folderId);
    const hasFolderDeletedFiles = data?.hasDeletedFiles;

    return (
        <>
            <Loader active={isDownloading} isFullScreen={true}/>

            <div className={'flex gap-2'}>
                {isSelectMode && !isDragging && (
                    <Button
                        variant={'secondary'}
                        onClick={async () => {
                            if (selected.length === 1 && selected[0] && isFileMeta(selected[0])) {
                                await downloadFile(selected[0].id);
                            } else if (selected.length >= 1) {

                                const fileIds = selected.filter(isFileMeta).map(file => file.id);
                                const folderIds = selected.filter(isFolder).map(folder => folder.id);

                                await downloadFiles({fileIds, folderIds});
                            }
                        }}
                    >
                        {menuOptions.download}
                    </Button>
                )}

                {hasFolderDeletedFiles && (
                    <Button
                        variant={'secondary'}
                        onClick={() => {
                            includeDeleted
                                ? setIncludeDeleted(false)
                                : setIncludeDeleted(true)
                        }}
                    >
                        {includeDeleted
                            ? menuOptions.hideDeletedFile
                            : menuOptions.showDeletedFile
                        }
                    </Button>
                )}

                <Button
                    variant={'secondary'}
                    onClick={() => openNewFolderModal(folderId)}
                >
                    {menuOptions.newFolder}
                </Button>
                <Button
                    variant={'secondary'}
                    onClick={() => openUploadFileModal(folderId)}
                >
                    {menuOptions.uploadFile}
                </Button>
            </div>
        </>
    )
}