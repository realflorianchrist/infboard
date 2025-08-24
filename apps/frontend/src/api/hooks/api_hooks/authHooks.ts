import {useApiMutation} from "@/src/api/client/reactQuery";
import {Index} from "@workspace/routes";
import {HttpMethod} from "@/src/api/client/client";
import {AuthUser, User} from "@workspace/types";
import {userDetails} from "@/src/utils/userDetails";
import {useRouter} from "next/navigation";
import routes from "@/src/constants/routes";

const baseRoute = Index.auth.base;

export const useRegister = () =>
    useApiMutation<
        { user: User, token: string },
        { user: AuthUser }
    >(
        [baseRoute, Index.auth.register],
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
        [baseRoute, Index.auth.login],
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
    }
}