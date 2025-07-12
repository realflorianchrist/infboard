'use client'
import {Button} from "@workspace/ui/components/button";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import menuOptions from "@/src/constants/menuOptions";
import {DropdownMenu} from "@workspace/ui/components/dropdown-menu";
import {useFolderPath} from "@/src/providers/FolderPathProvider";

export default function Toolbox() {

    const {
        openNewFolderModal,
        openRenameFolderModal,
        openDeleteFolderModal,
        openDeleteFileModal,
        selected,
        isSelected,
        setSelected,
        addSelected,
        removeSelected,
        openUploadFileModal,
        openRenameFileModal,
    } = useContextMenu();

    const {path} = useFolderPath();

    const folderId = path[path.length - 1]?.id ?? null;

    return (
        <div className={'flex gap-2'}>
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