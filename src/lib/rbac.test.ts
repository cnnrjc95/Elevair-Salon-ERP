import { describe, expect, it } from 'vitest';
import { buildRolePermissionMap, can } from './rbac';
import { RoleName } from '@prisma/client';

describe('rbac helper', () => {
  const permissionMatrix = [
    { role: { name: RoleName.MANAGER }, permission: { key: 'appointments.manage' } as any },
    { role: { name: RoleName.MANAGER }, permission: { key: 'inventory.manage' } as any },
    { role: { name: RoleName.STYLIST }, permission: { key: 'appointments.view' } as any }
  ];

  const map = buildRolePermissionMap(permissionMatrix as any);

  it('allows managers to manage appointments', () => {
    expect(can(map, [{ role: { name: RoleName.MANAGER } }], 'appointments.manage')).toBe(true);
  });

  it('prevents stylists from managing inventory', () => {
    expect(can(map, [{ role: { name: RoleName.STYLIST } }], 'inventory.manage')).toBe(false);
  });

  it('supports string based roles', () => {
    expect(can(map, [{ role: RoleName.MANAGER }], 'inventory.manage')).toBe(true);
  });
});
