import {useApiMutation, useApiQuery} from "@/src/api/client/reactQuery";
import {apiRoutes} from "@workspace/routes";
import {Data, Folder, UpdateFolder} from "@workspace/types";
import {HttpMethod} from "@/src/api/client/client";
import {ROOT_FOLDER_ID} from "@workspace/constants";
import {useState} from "react";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";

const baseRoute = apiRoutes.folders.base;

export const useGetAllFolders = () =>
    useApiQuery<
        { folders: Folder[] }
    >(
        [baseRoute, apiRoutes.folders.all],
    );

export const useGetFolderDataById = (id: string) => {
    const {includeDeleted} = useContextMenu();

    return useApiQuery<{ folder: Folder }>(
        [baseRoute, apiRoutes.folders.byId(id)],
        {
            requestOptions: {
                params: {
                    includeDeleted: String(includeDeleted),
                },
            },
        }
    );
};

export const useHasFolderDeletedFiles = (id: string) =>
    useApiQuery<
        { hasDeletedFiles: boolean }
    >(
        [baseRoute, apiRoutes.folders.hasDeletedFiles(id)],
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
        ({id}) => [baseRoute, apiRoutes.folders.delete(id)],
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
