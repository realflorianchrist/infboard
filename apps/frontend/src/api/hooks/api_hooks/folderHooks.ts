import {useApiMutation, useApiQuery} from "@/src/api/client/reactQuery";
import {ApiRoutes} from "@workspace/routes";
import {Data, Folder, UpdateFolder} from "@workspace/types";
import {HttpMethod} from "@/src/api/client/client";
import {ROOT_FOLDER_ID} from "@workspace/constants";

const baseRoute = ApiRoutes.folders.base;

export const useGetAllFolders = () =>
    useApiQuery<
        { folders: Folder[] }
    >(
        [baseRoute, ApiRoutes.folders.all],
    );

export const useGetFolderDataById = (id: string) =>
    useApiQuery<
        { folder: Folder }
    >(
        [baseRoute, ApiRoutes.folders.byId(id)],
    );

export const useCreateFolder = () =>
    useApiMutation<
        { folder: Folder },
        { name: string, parentFolderId?: string }
    >(
        [baseRoute, ApiRoutes.folders.add],
        HttpMethod.POST,
        {
            invalidatePaths: (data) => {
                return [
                    `${baseRoute}${ApiRoutes.folders.all}`,
                    `${baseRoute}${ApiRoutes.folders.byId(data.folder.parentFolderId ?? ROOT_FOLDER_ID)}`
                ];
            }
        }
    );

export const useUpdateFolder = () =>
    useApiMutation<
        { folder: Folder },
        { folder: UpdateFolder }
    >(
        [baseRoute, ApiRoutes.folders.update],
        HttpMethod.PUT,
        {
            invalidatePaths: (data) => {
                return [
                    `${baseRoute}${ApiRoutes.folders.all}`,
                    `${baseRoute}${ApiRoutes.folders.byId(data.folder.parentFolderId ?? ROOT_FOLDER_ID)}`
                ];
            }
        }
    );

export const useDeleteFolder = () =>
    useApiMutation<
        { folder: Folder },
        { id: string }
    >(
        ({ id }) => [baseRoute, ApiRoutes.folders.delete(id)],
        HttpMethod.DELETE,
        {
            invalidatePaths: (data) => {
                return [
                    `${baseRoute}${ApiRoutes.folders.all}`,
                    `${baseRoute}${ApiRoutes.folders.byId(data.folder.parentFolderId ?? ROOT_FOLDER_ID)}`
                ];
            }
        }
    );
