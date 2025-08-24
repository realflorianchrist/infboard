import {useApiMutation} from "@/src/api/client/reactQuery";
import {FileMeta, NewFileInput, UpdateFileMeta} from "@workspace/types";
import {Index} from "@workspace/routes";
import {HttpMethod} from "@/src/api/client/client";
import {ROOT_FOLDER_ID} from "@workspace/constants";

const baseRoute = Index.files.base;

export const useAddFile = () =>
    useApiMutation<{
        file: FileMeta
    }, {
        file: NewFileInput
    }
    >(
        [baseRoute, Index.files.add],
        HttpMethod.POST,
    );

export const useGetFileDownloadUrl = () =>
    useApiMutation<
        { url: string, file: FileMeta },
        { id: string }
    >(
        (variables) => [baseRoute, Index.files.downloadUrlById(variables.id)],
        HttpMethod.PUT,
    );

export const useGetFileDownloadUrlsForFolder = () =>
    useApiMutation<
        { url: string, file: FileMeta }[],
        { folderId: string }
    >(
        (variables) => [baseRoute, Index.files.downloadUrlsByFolderId(variables.folderId)],
        HttpMethod.PUT,
    );

export const useUpdateFile = () =>
    useApiMutation<
        { file: FileMeta },
        { file: UpdateFileMeta }
    >(
        [baseRoute, Index.files.update],
        HttpMethod.PUT,
        {
            invalidatePaths: (_, variables) =>
                [`${Index.folders.base}${Index.folders.byId(variables.file.parentFolderId ?? ROOT_FOLDER_ID)}`],
        }
    );

export const useDeleteFile = () =>
    useApiMutation<
        { file: FileMeta },
        { id: string }
    >(
        (variables) => [baseRoute, Index.files.delete(variables.id)],
        HttpMethod.PUT,
        {
            invalidatePaths: (data) =>
                [`${Index.folders.base}${Index.folders.byId(data.file.parentFolderId ?? ROOT_FOLDER_ID)}`],
        }
    );

export const useRollbackFile = () =>
    useApiMutation<
        {},
        { file: FileMeta }
    >(
        (variables) => [baseRoute, Index.files.rollback(variables.file.id)],
        HttpMethod.PUT,
        {
            invalidatePaths: (_, variables) =>
                [`${Index.folders.base}${Index.folders.byId(variables.file.parentFolderId ?? ROOT_FOLDER_ID)}`],
        }
    );
