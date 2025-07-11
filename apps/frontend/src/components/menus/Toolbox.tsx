'use client'
import {Button} from "@workspace/ui/components/button";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import menuOptions from "@/src/constants/menuOptions";
import {DropdownMenu} from "@workspace/ui/components/dropdown-menu";

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

    return (
        <div className={'flex gap-2'}>
            <Button
                variant={'secondary'}
                onClick={() => openNewFolderModal(null)}
            >
                {menuOptions.newFolder}
            </Button>
            <Button
                variant={'secondary'}
                onClick={() => openUploadFileModal(null)}
            >
                {menuOptions.uploadFile}
            </Button>
        </div>
    )
}