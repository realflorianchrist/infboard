import {useApiMutation, useApiQuery} from "@/src/api/client/reactQuery";
import {Index} from "@workspace/routes";
import {Data, Folder, UpdateFolder} from "@workspace/types";
import {HttpMethod} from "@/src/api/client/client";
import {ROOT_FOLDER_ID} from "@workspace/constants";

const baseRoute = Index.folders.base;

export const useGetAllFolders = () =>
    useApiQuery<
        { folders: Folder[] }
    >(
        [baseRoute, Index.folders.all],
    );

export const useGetFolderDataById = (id: string) =>
    useApiQuery<
        { folder: Folder }
    >(
        [baseRoute, Index.folders.byId(id)],
    );

export const useCreateFolder = () =>
    useApiMutation<
        { folder: Folder },
        { name: string, parentFolderId?: string }
    >(
        [baseRoute, Index.folders.add],
        HttpMethod.POST,
        {
            invalidatePaths: (data) => {
                return [
                    `${baseRoute}${Index.folders.all}`,
                    `${baseRoute}${Index.folders.byId(data.folder.parentFolderId ?? ROOT_FOLDER_ID)}`
                ];
            }
        }
    );

export const useUpdateFolder = () =>
    useApiMutation<
        { folder: Folder },
        { folder: UpdateFolder }
    >(
        [baseRoute, Index.folders.update],
        HttpMethod.PUT,
        {
            invalidatePaths: (data) => {
                return [
                    `${baseRoute}${Index.folders.all}`,
                    `${baseRoute}${Index.folders.byId(data.folder.parentFolderId ?? ROOT_FOLDER_ID)}`
                ];
            }
        }
    );

export const useDeleteFolder = () =>
    useApiMutation<
        { folder: Folder },
        { id: string }
    >(
        ({ id }) => [baseRoute, Index.folders.delete(id)],
        HttpMethod.DELETE,
        {
            invalidatePaths: (data) => {
                return [
                    `${baseRoute}${Index.folders.all}`,
                    `${baseRoute}${Index.folders.byId(data.folder.parentFolderId ?? ROOT_FOLDER_ID)}`
                ];
            }
        }
    );
