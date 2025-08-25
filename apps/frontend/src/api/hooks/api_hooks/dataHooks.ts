import {useApiMutation} from "@/src/api/client/reactQuery";
import {Data} from "@workspace/types";
import {apiRoutes} from "@workspace/routes";
import {HttpMethod} from "@/src/api/client/client";
import {ROOT_FOLDER_ID} from "@workspace/constants";

const baseRoute = apiRoutes.data.base;

export const useMoveData = () =>
    useApiMutation<
        {},
        {data: Data[], targetFolderId: string}
    >(
        [baseRoute, apiRoutes.data.move],
        HttpMethod.PUT,
        {
            invalidatePaths: (_, {data, targetFolderId}) => {
                const parentFolderId = data[0]?.parentFolderId ?? ROOT_FOLDER_ID;

                return [
                    `${apiRoutes.folders.base}${apiRoutes.folders.all}`,
                    `${apiRoutes.folders.base}${apiRoutes.folders.byId(parentFolderId)}`,
                    `${apiRoutes.folders.base}${apiRoutes.folders.byId(targetFolderId)}`
                ]
            }
        }
    );