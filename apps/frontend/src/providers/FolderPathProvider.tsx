'use client'
import {FolderPath, FolderPathSegment} from "@workspace/types/folderPath";
import {createContext, useContext, useState} from "react";

type FolderPathContextType = {
    path: FolderPath;
    setPath: (newPath: FolderPath) => void;
    pushFolder: (segment: FolderPathSegment) => void;
    popFolder: () => void;
    resetPath: () => void;
};

const FolderPathContext = createContext<FolderPathContextType | undefined>(undefined);

export const FolderPathProvider = ({ children }: { children: React.ReactNode }) => {
    const [path, setPath] = useState<FolderPath>([]);

    const pushFolder = (segment: FolderPathSegment) => {
        setPath(prev => [...prev, segment]);
    };

    const popFolder = () => {
        setPath(prev => prev.slice(0, -1));
    };

    const resetPath = () => {
        setPath([]);
    };

    return (
        <FolderPathContext.Provider value={{ path, setPath, pushFolder, popFolder, resetPath }}>
            {children}
        </FolderPathContext.Provider>
    );
};

export const useFolderPath = () => {
    const context = useContext(FolderPathContext);
    if (!context) throw new Error('useFolderPath must be used within a FolderPathContextProvider');
    return context;
};