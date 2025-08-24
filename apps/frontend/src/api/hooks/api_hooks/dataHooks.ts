import {useApiMutation} from "@/src/api/client/reactQuery";
import {Data} from "@workspace/types";
import {ApiRoutes} from "@workspace/routes";
import {HttpMethod} from "@/src/api/client/client";
import {ROOT_FOLDER_ID} from "../../../../../../packages/constants";

const baseRoute = ApiRoutes.data.base;

export const useMoveData = () =>
    useApiMutation<
        {},
        {data: Data[], targetFolderId: string}
    >(
        [baseRoute, ApiRoutes.data.move],
        HttpMethod.PUT,
        {
            invalidatePaths: (_, {data, targetFolderId}) => {
                const parentFolderId = data[0]?.parentFolderId ?? ROOT_FOLDER_ID;

                return [
                    `${ApiRoutes.folders.base}${ApiRoutes.folders.all}`,
                    `${ApiRoutes.folders.base}${ApiRoutes.folders.byId(parentFolderId)}`,
                    `${ApiRoutes.folders.base}${ApiRoutes.folders.byId(targetFolderId)}`
                ]
            }
        }
    );