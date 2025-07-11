'use client'
import {createContext, useContext, useEffect, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {FolderPath, FolderPathSegment} from '@workspace/types/folderPath';

type FolderPathContextType = {
    path: FolderPath;
    setPath: (newPath: FolderPath) => void;
    pushFolder: (segment: FolderPathSegment) => void;
    popFolder: () => void;
    resetPath: () => void;
};

const FolderPathContext = createContext<FolderPathContextType | undefined>(undefined);

const serializePath = (path: FolderPath): string =>
    path.map(segment => JSON.stringify(segment)).join('.');

const deserializePath = (param: string | null): FolderPath => {
    if (!param) return [];
    return param
        .split('.')
        .map(segment => {
            try {
                return JSON.parse(segment);
            } catch {
                return null;
            }
        })
        .filter(Boolean) as FolderPath;
}

export const FolderPathProvider = ({children}: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialPath = deserializePath(searchParams.get('path'));

    const [path, setPathState] = useState<FolderPath>(initialPath);

    const updateUrlParam = (newPath: FolderPath) => {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        if (newPath.length > 0) {
            params.set('path', serializePath(newPath));
        } else {
            params.delete('path');
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const setPath = (newPath: FolderPath) => {
        setPathState(newPath);
        updateUrlParam(newPath);
    };

    const pushFolder = (segment: FolderPathSegment) => {
        const newPath = [...path, segment];
        setPathState(newPath);
        updateUrlParam(newPath);
    };

    const popFolder = () => {
        const newPath = path.slice(0, -1);
        setPathState(newPath);
        updateUrlParam(newPath);
    };

    const resetPath = () => {
        setPathState([]);
        updateUrlParam([]);
    };

    useEffect(() => {
        const urlPath = deserializePath(searchParams.get('path'));
        setPathState(urlPath);
    }, [searchParams]);

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
