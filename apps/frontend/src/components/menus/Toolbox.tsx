'use client'
import {Button} from "@workspace/ui/components/button";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import menuOptions from "@/src/constants/menuOptions";
import {DropdownMenu} from "@workspace/ui/components/dropdown-menu";
import {useDownloadFile} from "@/src/hooks/downloadFile";
import {useFolderPath} from "@/src/hooks/useFolderPath";

export default function Toolbox() {

    const {
        openNewFolderModal,
        openRenameFolderModal,
        openDeleteFolderModal,
        openDeleteFileModal,
        isSelectMode,
        selected,
        isSelected,
        setSelected,
        addSelected,
        removeSelected,
        openUploadFileModal,
        openRenameFileModal,
    } = useContextMenu();

    const {downloadFile, downloadFiles} = useDownloadFile();

    const {path} = useFolderPath();

    const folderId = path[path.length - 1]?.id ?? null;

    return (
        <div className={'flex gap-2'}>
            {isSelectMode && (
                <Button
                    variant={'secondary'}
                    onClick={() => {
                        if (selected.length === 1 && selected[0]) {
                            downloadFile(selected[0].id);
                        } else if (selected.length > 1) {
                            downloadFiles(selected.map((item) => item.id));
                        }
                    }}
                >
                    {menuOptions.download}
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
    )
}