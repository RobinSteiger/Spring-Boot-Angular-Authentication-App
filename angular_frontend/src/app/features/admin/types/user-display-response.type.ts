import type { ApiResponse } from "../../../core/types/api-response.type";
import { UserRole } from "../../../core/types/user-role.type";

export type UserDisplayResponseData = {
    id: number;
    username: string;
    userRole: UserRole[];
};

export type UserDisplayResponse = ApiResponse<UserDisplayResponseData[]>;