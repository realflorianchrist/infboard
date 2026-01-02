import {useApiMutation} from "@/src/api/client/reactQuery";
import {apiRoutes} from "@workspace/routes";
import {HttpMethod} from "@/src/api/client/client";
import {AuthUser, User} from "@workspace/types";
import {userDetails} from "@/src/utils/userDetails";
import {useRouter} from "next/navigation";
import routes from "@/src/constants/routes";
import {toast} from "sonner";
import {successMessage} from "@/src/utils/getSuccessMessage";

const baseRoute = apiRoutes.auth.base;

export const useRegister = () =>
    useApiMutation<
        { user: User },
        { user: AuthUser }
    >(
        [baseRoute, apiRoutes.auth.register],
        HttpMethod.POST
    );

export const useLogin = () =>
    useApiMutation<
        { user: User, token: string },
        { user: AuthUser }
    >(
        [baseRoute, apiRoutes.auth.login],
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

export const useLogout = () => {
    const router = useRouter();

    return () => {
        userDetails().removeAuthToken();
        router.push(routes.LOGIN);
        toast.success(successMessage.LOGOUT_SUCCESSFUL)
    }
};

export const useConfirmEmail = () =>
    useApiMutation<
        { user: User, token: string },
        { token: string }
    >(
        [baseRoute, apiRoutes.auth.confirmEmail],
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