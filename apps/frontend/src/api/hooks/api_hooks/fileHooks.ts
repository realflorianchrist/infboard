import {useApiMutation} from "@/src/api/client/reactQuery";
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