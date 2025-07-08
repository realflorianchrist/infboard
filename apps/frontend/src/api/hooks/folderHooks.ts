import {useApiQuery} from "@/src/api/client/reactQuery";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {Folder} from "@workspace/types/data";

const baseRoute = ApiRoutes.folders.base;

export const useGetAllFolders = () =>
    useApiQuery<
        { folders: Folder[] }
    >(
        [baseRoute, ApiRoutes.folders.all],
    );

export const useGetFolderById = (id: string) =>
    useApiQuery<
        { folder: Folder }
    >(
        [baseRoute, ApiRoutes.folders.byId(id)],
    );
