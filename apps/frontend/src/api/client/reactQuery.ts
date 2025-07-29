import {
    useMutation,
    useQuery,
    useQueryClient,
    UseMutationOptions,
    UseQueryOptions,
    QueryKey
} from "@tanstack/react-query";
import {ApiClientError, apiFetch, FetchOptions, HttpMethod} from "@/src/api/client/client";
import {joinRoute} from "@/src/utils/joinRoute";

/**
 * React Query hook for performing a typed GET request.
 *
 * @template TApiResponse - The expected response type from the API.
 * @template TTransformed - The final type returned by the hook after optional transformation via `select`.
 *
 * @param path - The API endpoint (must start with a "/").
 * @param options - Optional configuration object:
 *   - `requestOptions`: Additional fetch options such as headers or query parameters.
 *                       The HTTP method is automatically set to GET.
 *   - `queryOptions`: Options for React Query's `useQuery`, including caching, retry behavior, refetching, etc.
 *
 * @returns A typed `useQuery` hook result for performing the GET request.
 */
export const useApiQuery = <TApiResponse, TTransformed = TApiResponse>(
    path: string | string[],
    options?: {
        requestOptions?: Omit<FetchOptions, "method">;
        queryOptions?: Omit<UseQueryOptions<TApiResponse, ApiClientError, TTransformed>, "queryFn" | "queryKey">;
    },
) => {
    const {requestOptions, queryOptions} = options ?? {};
    const joinedPath = Array.isArray(path)
        ? joinRoute(path)
        : path;

    return useQuery<TApiResponse, ApiClientError, TTransformed, QueryKey>({
        queryKey: requestOptions?.params
            ? [joinedPath, requestOptions.params]
            : [joinedPath],
        queryFn: () =>
            apiFetch<TApiResponse>(joinedPath, {
                ...requestOptions,
                method: HttpMethod.GET,
            }),
        ...queryOptions,
    });
};

/**
 * React Query hook for performing a typed API mutation (e.g. POST, PUT, DELETE).
 *
 * @template TApiResponse - The expected response type from the API.
 * @template TRequestBody - The shape of the request body to be sent.
 *
 * @param path - The API endpoint (must start with a "/").
 * @param method - The HTTP method to use (must be one of the defined `HttpMethod` values).
 * @param options - Optional configuration object:
 *   - `requestOptions`:  Additional fetch options like headers, params, credentials, etc.
 *                        The request body will automatically be JSON-stringified.
 *   - `mutationOptions`: Options for React Query's `useMutation`, including callbacks and `invalidatePaths`
 *                        for automatic cache invalidation on success.
 *   - `invalidatePaths`: Optional list of query keys to automatically invalidate after a successful mutation.
 *
 * @returns A typed `useMutation` hook result for performing the API call.
 */
export const useApiMutation = <TApiResponse, TRequestBody>(
    path: string | string[] | ((variables: TRequestBody) => string | string[]),
    method: HttpMethod,
    options?: {
        requestOptions?: Omit<FetchOptions, "method"> | ((variables: TRequestBody) => Omit<FetchOptions, "method">),
        mutationOptions?: Omit<UseMutationOptions<TApiResponse, ApiClientError, TRequestBody>, "mutationFn">,
        invalidatePaths?: string[] | ((data: TApiResponse, variables: TRequestBody) => string[])
    }
) => {
    const queryClient = useQueryClient();
    const {requestOptions, mutationOptions, invalidatePaths} = options ?? {};
    const resolvedPath = (requestBody?: TRequestBody) => {
        const dynamicPath = typeof path === 'function'
            ? path(requestBody as TRequestBody)
            : path;

        return Array.isArray(dynamicPath) ? joinRoute(dynamicPath) : dynamicPath;
    };

    return useMutation<TApiResponse, ApiClientError, TRequestBody>({
        mutationFn: async (requestBody?: TRequestBody): Promise<TApiResponse> => {
            const resolvedRequestOptions =
                typeof requestOptions === "function"
                    ? requestBody
                        ? requestOptions(requestBody) : {}
                    : requestOptions ?? {}

            return apiFetch<TApiResponse>(resolvedPath(requestBody), {
                ...resolvedRequestOptions,
                method,
                body: requestBody ? JSON.stringify(requestBody) : undefined,
            })
        },
        onSuccess: (data, variables, context) => {
            mutationOptions?.onSuccess?.(data, variables, context);

            const paths =
                typeof invalidatePaths === "function"
                    ? invalidatePaths(data, variables)
                    : invalidatePaths;

            // Automatically invalidate queries after a successful mutation
            paths?.forEach((key) => {
                queryClient.invalidateQueries({queryKey: [key]});
            });
        },
        ...mutationOptions,
    });
};
