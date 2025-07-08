import { createContext, useContext, useState } from "react";

type ModalContextType = {
    renameFolderModal: { open: boolean; folderId: string | null; folderName: string | null };
    openRenameFolderModal: (folderId: string, folderName: string) => void;
    closeRenameFolderModal: () => void;

    deleteFolderModal: { open: boolean; folderId: string | null };
    openDeleteFolderModal: (folderId: string) => void;
    closeDeleteFolderModal: () => void;

    uploadFileModal: { open: boolean };
    openUploadFileModal: () => void;
    closeUploadFileModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [renameFolderModal, setRenameFolderModal] = useState<{ open: boolean; folderId: string | null; folderName: string | null }>({
        open: false,
        folderId: null,
        folderName: null,
    });

    const [deleteFolderModal, setDeleteFolderModal] = useState<{ open: boolean; folderId: string | null }>({
        open: false,
        folderId: null,
    });

    const [uploadFileModal, setUploadFileModal] = useState<{ open: boolean }>({
        open: false,
    });

    return (
        <ModalContext.Provider
            value={{
                renameFolderModal,
                openRenameFolderModal: (id, folderName) => setRenameFolderModal({ open: true, folderId: id, folderName }),
                closeRenameFolderModal: () => setRenameFolderModal({ open: false, folderId: null, folderName: null }),

                deleteFolderModal,
                openDeleteFolderModal: (id) => setDeleteFolderModal({ open: true, folderId: id }),
                closeDeleteFolderModal: () => setDeleteFolderModal({ open: false, folderId: null }),

                uploadFileModal,
                openUploadFileModal: () => setUploadFileModal({ open: true }),
                closeUploadFileModal: () => setUploadFileModal({ open: false }),
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context)
        throw new Error("useModal must be used within a ModalProvider");
    return context;
};
