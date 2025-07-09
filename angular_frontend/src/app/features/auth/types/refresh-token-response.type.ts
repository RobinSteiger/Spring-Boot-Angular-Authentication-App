import type { ApiResponse } from "../../../core/types/api-response.type";

export type RefreshTokenResponseData = {
    accessToken: string,
    refreshToken: string,
};

export type RefreshTokenResponse = ApiResponse<RefreshTokenResponseData>;