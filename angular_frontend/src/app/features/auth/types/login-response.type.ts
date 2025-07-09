import type { ApiResponse } from "../../../core/types/api-response.type";

export type LoginResponseData = {
    accessToken: string,
    refreshToken: string,
};

export type LoginResponse = ApiResponse<LoginResponseData>;