'use client'
import {createContext, useContext, useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {FolderPath, FolderPathSegment} from '@workspace/types/folderPath';
import Routes from "@/src/constants/routes";

type FolderPathContextType = {
    path: FolderPath;
    setPath: (newPath: FolderPath) => void;
    pushFolder: (segment: FolderPathSegment) => void;
    popFolder: () => void;
    resetPath: () => void;
};

const FolderPathContext = createContext<FolderPathContextType | undefined>(undefined);

const serializePathToUrl = (path: FolderPath): string => {
    return '/folder/' + path.map(segment => encodeURIComponent(JSON.stringify(segment))).join('/');
};

const deserializeUrlPath = (pathname: string): FolderPath => {
    const folderPathPrefix = '/folder/';
    if (!pathname.startsWith(folderPathPrefix)) return [];

    const parts = pathname.slice(folderPathPrefix.length).split('/');
    return parts.map(segment => {
        try {
            return JSON.parse(decodeURIComponent(segment));
        } catch {
            return null;
        }
    }).filter(Boolean) as FolderPath;
};

export const FolderPathProvider = ({children}: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();

    const initialPath = deserializeUrlPath(pathname);

    const [path, setPathState] = useState<FolderPath>(initialPath);

    const updateUrlPath = (newPath: FolderPath) => {
        const newUrl = serializePathToUrl(newPath);
        router.push(newUrl);
    };

    const setPath = (newPath: FolderPath) => {
        setPathState(newPath);
        updateUrlPath(newPath);
    };

    const pushFolder = (segment: FolderPathSegment) => {
        const newPath = [...path, segment];
        setPathState(newPath);
        updateUrlPath(newPath);
    };

    const popFolder = () => {
        const newPath = path.slice(0, -1);
        setPathState(newPath);
        updateUrlPath(newPath);
    };

    const resetPath = () => {
        setPathState([]);
        router.push(Routes.HOME);
    };

    useEffect(() => {
        const urlPath = deserializeUrlPath(pathname);
        setPathState(urlPath);
    }, [pathname]);

    return (
        <FolderPathContext.Provider value={{path, setPath, pushFolder, popFolder, resetPath}}>
            {children}
        </FolderPathContext.Provider>
    );
};

export const useFolderPath = (): FolderPathContextType => {
    const context = useContext(FolderPathContext);
    if (!context) {
        throw new Error('useFolderPath must be used within a FolderPathProvider');
    }
    return context;
};
