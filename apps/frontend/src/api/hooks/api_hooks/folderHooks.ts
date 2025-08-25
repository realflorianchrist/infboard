import {useApiMutation, useApiQuery} from "@/src/api/client/reactQuery";
import {apiRoutes} from "@workspace/routes";
import {Data, Folder, UpdateFolder} from "@workspace/types";
import {HttpMethod} from "@/src/api/client/client";
import {ROOT_FOLDER_ID} from "@workspace/constants";

const baseRoute = apiRoutes.folders.base;

export const useGetAllFolders = () =>
    useApiQuery<
        { folders: Folder[] }
    >(
        [baseRoute, apiRoutes.folders.all],
    );

export const useGetFolderDataById = (id: string) =>
    useApiQuery<
        { folder: Folder }
    >(
        [baseRoute, apiRoutes.folders.byId(id)],
    );

export const useCreateFolder = () =>
    useApiMutation<
        { folder: Folder },
        { name: string, parentFolderId?: string }
    >(
        [baseRoute, apiRoutes.folders.add],
        HttpMethod.POST,
        {
            invalidatePaths: (data) => {
                return [
                    `${baseRoute}${apiRoutes.folders.all}`,
                    `${baseRoute}${apiRoutes.folders.byId(data.folder.parentFolderId ?? ROOT_FOLDER_ID)}`
                ];
            }
        }
    );

export const useUpdateFolder = () =>
    useApiMutation<
        { folder: Folder },
        { folder: UpdateFolder }
    >(
        [baseRoute, apiRoutes.folders.update],
        HttpMethod.PUT,
        {
            invalidatePaths: (data) => {
                return [
                    `${baseRoute}${apiRoutes.folders.all}`,
                    `${baseRoute}${apiRoutes.folders.byId(data.folder.parentFolderId ?? ROOT_FOLDER_ID)}`
                ];
            }
        }
    );

export const useDeleteFolder = () =>
    useApiMutation<
        { folder: Folder },
        { id: string }
    >(
        ({ id }) => [baseRoute, apiRoutes.folders.delete(id)],
        HttpMethod.DELETE,
        {
            invalidatePaths: (data) => {
                return [
                    `${baseRoute}${apiRoutes.folders.all}`,
                    `${baseRoute}${apiRoutes.folders.byId(data.folder.parentFolderId ?? ROOT_FOLDER_ID)}`
                ];
            }
        }
    );
