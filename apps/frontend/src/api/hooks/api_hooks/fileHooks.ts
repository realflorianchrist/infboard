import {useApiMutation} from "@/src/api/client/reactQuery";
import {FileMeta, NewFileInput, UpdateFileMeta} from "@workspace/types";
import {apiRoutes} from "@workspace/routes";
import {HttpMethod} from "@/src/api/client/client";
import {ROOT_FOLDER_ID} from "@workspace/constants";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";

const baseRoute = apiRoutes.files.base;

export const useAddFile = () =>
    useApiMutation<{
        file: FileMeta
    }, {
        file: NewFileInput
    }
    >(
        [baseRoute, apiRoutes.files.add],
        HttpMethod.POST,
    );

export const useGetFileDownloadUrl = () => {
    const {includeDeleted} = useContextMenu();

    return useApiMutation<
        { url: string, file: FileMeta },
        { id: string }
    >(
        (variables) => [baseRoute, apiRoutes.files.downloadUrlById(variables.id)],
        HttpMethod.PUT,
        {
            requestOptions: {
                params: {
                    includeDeleted: String(includeDeleted),
                },
            },
        }
    );
};

export const useGetFileDownloadUrlsForFolder = () => {
    const {includeDeleted} = useContextMenu();

    return useApiMutation<
        { url: string, file: FileMeta }[],
        { folderId: string }
    >(
        (variables) => [baseRoute, apiRoutes.files.downloadUrlsByFolderId(variables.folderId)],
        HttpMethod.PUT,
        {
            requestOptions: {
                params: {
                    includeDeleted: String(includeDeleted),
                },
            },
        }
    );
};

export const useUpdateFile = () =>
    useApiMutation<
        { file: FileMeta },
        { file: UpdateFileMeta }
    >(
        [baseRoute, apiRoutes.files.update],
        HttpMethod.PUT,
        {
            invalidatePaths: (_, variables) =>
                [`${apiRoutes.folders.base}${apiRoutes.folders.byId(variables.file.parentFolderId ?? ROOT_FOLDER_ID)}`],
        }
    );

export const useRollbackFile = () =>
    useApiMutation<
        {},
        { file: FileMeta }
    >(
        (variables) => [baseRoute, apiRoutes.files.rollback(variables.file.id)],
        HttpMethod.PUT,
        {
            invalidatePaths: (_, variables) =>
                [`${apiRoutes.folders.base}${apiRoutes.folders.byId(variables.file.parentFolderId ?? ROOT_FOLDER_ID)}`],
        }
    );
