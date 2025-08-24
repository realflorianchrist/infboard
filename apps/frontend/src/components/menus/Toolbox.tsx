'use client'
import {Button} from "@workspace/ui/components/button";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import menuOptions from "@/src/constants/menuOptions";
import {useDownloadFile} from "@/src/hooks/useDownloadFile";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import {isFileMeta, isFolder} from "@workspace/types/src/data";
import Loader from "@/src/components/loader/Loader";

export default function Toolbox() {

    const {
        openNewFolderModal,
        isSelectMode,
        selected,
        openUploadFileModal,
    } = useContextMenu();

    const {downloadFile, downloadFiles, isDownloading} = useDownloadFile();

    const {path} = useFolderPath();

    const folderId = path[path.length - 1]?.id;

    return (
        <>
            {isDownloading && <Loader isFullScreen={true}/>}

            <div className={'flex gap-2'}>
                {isSelectMode && (
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
                <Button
                    variant={'secondary'}
                    onClick={() => {}}
                >
                    {menuOptions.showDeletedFile}
                </Button>
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