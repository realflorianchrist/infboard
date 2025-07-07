import {useApiQuery} from "@/src/api/client/reactQuery";
import {Routes} from "@workspace/routes/routes";

const baseRoute = Routes.folders.base;

export const useGetFolderById = () =>
    useApiQuery<
        { message: string }
    >(
        [baseRoute, Routes.folders.byId('1234')],
    );
