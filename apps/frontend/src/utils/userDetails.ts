import Cookies from 'js-cookie';
import {User} from "@workspace/types/user";

export const userDetails = () => {
    const TOKEN_KEY = "jwt_token";
    const USER_INFOS_KEY = "userInfos";

    const secureOption = typeof window !== 'undefined'
        && window.location.protocol === 'https:';

    const getAuthToken = (): string | undefined => {
        if (typeof window === 'undefined') return undefined;

        return Cookies.get(TOKEN_KEY);
    };

    const getUserInfos = (): User | undefined => {
        if (typeof window === 'undefined') return undefined;

        const item = localStorage.getItem(USER_INFOS_KEY);
        if (!item) return undefined;

        try {
            return JSON.parse(item) as User;
        } catch (e) {
            console.error("Error while parsing user infos from localStorage:", e);
            return undefined;
        }
    };

    const setAuthToken = (token: string) => {
        Cookies.set(TOKEN_KEY, token, {
            expires: 1,
            sameSite: 'strict',
            path: '/',
            secure: secureOption
        });
    };

    const setUserInfos = (user: User) => {
        localStorage.setItem(USER_INFOS_KEY, JSON.stringify(user));
    };

    const removeAuthToken = () => {
        Cookies.remove(TOKEN_KEY);
    };

    const removeUserInfos = () => {
        localStorage.removeItem(USER_INFOS_KEY);
    };

    return {
        getAuthToken,
        getUserInfos,
        setAuthToken,
        setUserInfos,
        removeAuthToken,
        removeUserInfos,
    }
}