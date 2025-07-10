'use client'
import {createContext, useContext, useEffect, useState} from "react";
import {Folder, File} from "@workspace/types/data";

type ContextMenuContextType = {
    newFolderModal: { open: boolean; parentFolderId: string | null; };
    openNewFolderModal: (parentFolderId: string | null) => void;
    closeNewFolderModal: () => void;

    renameFolderModal: { open: boolean; folderId: string | null; folderName: string | null };
    openRenameFolderModal: (folderId: string, folderName: string) => void;
    closeRenameFolderModal: () => void;

    renameFileModal: { open: boolean; fileId: string | null; fileName: string | null };
    openRenameFileModal: (fileId: string, fileName: string) => void;
    closeRenameFileModal: () => void;

    deleteFolderModal: { open: boolean; folderId: string | null };
    openDeleteFolderModal: (folderId: string) => void;
    closeDeleteFolderModal: () => void;

    deleteFileModal: { open: boolean; fileId: string | null };
    openDeleteFileModal: (fileId: string) => void;
    closeDeleteFileModal: () => void;

    uploadFileModal: { open: boolean; parentFolderId: string | null };
    openUploadFileModal: (parentFolderId: string | null) => void;
    closeUploadFileModal: () => void;

    isSelectMode: boolean;
    setIsSelectMode: (value: boolean) => void;
    selected: (File | Folder)[];
    setSelected: (data: (File | Folder)[]) => void;
    addSelected: (data: (File | Folder)) => void;
    removeSelected: (id: string) => void;
};

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(undefined);

export const ContextMenuProvider = ({children}: { children: React.ReactNode }) => {
    const [newFolderModal, setNewFolderModal] = useState<{ open: boolean; parentFolderId: string | null; }>({
        open: false,
        parentFolderId: null,
    });

    const [renameFolderModal, setRenameFolderModal] = useState<{
        open: boolean;
        folderId: string | null;
        folderName: string | null
    }>({
        open: false,
        folderId: null,
        folderName: null,
    });

    const [renameFileModal, setRenameFileModal] = useState<{
        open: boolean;
        fileId: string | null;
        fileName: string | null
    }>({
        open: false,
        fileId: null,
        fileName: null,
    });

    const [deleteFolderModal, setDeleteFolderModal] = useState<{ open: boolean; folderId: string | null }>({
        open: false,
        folderId: null,
    });

    const [deleteFileModal, setDeleteFileModal] = useState<{ open: boolean; fileId: string | null }>({
        open: false, fileId: null
    });

    const [uploadFileModal, setUploadFileModal] = useState<{ open: boolean; parentFolderId: string | null }>({
        open: false,
        parentFolderId: null
    });

    const [isSelectMode, setIsSelectMode] = useState(false);

    const [selected, setSelected] = useState<(File | Folder)[]>([]);

    useEffect(() => {
        if (selected.length > 0) {
            setIsSelectMode(true);
        } else {
            setIsSelectMode(false);
        }
    }, [selected.length]);

    return (
        <ContextMenuContext.Provider
            value={{
                newFolderModal,
                openNewFolderModal: (id) => setNewFolderModal({open: true, parentFolderId: id}),
                closeNewFolderModal: () => setNewFolderModal({open: false, parentFolderId: null}),

                renameFolderModal,
                openRenameFolderModal: (id, folderName) => setRenameFolderModal({open: true, folderId: id, folderName}),
                closeRenameFolderModal: () => setRenameFolderModal({open: false, folderId: null, folderName: null}),

                renameFileModal,
                openRenameFileModal: (id, fileName) => setRenameFileModal({open: true, fileId: id, fileName}),
                closeRenameFileModal: () => setRenameFileModal({open: false, fileId: null, fileName: null}),

                deleteFolderModal,
                openDeleteFolderModal: (id) => setDeleteFolderModal({open: true, folderId: id}),
                closeDeleteFolderModal: () => setDeleteFolderModal({open: false, folderId: null}),

                deleteFileModal,
                openDeleteFileModal: (id) => setDeleteFileModal({open: true, fileId: id}),
                closeDeleteFileModal: () => setDeleteFileModal({open: false, fileId: null}),

                uploadFileModal,
                openUploadFileModal: (id) => setUploadFileModal({open: true, parentFolderId: id}),
                closeUploadFileModal: () => setUploadFileModal({open: false, parentFolderId: null}),

                isSelectMode,
                setIsSelectMode,
                selected,
                setSelected: (data) => setSelected(data),
                addSelected: (item) =>
                    setSelected((prev) =>
                        prev.some((i) => i.id === item.id) ? prev : [...prev, item]
                    ),
                removeSelected: (id: string) =>
                    setSelected((prev) => prev.filter(item => item.id !== id)),
            }}
        >
            {children}
        </ContextMenuContext.Provider>
    );
};

export const useContextMenu = () => {
    const context = useContext(ContextMenuContext);
    if (!context)
        throw new Error("useContextMenu must be used within a ContextMenuProvider");
    return context;
};
