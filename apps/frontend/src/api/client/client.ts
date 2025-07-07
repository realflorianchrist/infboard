import {ApiErrorResponse, ApiResponse, ErrorType} from "@workspace/types/apiResponses";

// const API_BASE_URL = env.API_URL || "http://localhost:8080";
const API_BASE_URL = "http://localhost:8080/api";

export type FetchOptions = Omit<RequestInit, "method"> & {
    method?: HttpMethod;
    params?: Record<string, string | number>;
};

export const apiFetch = async <T>(
    endpoint: string,
    {params, headers, ...options}: FetchOptions = {}
): Promise<T> => {
    if (!endpoint.startsWith('/')) {
        throw new Error(`Path has to start with '/'`);
    }

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) =>
            url.searchParams.append(key, String(value))
        );
    }

    // const token = getAuthToken();
    // const authHeaders: HeadersInit | undefined = token ? {Authorization: `Bearer ${token}`} : {};

    const response = await fetch(url.toString(), {
        ...options,
        headers: {
            "Content-Type": "application/json",
            // ...authHeaders,
            ...headers,
        },
    });

    let responseData: ApiResponse<T> | null = null;

    try {
        responseData = await response.json();
    } catch (error) {
        console.error("JSON parsing failed:", error);
        throw ErrorType.API_ERROR;
    }

    if (!responseData) {
        console.error("Empty or null JSON response.");
        throw ErrorType.API_ERROR;
    }

    if (!response.ok) {
        if (isApiErrorResponse(responseData)) {
            throw responseData.errorType;
        }
        throw ErrorType.API_ERROR;
    }

    assertSuccessResponse(responseData);
    return responseData;
}

function isApiErrorResponse<T>(res: ApiResponse<T>): res is ApiErrorResponse {
    return (
        typeof res === "object" &&
        res !== null &&
        "errorType" in res &&
        Object.values(ErrorType).includes(res.errorType)
    );
}

function assertSuccessResponse<T>(res: ApiResponse<T>): asserts res is T {
    if (isApiErrorResponse(res)) {
        console.error("Expected a success response but received an error structure.");
        throw ErrorType.API_ERROR;
    }
}

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}