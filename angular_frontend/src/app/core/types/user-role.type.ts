export type UserRole = {
    id: number;
    name: string;
}

export function formatRoletoString(role: UserRole): string {
  return role.name.substring(5).toLowerCase();
}