import {useApiMutation} from "@/src/api/client/reactQuery";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {HttpMethod} from "@/src/api/client/client";
import {AuthUser, User} from "@workspace/types/user";
import {userDetails} from "@/src/utils/userDetails";

const baseRoute = ApiRoutes.auth.base;

export const useRegister = () =>
    useApiMutation<
        { user: User, token: string },
        { user: AuthUser }
    >(
        [baseRoute, ApiRoutes.auth.register],
        HttpMethod.POST,
        {
            mutationOptions: {
                onSuccess: ({user, token}) => {
                    userDetails().setAuthToken(token);
                    userDetails().setUserInfos(user);
                }
            }
        }
    );

export const useLogin = () =>
    useApiMutation<
        { user: User, token: string },
        { user: AuthUser }
    >(
        [baseRoute, ApiRoutes.auth.login],
        HttpMethod.POST,
        {
            mutationOptions: {
                onSuccess: ({user, token}) => {
                    userDetails().setAuthToken(token);
                    userDetails().setUserInfos(user);
                }
            }
        }
    );