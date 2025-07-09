import type { ApiResponse } from "../../../core/types/api-response.type";

export type RegisterResponseData = {
    accessToken: string,
    refreshToken: string,
    message: string
};

export type RegisterResponse = ApiResponse<RegisterResponseData>;