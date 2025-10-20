import { Permission, RoleName } from '@prisma/client';

type RolePermissionMap = Record<RoleName, Set<string>>;

export const buildRolePermissionMap = (permissions: Array<{ role: { name: RoleName }; permission: Permission }>) => {
  return permissions.reduce<RolePermissionMap>((acc, { role, permission }) => {
    if (!acc[role.name]) {
      acc[role.name] = new Set();
    }
    acc[role.name]!.add(permission.key);
    return acc;
  }, {} as RolePermissionMap);
};

export const can = (
  map: RolePermissionMap,
  roles: Array<{ role: { name: RoleName } | RoleName }>,
  permissionKey: string
) => {
  return roles.some((assignment) => {
    const roleName = typeof assignment.role === 'string' ? assignment.role : assignment.role.name;
    return map[roleName]?.has(permissionKey);
  });
};
