import { ApiResponse } from "../../../core/types/api-response.type";
import { UserRole } from "../../../core/types/user-role.type";


export type UserDetailsResponseData = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    userRole: UserRole[];
}

export type UserDetailsResponse = ApiResponse<UserDetailsResponseData>;

