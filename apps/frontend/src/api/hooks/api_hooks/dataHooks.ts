import {useApiMutation} from "@/src/api/client/reactQuery";
import {Data} from "@workspace/types";
import {Index} from "@workspace/routes";
import {HttpMethod} from "@/src/api/client/client";
import {ROOT_FOLDER_ID} from "@workspace/constants";

const baseRoute = Index.data.base;

export const useMoveData = () =>
    useApiMutation<
        {},
        {data: Data[], targetFolderId: string}
    >(
        [baseRoute, Index.data.move],
        HttpMethod.PUT,
        {
            invalidatePaths: (_, {data, targetFolderId}) => {
                const parentFolderId = data[0]?.parentFolderId ?? ROOT_FOLDER_ID;

                return [
                    `${Index.folders.base}${Index.folders.all}`,
                    `${Index.folders.base}${Index.folders.byId(parentFolderId)}`,
                    `${Index.folders.base}${Index.folders.byId(targetFolderId)}`
                ]
            }
        }
    );