import { UserRole } from "./user-role.type";

export type User = {
    id: number;
    username: string;
    userRole: UserRole[];
}

