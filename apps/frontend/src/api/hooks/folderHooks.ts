import {useApiQuery} from "@/src/api/client/reactQuery";
import {Routes} from "@workspace/routes/routes";
import {Folder} from "@workspace/types/data";

const baseRoute = Routes.folders.base;

export const useGetAllFolders = () =>
    useApiQuery<
        { folders: Folder[] }
    >(
        [baseRoute, Routes.folders.all],
    );

export const useGetFolderById = () =>
    useApiQuery<
        { message: string }
    >(
        [baseRoute, Routes.folders.byId('1234')],
    );
