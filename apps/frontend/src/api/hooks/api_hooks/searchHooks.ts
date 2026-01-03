import {apiRoutes} from "@workspace/routes";
import {Data} from "@workspace/types";
import {useApiQuery} from "@/src/api/client/reactQuery";

const baseRoute = apiRoutes.search.base;

export const useGetSearchPreviews = (search: string) =>
    useApiQuery<
        { searchPreviews: Data[] }
    >(
        [baseRoute, apiRoutes.search.preview],
        {
            queryOptions: {
                enabled: Boolean(search && search.trim().length > 0)
            },
            requestOptions: {
                params: {
                    search
                }
            }
        }
    );