'use client'
import {createContext, useContext, useEffect, useState} from "react";
import {Folder, FileMeta, Data} from "@workspace/types/src/data";

type ContextMenuContextType = {
    newFolderModal: { open: boolean; parentFolderId?: string; };
    openNewFolderModal: (parentFolderId?: string) => void;
    closeNewFolderModal: () => void;

    renameFolderModal: { open: boolean; folderId: string | null; folderName: string | null; parentFolderId?: string; };
    openRenameFolderModal: (folderId: string, folderName: string, parentFolderId?: string) => void;
    closeRenameFolderModal: () => void;

    editFileModal: { open: boolean; fileId: string | null; fileName: string | null; parentFolderId?: string; };
    openEditFileModal: (fileId: string, fileName: string, parentFolderId?: string) => void;
    closeEditFileModal: () => void;

    deleteFolderModal: { open: boolean; folderId: string | null };
    openDeleteFolderModal: (folderId: string) => void;
    closeDeleteFolderModal: () => void;

    deleteFileModal: { open: boolean; fileId: string | null };
    openDeleteFileModal: (fileId: string) => void;
    closeDeleteFileModal: () => void;

    uploadFileModal: { open: boolean; parentFolderId?: string };
    openUploadFileModal: (parentFolderId?: string) => void;
    closeUploadFileModal: () => void;

    isSelectMode: boolean;
    selected: Data[];
    isSelected: (id: string) => boolean;
    setSelected: (data: Data[]) => void;
    addSelected: (data: Data) => void;
    removeSelected: (id: string) => void;
};

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(undefined);

export const ContextMenuProvider = ({children}: { children: React.ReactNode }) => {
    const [newFolderModal, setNewFolderModal] = useState<{ open: boolean; parentFolderId?: string; }>({
        open: false,
    });

    const [renameFolderModal, setRenameFolderModal] = useState<{
        open: boolean;
        folderId: string | null;
        folderName: string | null;
        parentFolderId?: string;
    }>({
        open: false,
        folderId: null,
        folderName: null,
    });

    const [editFileModal, setEditFileModal] = useState<{
        open: boolean;
        fileId: string | null;
        fileName: string | null;
        parentFolderId?: string;
    }>({
        open: false,
        fileId: null,
        fileName: null,
    });

    const [deleteFolderModal, setDeleteFolderModal] = useState<{ open: boolean; folderId: string | null }>({
        open: false,
        folderId: null,
    });

    const [deleteFileModal, setDeleteFileModal] = useState<{ open: boolean; fileId: string | null, }>({
        open: false,
        fileId: null,
    });

    const [uploadFileModal, setUploadFileModal] = useState<{ open: boolean; parentFolderId?: string }>({
        open: false,
    });

    const [selected, setSelected] = useState<Data[]>([]);

    const isSelectMode = selected.length > 0;

    return (
        <ContextMenuContext.Provider
            value={{
                newFolderModal,
                openNewFolderModal: (id) => setNewFolderModal({open: true, parentFolderId: id}),
                closeNewFolderModal: () => setNewFolderModal({open: false, parentFolderId: undefined}),

                renameFolderModal,
                openRenameFolderModal: (id, folderName, parentFolderId) => setRenameFolderModal({open: true, folderId: id, folderName, parentFolderId}),
                closeRenameFolderModal: () => setRenameFolderModal({open: false, folderId: null, folderName: null}),

                editFileModal,
                openEditFileModal: (id, fileName, parentFolderId) => setEditFileModal({open: true, fileId: id, fileName, parentFolderId}),
                closeEditFileModal: () => setEditFileModal({open: false, fileId: null, fileName: null}),

                deleteFolderModal,
                openDeleteFolderModal: (id) => setDeleteFolderModal({open: true, folderId: id}),
                closeDeleteFolderModal: () => setDeleteFolderModal({open: false, folderId: null}),

                deleteFileModal,
                openDeleteFileModal: (id) => setDeleteFileModal({open: true, fileId: id}),
                closeDeleteFileModal: () => setDeleteFileModal({open: false, fileId: null}),

                uploadFileModal,
                openUploadFileModal: (id) => setUploadFileModal({open: true, parentFolderId: id}),
                closeUploadFileModal: () => setUploadFileModal({open: false, parentFolderId: undefined}),

                isSelectMode,
                selected,
                isSelected: (id: string) => selected.some(item => item.id === id),
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
