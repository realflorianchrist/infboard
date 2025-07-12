import {useApiMutation, useApiQuery} from "@/src/api/client/reactQuery";
import {FileMeta, NewFileInput} from "@workspace/types/data";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {HttpMethod} from "@/src/api/client/client";

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
        { url: string },
        { id: string }
    >(
        (variables) => [baseRoute, ApiRoutes.files.downloadUrlById(variables.id)],
        HttpMethod.PUT,
    );

export const useDeleteFile = () =>
    useApiMutation<
        { success: boolean },
        { id: string, parentFolderId: string | 'root' }
    >(
        (variables) => [baseRoute, ApiRoutes.files.delete(variables.id)],
        HttpMethod.PUT,
        {
            invalidatePaths: (data, variables) =>
                [`${ApiRoutes.folders.base}${ApiRoutes.folders.byId(variables.parentFolderId)}`],
        }
    );