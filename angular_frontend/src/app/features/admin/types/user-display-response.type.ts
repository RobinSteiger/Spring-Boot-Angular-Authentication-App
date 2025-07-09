import type { ApiResponse } from "../../../core/types/api-response.type";

export type UserDisplayResponseData = {
    id: number;
    username: string;
    userRole: string[];
};

export type UserDisplayResponse = ApiResponse<UserDisplayResponseData>;