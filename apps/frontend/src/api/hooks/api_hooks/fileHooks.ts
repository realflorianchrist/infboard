import {useApiMutation, useApiQuery} from "@/src/api/client/reactQuery";
import {FileMeta, NewFileInput} from "@workspace/types/data";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {HttpMethod} from "@/src/api/client/client";
import {ROOT_FOLDER_ID} from "@workspace/constants/index";

const baseRoute = ApiRoutes.files.base;

export const useAddFile = () =>
    useApiMutation<{
        file: FileMeta
    }, {
        file: NewFileInput
    }
    >(
        [baseRoute, ApiRoutes.files.add],
        HttpMethod.POST,
    );

export const useGetFileDownloadUrl = () =>
    useApiMutation<
        { url: string, file: FileMeta },
        { id: string }
    >(
        (variables) => [baseRoute, ApiRoutes.files.downloadUrlById(variables.id)],
        HttpMethod.PUT,
    );

export const useGetFileDownloadUrlsForFolder = () =>
    useApiMutation<
        { url: string, file: FileMeta }[],
        { folderId: string }
    >(
        (variables) => [baseRoute, ApiRoutes.files.downloadUrlsByFolderId(variables.folderId)],
        HttpMethod.PUT,
    );

export const useDeleteFile = () =>
    useApiMutation<
        { file: FileMeta },
        { id: string }
    >(
        (variables) => [baseRoute, ApiRoutes.files.delete(variables.id)],
        HttpMethod.PUT,
        {
            invalidatePaths: (data) =>
                [`${ApiRoutes.folders.base}${ApiRoutes.folders.byId(data.file.parentFolderId ?? ROOT_FOLDER_ID)}`],
        }
    );

export const useRollbackFile = () =>
    useApiMutation<
        {},
        { file: FileMeta }
    >(
        (variables) => [baseRoute, ApiRoutes.files.rollback(variables.file.id)],
        HttpMethod.PUT,
        {
            invalidatePaths: (_, variables) =>
                [`${ApiRoutes.folders.base}${ApiRoutes.folders.byId(variables.file.parentFolderId ?? ROOT_FOLDER_ID)}`],
        }
    );